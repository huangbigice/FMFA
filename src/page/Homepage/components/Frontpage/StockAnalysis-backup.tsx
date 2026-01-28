import React from 'react'
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar } from 'recharts'
import './StockAnalysis.css'

interface StockData {
  date: string
  close: number
  open: number
  high: number
  low: number
  volume: number
}

interface StockAnalysisProps {
  stockCode: string
}

// 生成模拟数据
const generateMockData = (stockCode: string): StockData[] => {
  const data: StockData[] = []
  // 使用stockCode的hash值来生成更稳定的随机价格
  const codeHash = stockCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const basePrice = 100 + (codeHash % 50) + Math.random() * 10
  let currentPrice = basePrice
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const change = (Math.random() - 0.5) * 4
    currentPrice = Math.max(50, currentPrice + change)
    
    const open = currentPrice
    const close = open + (Math.random() - 0.5) * 3
    const high = Math.max(open, close) + Math.random() * 2
    const low = Math.min(open, close) - Math.random() * 2
    
    data.push({
      date: date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }),
      close: Math.round(close * 100) / 100,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      volume: Math.floor(Math.random() * 1000000) + 500000
    })
  }
  
  return data
}

// 计算技术指标
const calculateIndicators = (data: StockData[]) => {
  if (data.length === 0) return { ma5: 0, ma20: 0, rsi: 50, macd: 0 }
  
  // MA5 (5日均线)
  const ma5 = data.slice(-5).reduce((sum, d) => sum + d.close, 0) / Math.min(5, data.length)
  
  // MA20 (20日均线)
  const ma20 = data.slice(-20).reduce((sum, d) => sum + d.close, 0) / Math.min(20, data.length)
  
  // 简化的RSI计算
  let gains = 0
  let losses = 0
  for (let i = 1; i < Math.min(14, data.length); i++) {
    const change = data[i].close - data[i - 1].close
    if (change > 0) gains += change
    else losses += Math.abs(change)
  }
  const avgGain = gains / 14
  const avgLoss = losses / 14
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
  const rsi = 100 - (100 / (1 + rs))
  
  // 简化的MACD
  const ema12 = data.slice(-12).reduce((sum, d) => sum + d.close, 0) / Math.min(12, data.length)
  const ema26 = data.slice(-26).reduce((sum, d) => sum + d.close, 0) / Math.min(26, data.length)
  const macd = ema12 - ema26
  
  return {
    ma5: Math.round(ma5 * 100) / 100,
    ma20: Math.round(ma20 * 100) / 100,
    rsi: Math.round(rsi * 100) / 100,
    macd: Math.round(macd * 100) / 100
  }
}

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

function StockAnalysis({ stockCode }: StockAnalysisProps) {
  const [stockData, setStockData] = React.useState<StockData[]>(() => generateMockData(stockCode))
  const indicators = calculateIndicators(stockData)
  const currentPrice = stockData[stockData.length - 1]?.close || 0
  const previousPrice = stockData[stockData.length - 2]?.close || currentPrice
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2)

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
    setStockData(generateMockData(stockCode))
    setMessages([
      {
        id: 1,
        text: `您好！我是AI助手，可以幫您分析 ${stockCode} 的技術指標和投資建議。有什麼問題嗎？`,
        sender: 'ai',
        timestamp: new Date()
      }
    ])
    setInputMessage('')
  }, [stockCode])

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
        text: `關於您的問題「${inputMessage}」，根據 ${stockCode} 的技術指標分析：MA5為 ${indicators.ma5.toFixed(2)}，MA20為 ${indicators.ma20.toFixed(2)}，RSI為 ${indicators.rsi.toFixed(2)}。建議您綜合考慮這些指標做出投資決策。`,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
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
            <span className="stock-price">${currentPrice.toFixed(2)}</span>
            <span className={`stock-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* 模擬價格走勢圖表 實際放Ｋ線圖 */}
      <div className="stock-charts-section">
        <div className="chart-card">
          <h3 className="chart-title">價格走勢</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stockData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 模擬交易量圖表 */}
        <div className="chart-card">
          <h3 className="chart-title">交易量</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stockData}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
                formatter={(value: number) => value.toLocaleString()}
              />
              <Bar
                dataKey="volume"
                fill="url(#colorVolume)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 模擬KD圖表 */}
        <div className="kd-chart">

        </div>

        {/* 模擬MACD圖表 */}
        <div className="macd-chart">

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
                <p className="indicator-value">{indicators.ma5.toFixed(2)}</p>
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
                <p className="indicator-value">{indicators.ma20.toFixed(2)}</p>
              </div>
              <div className="indicator-card">
                <div className="indicator-label-container">
                  <h4 className="indicator-label">RSI</h4>
                  <div className="info-icon-container">
                    <span className="info-icon">!</span>
                    <div className="info-tooltip">
                      <p>RSI（相對強弱指標）：範圍0-100，用於判斷股票是否超買或超賣。RSI &gt; 70 表示可能超買，RSI &lt; 30 表示可能超賣。</p>
                    </div>
                  </div>
                </div>
                <p className={`indicator-value ${indicators.rsi > 70 ? 'overbought' : indicators.rsi < 30 ? 'oversold' : ''}`}>
                  {indicators.rsi.toFixed(2)}
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
                <p className={`indicator-value ${indicators.macd >= 0 ? 'positive' : 'negative'}`}>
                  {indicators.macd >= 0 ? '+' : ''}{indicators.macd.toFixed(2)}
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
