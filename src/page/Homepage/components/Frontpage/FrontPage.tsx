// import { useState } from 'react'
import './FrontPage.css'
import { useNavigate, Link } from 'react-router-dom'
// import ProductDemoOverlay from './ProductDemoOverlay'

function FrontPage() {
    const navigate = useNavigate()
    // const [showDemoAnimation, setShowDemoAnimation] = useState(false)

    const enterAnalysis = () => {
        navigate('stocksearch')
    }

  return (
    <div className="front-page">
      {/* {showDemoAnimation && (
        <ProductDemoOverlay onClose={() => setShowDemoAnimation(false)} />
      )} */}
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">金融投資策略</div>
          <div className="header-nav">
            <span className="user-name">username</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">智慧投資決策</h1>
          <p className="hero-description">
            整合即時股票數據、技術指標分析與AI驅動的投資建議,幫助您做出更明智的投資決策。
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" 
                onClick={enterAnalysis}
            >
              開始分析 →
            </button>
            {/* <button className="btn-secondary" onClick={() => setShowDemoAnimation(true)}>瀏覽動畫</button> */}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="features-section">
        <div className="features-content">
          <h2 className="features-title">核心功能</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon chart-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12L9 6L13 10L21 2M21 2H15M21 2V8" />
                </svg>
              </div>
              <h3 className="feature-title">即時數據分析</h3>
              <p className="feature-description">
                實時獲取股票價格、交易量、歷史數據,支援多個股票市場和代碼。
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon bar-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="12" width="4" height="8" />
                  <rect x="10" y="8" width="4" height="12" />
                  <rect x="16" y="4" width="4" height="16" />
                </svg>
              </div>
              <h3 className="feature-title">技術指標計算</h3>
              <p className="feature-description">
                計算 MA、MACD、RSI、Bollinger Bands 等專業技術指標,視覺化展示。
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon lightning-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 className="feature-title">AI投資建議</h3>
              <p className="feature-description">
                基於技術指標、新聞情緒分析和市場數據,生成個性化的投資建議。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="how-to-section">
        <div className="how-to-content">
          <div className="how-to-left">
            <h2 className="how-to-title">如何使用</h2>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3 className="step-title">搜尋股票</h3>
                  <p className="step-description">輸入股票代碼或公司名稱進行搜尋</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3 className="step-title">查看分析</h3>
                  <p className="step-description">瀏覽詳細的技術指標、圖表和最新新聞</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3 className="step-title">獲取建議</h3>
                  <p className="step-description">接收 AI 生成的個性化投資建議和風險評估</p>
                </div>
              </div>
            </div>
          </div>
          <div className="how-to-right">
            <div className="how-to-visual">
              <div className="visual-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="12" width="4" height="8" />
                  <rect x="10" y="8" width="4" height="12" />
                  <rect x="16" y="4" width="4" height="16" />
                </svg>
              </div>
              <p className="visual-text">專業的投資分析工具</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4 className="footer-title">產品</h4>
            <ul className="footer-links">
              <li><Link to="analysis-tools" className="footer-link">分析工具</Link></li>
              <li><Link to="function" className="footer-link">功能</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">資源</h4>
            <ul className="footer-links">
              <li><Link to="system-directions" className="footer-link">系統說明</Link></li>
              <li><Link to="document" className="footer-link">文檔</Link></li>
              <li><Link to="common-qa" className="footer-link">常見問題</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">公司</h4>
            <ul className="footer-links">
              <li><Link to="about-us" className="footer-link">關於我們</Link></li>
              <li><Link to="contact-information" className="footer-link">聯繫我們</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">法律</h4>
            <ul className="footer-links">
              <li><Link to="privacy-policy" className="footer-link">隱私政策</Link></li>
              <li><Link to="service" className="footer-link">服務條款</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-copyright">
          © 2026  J & J 金融投資策略平台。保留所有權利。
        </div>
      </footer>
    </div>
  )
}

export default FrontPage