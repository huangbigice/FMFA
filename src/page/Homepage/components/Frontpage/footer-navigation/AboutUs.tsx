import { Link } from 'react-router-dom';
import './AboutUs.css';

const PathURL = import.meta.env.VITE_PATH || '/FA';

export default function AboutUs() {
  return (
    <div className="about-us">
      <Link to={`${PathURL}`} className="about-us-back">
        ← 返回頁面
      </Link>
      <header className="about-us-header">
        <h1 className="about-us-title">關於我們</h1>
        <p className="about-us-lead">
          智慧投資決策——整合即時股票數據、技術指標分析與 AI 驅動的投資建議，幫助您做出更明智的投資決策。
        </p>
      </header>

      <main className="about-us-main">
        <section className="about-us-section">
          <h2>我們的使命與願景</h2>
          <p>
            我們致力於讓投資決策更透明、更有依據。透過整合可靠的市場數據、專業的技術指標與 AI 輔助分析，我們希望協助使用者更清楚地理解市場與個股狀況，並在充分了解風險的前提下，做出符合自身目標的投資選擇。我們相信，<strong>數據與工具</strong>應為人所用，而非取代人的判斷；本平台提供的建議僅供參考，不構成投資建議。
          </p>
        </section>

        <section className="about-us-section">
          <h2>產品簡介</h2>
          <p>
            本平台提供<strong>即時數據</strong>（歷史行情與成交量）、<strong>技術指標</strong>（如均線、RSI、EMA 等）的計算與視覺化、<strong>AI 投資建議</strong>（基於 Random Forest 模型與基本面、技術面評分），以及<strong>回測</strong>功能，讓您可依策略參數檢視歷史模擬表現。資料來源與模型邏輯、評分方式與回測假設等詳細說明，請參閱 <Link to={`${PathURL}/system-directions`} className="about-us-link">系統說明</Link> 頁面。
          </p>
        </section>

        <section className="about-us-section">
          <h2>團隊與品牌</h2>
          <p>
            我們是專注於金融數據與投資策略分析的團隊，致力於將數據科學與投資實務結合，提供易用、透明的分析工具。本平台為 <strong>J & J 金融投資策略平台</strong> 所提供之服務，若您對我們的產品或服務有任何建議或疑問，歡迎透過 <Link to={`${PathURL}/contact-information`} className="about-us-link">聯絡我們</Link> 與我們聯繫。
          </p>
        </section>
      </main>
    </div>
  );
}
