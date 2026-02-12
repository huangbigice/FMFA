import { useState, useCallback, useEffect } from 'react';
import { useVirtualOrders } from '../../../../contexts/VirtualOrderContext';
import type { VirtualOrderSource } from '../../../../api/types';
import { normalizeTaiwanSymbol } from '../../../../api/symbol';

const SOURCE_OPTIONS: { value: VirtualOrderSource; label: string }[] = [
  { value: 'ai_reference', label: '依 AI 建議' },
  { value: 'self', label: '自主判斷' },
  { value: 'mixed', label: '混合' },
];

interface VirtualOrderFormProps {
  stockCode: string;
  currentPrice: number;
}

export default function VirtualOrderForm({ stockCode, currentPrice }: VirtualOrderFormProps) {
  const { addOrder } = useVirtualOrders();
  const [modalOpened, setModalOpened] = useState(false);

  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<string>('1000');
  const [price, setPrice] = useState<string>(currentPrice > 0 ? String(currentPrice.toFixed(2)) : '');
  const [source, setSource] = useState<VirtualOrderSource>('self');
  const [note, setNote] = useState('');

  const displaySymbol = normalizeTaiwanSymbol(stockCode);

  // 當 currentPrice 變更時同步預設價（延遲 setState 避免 effect 內同步更新觸發 cascading renders）
  useEffect(() => {
    if (currentPrice <= 0) return;
    const id = setTimeout(() => {
      setPrice(currentPrice.toFixed(2));
    }, 0);
    return () => clearTimeout(id);
  }, [currentPrice]);

  const qty = parseInt(quantity, 10) || 0;
  const priceNum = parseFloat(price) || 0;
  const amount = qty * priceNum;
  const canSubmit = qty > 0 && priceNum > 0;

  const handleSubmitOrder = useCallback(() => {
    if (!canSubmit) return;
    setModalOpened(true);
  }, [canSubmit]);

  const handleConfirm = useCallback(() => {
    if (!canSubmit) return;
    addOrder({
      stockCode,
      side,
      quantity: qty,
      price: priceNum,
      source,
      note: note.trim() || undefined,
    });
    setModalOpened(false);
    setQuantity('1000');
    setPrice(currentPrice > 0 ? currentPrice.toFixed(2) : '');
    setNote('');
  }, [addOrder, stockCode, side, qty, priceNum, source, note, currentPrice, canSubmit]);

  const handleCancel = useCallback(() => {
    setModalOpened(false);
  }, []);

  useEffect(() => {
    if (!modalOpened) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel();
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [modalOpened, handleCancel]);

  return (
    <>
      <div className="virtual-order-section">
        <h3 className="chart-title">虛擬下單</h3>
        <p className="virtual-order-desc">模擬交易：可自訂買賣方向、數量與價位，下單前會請您確認。</p>
        <div className="virtual-order-form">
          <div className="virtual-order-row virtual-order-row-with-submit">
            <label className="virtual-order-label">方向</label>
            <div className="virtual-order-buttons">
              <button
                type="button"
                className={`virtual-order-btn ${side === 'buy' ? 'active buy' : ''}`}
                onClick={() => setSide('buy')}
              >
                買進
              </button>
              <button
                type="button"
                className={`virtual-order-btn ${side === 'sell' ? 'active sell' : ''}`}
                onClick={() => setSide('sell')}
              >
                賣出
              </button>
            </div>
            <div className="virtual-order-actions">
              <button
                type="button"
                className="virtual-order-submit"
                onClick={handleSubmitOrder}
                disabled={!canSubmit}
              >
                送出下單
              </button>
            </div>
          </div>
          <div className="virtual-order-row">
            <label className="virtual-order-label">數量（股）</label>
            <input
              type="number"
              min={1}
              step={1}
              className="virtual-order-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="virtual-order-row">
            <label className="virtual-order-label">{side === 'buy' ? '買入價' : '賣出價'}</label>
            <input
              type="number"
              min={0}
              step={0.01}
              className="virtual-order-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="請輸入價位"
            />
          </div>
          <div className="virtual-order-row">
            <label className="virtual-order-label">參考來源</label>
            <select
              className="virtual-order-select"
              value={source}
              onChange={(e) => setSource(e.target.value as VirtualOrderSource)}
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="virtual-order-row">
            <label className="virtual-order-label">備註（選填）</label>
            <input
              type="text"
              className="virtual-order-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例如：依 AI 建議"
            />
          </div>
        </div>
      </div>

      {modalOpened && (
        <div
          className="virtual-order-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="virtual-order-confirm-title"
        >
          <div className="virtual-order-confirm-backdrop" onClick={handleCancel} />
          <div className="virtual-order-confirm-dialog">
            <h3 id="virtual-order-confirm-title" className="virtual-order-confirm-title">
              確認虛擬下單
            </h3>
            <div className="virtual-order-confirm-body">
              <p><strong>股票</strong>：{displaySymbol}</p>
              <p><strong>方向</strong>：{side === 'buy' ? '買進' : '賣出'}</p>
              <p><strong>數量</strong>：{qty} 股</p>
              <p><strong>價位</strong>：{priceNum.toFixed(2)}</p>
              <p><strong>預估金額</strong>：{amount.toFixed(2)}</p>
              <p><strong>參考來源</strong>：{SOURCE_OPTIONS.find((o) => o.value === source)?.label}</p>
              {note.trim() && <p><strong>備註</strong>：{note.trim()}</p>}
            </div>
            <div className="virtual-order-confirm-actions">
              <button type="button" className="virtual-order-confirm-btn secondary" onClick={handleCancel}>
                取消
              </button>
              <button type="button" className="virtual-order-confirm-btn primary" onClick={handleConfirm}>
                確認
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
