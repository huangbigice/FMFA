import React from 'react';
import './StockAnalysis.css';
import { calculateAllIndicators, type StockIndicators } from '../../../../utils/stockIndicators';
import { useStockIndicators } from '../../../../hooks/useStockIndicators';
import type { StockRow } from '../../../../api/types';
import KLineChart from './charts/KLineChart';
import VolumeChart from './charts/VolumeChart';
import KDChart from './charts/KDChart';
import MACDChart from './charts/MACDChart';

interface StockData {
  date: Date;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

interface StockAnalysisProps {
  stockCode: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

function StockAnalysis({ stockCode }: StockAnalysisProps) {
  const { data: indicatorsData, loading, error } = useStockIndicators(stockCode, {
    period: '10y',
  });

  const stockData: StockData[] = React.useMemo(() => {
    if (!indicatorsData) return [];

    return indicatorsData.data.map((row: StockRow) => {
      const dateValue = 'date' in row ? row.date : null;
      const date = dateValue ? new Date(String(dateValue)) : new Date();

      const open = (row.open as number | null) ?? 0;
      const high = (row.high as number | null) ?? 0;
      const low = (row.low as number | null) ?? 0;
      const close = (row.close as number | null) ?? 0;
      const volume = (row.volume as number | null) ?? 0;

      return {
        date,
        open,
        high,
        low,
        close,
        volume,
      };
    });
  }, [indicatorsData]);

  // 提取数据数组用于指标计算
  const dates = stockData.map((d) => d.date);
  const close = stockData.map((d) => d.close);
  const open = stockData.map((d) => d.open);
  const high = stockData.map((d) => d.high);
  const low = stockData.map((d) => d.low);
  const volume = stockData.map((d) => d.volume);

  // 计算所有技术指标
  const indicators: StockIndicators = React.useMemo(
    () => calculateAllIndicators(close, high, low, volume),
    [close, high, low, volume]
  );

  // 当前价格和涨跌幅
  const currentPrice = stockData[stockData.length - 1]?.close || 0;
  const previousPrice = stockData[stockData.length - 2]?.close || currentPrice || 1;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice
    ? ((priceChange / previousPrice) * 100).toFixed(2)
    : '0.00';

  // 获取最新指标值用于显示（來自後端的技術指標欄位）
  const maList = [5, 10, 20, 60, 120, 240];
  const latestBackendRow = indicatorsData?.data.at(-1) as
    | (StockRow & {
        ma5?: number | null;
        ma20?: number | null;
        rsi_120?: number | null;
        ema200?: number | null;
        return_1?: number | null;
        return_5?: number | null;
      })
    | undefined;

  const latestMA5 = (latestBackendRow?.ma5 as number | null) ?? null;
  const latestMA20 = (latestBackendRow?.ma20 as number | null) ?? null;
  const latestRSI120 = (latestBackendRow?.rsi_120 as number | null) ?? null;
  const latestEMA200 = (latestBackendRow?.ema200 as number | null) ?? null;
  const latestReturn1 = (latestBackendRow?.return_1 as number | null) ?? null;
  const formatValue = (value: number | null, digits: number = 2) =>
    value == null || Number.isNaN(value) ? '--' : value.toFixed(digits);

  // 前端本地計算的 KD / MACD 僅用於圖表，不再用於指標卡片與 AI 文案
  const latestK = indicators.KD.K.at(-1) || 0;
  const latestD = indicators.KD.D.at(-1) || 0;
  const latestMACD = indicators.MACD.MACD.at(-1) || 0;

  // AI聊天框状态
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 1,
      text: `您好！我是AI助手，可以幫您分析 ${stockCode} 的技術指標和投資建議。有什麼問題嗎？`,
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = React.useState('')
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // 当 stockCode 改变时，更新股票数据和重置聊天消息
  React.useEffect(() => {
    setMessages([
      {
        id: 1,
        text: `您好！我是AI助手，可以幫您分析 ${stockCode} 的技術指標和投資建議。有什麼問題嗎？`,
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
    setInputMessage('');
  }, [stockCode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setInputMessage('')

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        text: `關於您的問題「${inputMessage}」，根據 ${stockCode} 的技術指標分析：MA5為 ${formatValue(
          latestMA5
        )}，MA20為 ${formatValue(latestMA20)}，RSI(120) 為 ${formatValue(
          latestRSI120
        )}，EMA200 為 ${formatValue(latestEMA200)}，日報酬率為 ${formatValue(
          latestReturn1,
          4
        )}。建議您綜合考慮這些指標做出投資決策。`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="stock-analysis-container">
      <div className="stock-header">
        <div className="stock-title-section">
          <h2 className="stock-code">{stockCode}</h2>
          <div className="stock-price-section">
            <span className="stock-price">
              {loading ? '載入中...' : `$${currentPrice.toFixed(2)}`}
            </span>
            {!loading && (
              <span className={`stock-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
                {priceChange >= 0 ? '+' : ''}
                {priceChange.toFixed(2)} ({priceChangePercent}%)
              </span>
            )}
          </div>
        </div>
        {error && <div className="stock-error">資料載入失敗：{error}</div>}
      </div>

      {/* K線圖和技術指標圖表 */}
      <div className="stock-charts-section">
        {/* K線圖 */}
        <div className="chart-card">
          <KLineChart
            dates={dates}
            open={open}
            high={high}
            low={low}
            close={close}
            maData={indicators.MAs}
            maList={maList}
          />
        </div>

        {/* 成交量圖表 */}
        <div className="chart-card">
          <VolumeChart dates={dates} volume={volume} close={close} open={open} />
        </div>

        {/* KD 圖表 */}
        <div className="chart-card">
          <KDChart dates={dates} K={indicators.KD.K} D={indicators.KD.D} />
        </div>

        {/* MACD 圖表 */}
        <div className="chart-card">
          <MACDChart
            dates={dates}
            MACD={indicators.MACD.MACD}
            DIF={indicators.MACD.DIF}
            DEA={indicators.MACD.DEA}
          />
        </div>


        {/* AI聊天框和技術指標區塊 */}
        <div className="ai-indicators-row">
          {/* AI聊天框 */}
          <div className="chart-card ai-chat-block">
            <h3 className="chart-title">AI 助手</h3>
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <div className="message-content">
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="輸入您的問題..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="chat-send-button"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                發送
              </button>
            </div>
          </div>

          {/* 技術指標區塊 */}
          <div className="chart-card indicators-block">
            <h3 className="chart-title">技術指標</h3>
            <div className="indicators-grid">
              <div className="indicator-card">
                <div className="indicator-label-container">
                  <h4 className="indicator-label">MA5</h4>
                  <div className="info-icon-container">
                    <span className="info-icon">!</span>
                    <div className="info-tooltip">
                      <p>MA5（5日均線）：過去5個交易日的平均收盤價，用於判斷短期價格趨勢。當股價高於MA5時，通常表示短期上漲趨勢。</p>
                    </div>
                  </div>
                </div>
                <p className="indicator-value">{formatValue(latestMA5)}</p>
              </div>
              <div className="indicator-card">
                <div className="indicator-label-container">
                  <h4 className="indicator-label">MA20</h4>
                  <div className="info-icon-container">
                    <span className="info-icon">!</span>
                    <div className="info-tooltip">
                      <p>MA20（20日均線）：過去20個交易日的平均收盤價，用於判斷中期價格趨勢。當股價高於MA20時，通常表示中期上漲趨勢。</p>
                    </div>
                  </div>
                </div>
                <p className="indicator-value">{formatValue(latestMA20)}</p>
              </div>
              <div className="indicator-card">
                <div className="indicator-label-container">
                  <h4 className="indicator-label">KD</h4>
                  <div className="info-icon-container">
                    <span className="info-icon">!</span>
                    <div className="info-tooltip">
                      <p>KD指標：隨機指標，用於判斷超買超賣。K值 &gt; 80 或 D值 &gt; 80 表示可能超買，K值 &lt; 20 或 D值 &lt; 20 表示可能超賣。</p>
                    </div>
                  </div>
                </div>
                <p
                  className={`indicator-value ${
                    latestK > 80 || latestD > 80
                      ? 'overbought'
                      : latestK < 20 || latestD < 20
                        ? 'oversold'
                        : ''
                  }`}
                >
                  K: {latestK.toFixed(2)} D: {latestD.toFixed(2)}
                </p>
              </div>
              <div className="indicator-card">
                <div className="indicator-label-container">
                  <h4 className="indicator-label">MACD</h4>
                  <div className="info-icon-container">
                    <span className="info-icon">!</span>
                    <div className="info-tooltip">
                      <p>MACD（指數平滑移動平均線）：通過計算12日EMA和26日EMA的差值來判斷趨勢。MACD &gt; 0 表示上升趨勢，MACD &lt; 0 表示下降趨勢。</p>
                    </div>
                  </div>
                </div>
                <p
                  className={`indicator-value ${latestMACD >= 0 ? 'positive' : 'negative'}`}
                >
                  {latestMACD >= 0 ? '+' : ''}
                  {latestMACD.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockAnalysis
