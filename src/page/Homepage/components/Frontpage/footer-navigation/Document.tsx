import { Link } from 'react-router-dom';
import './Document.css';

const PathURL = import.meta.env.VITE_PATH || '/FA';

export default function Document() {
  return (
    <div className="document-page">
      <Link to={`${PathURL}`} className="document-page-back">
        ← 返回頁面
      </Link>
      <header className="document-page-header">
        <h1 className="document-page-title">文檔</h1>
        <p className="document-page-lead">
          本頁為產品與系統文檔入口，提供快速開始指引與功能說明，協助您快速上手本平台。
        </p>
      </header>

      <main className="document-page-main">
        <section className="document-page-section">
          <h2>快速開始</h2>
          <p>
            使用本平台進行股票分析，只需三個步驟：
          </p>
          <ol className="document-page-list document-page-list--ordered">
            <li><strong>搜尋股票</strong>：從首頁點選「開始分析」進入搜尋頁，輸入股票代碼或公司名稱（台股請使用 .TW 格式，例如 2330.TW）。</li>
            <li><strong>查看分析</strong>：進入個股頁面後，可瀏覽即時價格、技術指標圖表、均線與 RSI 等指標，以及最新相關新聞。</li>
            <li><strong>解讀建議</strong>：系統會依模型輸出「長期持有」「觀望」或「不建議持有」建議，並提供買進機率、系統評分、技術面與基本面評分，供您綜合參考。</li>
          </ol>
          <p>
            更詳細的系統邏輯與評分方式，請參閱 <Link to={`${PathURL}/system-directions`} className="document-page-link">系統說明</Link> 頁面。
          </p>
        </section>

        <section className="document-page-section">
          <h2>功能說明</h2>
          <p>
            本平台主要功能如下，可依需求前往對應頁面了解詳情：
          </p>
          <ul className="document-page-list">
            <li><strong>即時數據與歷史行情</strong>：透過 yfinance 取得開、高、低、收、量等歷史資料，查詢時可指定區間（如 1 年、5 年、10 年）。</li>
            <li><strong>技術指標</strong>：計算多組均線（MA）、多週期 RSI、EMA 等，並以圖表呈現。詳見 <Link to={`${PathURL}/analysis-tools`} className="document-page-link">分析工具</Link>。</li>
            <li><strong>AI 投資建議</strong>：採用 Random Forest 分類模型，結合價格、均線、RSI、基本面評分等特徵，輸出持有建議與機率。詳見 <Link to={`${PathURL}/function`} className="document-page-link">功能</Link> 與系統說明。</li>
            <li><strong>回測</strong>：可依策略參數（訊號閾值、持有天數、手續費、停損規則等）進行歷史回測，結果僅供參考，不保證未來表現。</li>
          </ul>
        </section>

        <section className="document-page-section">
          <h2>進階說明與 API</h2>
          <p>
            系統的資料來源、模型類型、評分公式與回測假設等進階說明，請參閱 <Link to={`${PathURL}/system-directions`} className="document-page-link">系統說明</Link>。若您需要 API 文檔或開發者資源，敬請期待後續更新，或透過 <Link to={`${PathURL}/contact-information`} className="document-page-link">聯絡我們</Link> 詢問。
          </p>
        </section>
      </main>
    </div>
  );
}
