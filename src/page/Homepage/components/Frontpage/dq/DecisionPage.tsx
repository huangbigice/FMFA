import { useMemo, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useVirtualOrders } from '../../../../../contexts/VirtualOrderContext';
import type { VirtualOrder, VirtualOrderSource, StockRow } from '../../../../../api/types';
import { fetchStockIndicators } from '../../../../../api/stockApi';
import { getCloseAfterSevenTradingDays } from '../../../../../utils/sevenDayClose';
import { normalizeTaiwanSymbol } from '../../../../../api/symbol';
import './DecisionPage.css';

const SOURCE_LABELS: Record<VirtualOrderSource, string> = {
  ai_reference: '依 AI 建議',
  self: '自主判斷',
  mixed: '混合',
};

const SOURCE_COLORS = ['#2563eb', '#22c55e', '#f59e0b'];

interface DecisionPageProps {
  stockCode?: string;
}

export default function DecisionPage({ stockCode }: DecisionPageProps) {
  const { orders } = useVirtualOrders();

  const sourceStats = useMemo(() => {
    const counts: Record<VirtualOrderSource, number> = {
      ai_reference: 0,
      self: 0,
      mixed: 0,
    };
    orders.forEach((o: VirtualOrder) => {
      counts[o.source] += 1;
    });
    return (['ai_reference', 'self', 'mixed'] as VirtualOrderSource[]).map((key) => ({
      name: SOURCE_LABELS[key],
      value: counts[key],
    }));
  }, [orders]);

  const sideStats = useMemo(() => {
    let buy = 0;
    let sell = 0;
    orders.forEach((o: VirtualOrder) => {
      if (o.side === 'buy') buy += 1;
      else sell += 1;
    });
    return [
      { name: '買進', value: buy },
      { name: '賣出', value: sell },
    ];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (!stockCode) return orders;
    return orders.filter((o: VirtualOrder) => o.stockCode === stockCode);
  }, [orders, stockCode]);

  return (
    <div className="decision-page">
      <div className="dq-header">
        <h2 className="dq-title">DQ 決策品質儀表板</h2>
        <p className="dq-desc">決策品質向量（DQV）：人類操作行為的參考來源與買賣佔比</p>
      </div>

      <div className="dq-dashboard">
        <div className="dq-card dq-pie-card">
          <h3 className="dq-card-title">參考來源佔比（使用或參考）</h3>
          {sourceStats.every((s) => s.value === 0) ? (
            <div className="dq-empty">尚無虛擬下單紀錄</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={sourceStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name} ${value} 筆`}
                  labelLine={false}
                >
                  {sourceStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} 筆`, '次數']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="dq-card dq-pie-card">
          <h3 className="dq-card-title">買賣佔比</h3>
          {sideStats.every((s) => s.value === 0) ? (
            <div className="dq-empty">尚無虛擬下單紀錄</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={sideStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name} ${value} 筆`}
                  labelLine={false}
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} 筆`, '次數']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="dq-verification-section">
        <h3 className="dq-card-title">7 日印證</h3>
        <p className="dq-verification-desc">
          已滿 7 個交易日之虛擬訂單，比對下單日與 7 日後收盤價方向是否一致。
        </p>
        <SevenDayVerification orders={filteredOrders} />
      </div>
    </div>
  );
}

interface SevenDayVerificationProps {
  orders: VirtualOrder[];
}

/** 判斷方向是否一致：買進後 7 日收盤 > 下單價為一致；賣出後 7 日收盤 < 下單價為一致 */
function isDirectionConsistent(side: 'buy' | 'sell', orderPrice: number, closeAfter7: number): boolean {
  if (side === 'buy') return closeAfter7 > orderPrice;
  return closeAfter7 < orderPrice;
}

function SevenDayVerification({ orders }: SevenDayVerificationProps) {
  const [stockDataCache, setStockDataCache] = useState<Record<string, StockRow[]>>({});
  const [loading, setLoading] = useState(false);

  const uniqueSymbols = useMemo(() => {
    const set = new Set(orders.map((o: VirtualOrder) => o.stockCode));
    return Array.from(set);
  }, [orders]);

  const symbolsKey = uniqueSymbols.join(',');

  useEffect(() => {
    if (uniqueSymbols.length === 0) return;

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      await Promise.resolve();
      setLoading(true);
      try {
        const results = await Promise.all(
          uniqueSymbols.map(async (symbol: string) => {
            try {
              const res = await fetchStockIndicators(symbol, '10y', controller.signal);
              return { symbol, data: res.data };
            } catch {
              return { symbol, data: [] as StockRow[] };
            }
          })
        );
        if (cancelled || controller.signal.aborted) return;
        const next: Record<string, StockRow[]> = {};
        results.forEach((r) => {
          next[r.symbol] = r.data;
        });
        setStockDataCache((prev) => ({ ...prev, ...next }));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
    // symbolsKey 為 uniqueSymbols 的穩定字串，避免依賴陣列每次重算
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolsKey]);

  if (orders.length === 0) {
    return (
      <div className="dq-verification-list">
        <div className="dq-empty">尚無虛擬下單紀錄</div>
      </div>
    );
  }

  const rows = orders.map((order) => {
    const rowsForStock = stockDataCache[order.stockCode] ?? [];
    const closeAfter7 = getCloseAfterSevenTradingDays(order.orderDate, rowsForStock);
    const hasResult = closeAfter7 != null;
    const consistent =
      hasResult ? isDirectionConsistent(order.side, order.price, closeAfter7) : null;

    return {
      order,
      closeAfter7: closeAfter7 ?? undefined,
      hasResult,
      consistent,
    };
  });

  return (
    <div className="dq-verification-list">
      {loading && <p className="dq-loading">載入股價資料中…</p>}
      <div className="dq-verification-table-wrap">
        <table className="dq-verification-table">
          <thead>
            <tr>
              <th>下單日</th>
              <th>股票</th>
              <th>方向</th>
              <th>數量</th>
              <th>下單價</th>
              <th>7 日後收盤</th>
              <th>方向一致</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ order, closeAfter7, hasResult, consistent }) => (
              <tr key={order.id}>
                <td>{order.orderDate.slice(0, 10)}</td>
                <td>{normalizeTaiwanSymbol(order.stockCode)}</td>
                <td>{order.side === 'buy' ? '買進' : '賣出'}</td>
                <td>{order.quantity}</td>
                <td>{order.price.toFixed(2)}</td>
                <td>{hasResult ? (closeAfter7!.toFixed(2)) : '未滿 7 日／無資料'}</td>
                <td>
                  {consistent === true && <span className="dq-consistent">一致</span>}
                  {consistent === false && <span className="dq-inconsistent">不一致</span>}
                  {consistent === null && <span className="dq-pending">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
