import { Link } from 'react-router-dom';
import './Service.css';

const PathURL = import.meta.env.VITE_PATH || '/FA';

export default function Service() {
  return (
    <div className="service">
      <Link to={`${PathURL}`} className="service-back">
        ← 返回頁面
      </Link>
      <header className="service-header">
        <h1 className="service-title">服務條款</h1>
        <p className="service-lead">
          請在使用本平台前詳閱以下服務條款。使用本服務即表示您同意遵守本條款之規定。
        </p>
      </header>

      <main className="service-main">
        <section className="service-section">
          <h2>服務說明與範圍</h2>
          <p>
            本平台提供<strong>股票分析</strong>、<strong>技術指標計算與圖表</strong>、<strong>AI 驅動之投資建議與評分</strong>，以及<strong>回測功能</strong>等服務。服務對象為使用本網站進行個人研究與參考之使用者。服務範圍以本網站實際提供之功能為準，我們保留依營運需要調整服務內容之權利。
          </p>
        </section>

        <section className="service-section">
          <h2>使用規範與禁止行為</h2>
          <p>
            您同意以合法、合理之方式使用本服務，並遵守下列規範：
          </p>
          <ul>
            <li>不得以<strong>爬蟲、機器人</strong>或任何自動化程式大量存取、擷取本平台資料，或干擾系統正常運作。</li>
            <li>不得將本平台之分析結果、建議或資料作為<strong>唯一投資依據</strong>；所有決策應由您自行綜合判斷並自負責任。</li>
            <li>不得將本服務用於任何違反法令、侵害他人權益或妨害公共秩序之行為。</li>
            <li>不得擅自重製、改作、散布本平台之程式、介面或內容，或用於商業用途，除非另有書面授權。</li>
          </ul>
          <p>
            若發現有違反上述規範之行為，我們得暫停或終止您對本服務之使用，並保留法律追訴權。
          </p>
        </section>

        <section className="service-section">
          <h2>免責聲明</h2>
          <p>
            本平台所提供之<strong>所有分析、預測、評分與文字建議</strong>（包含但不限於模型建議、買進機率、系統評分、技術面與基本面評分）<strong>僅供參考與研究使用</strong>，不構成任何投資建議、要約或招攬。過往績效與回測結果不保證未來表現，投資有風險，您應自行評估並承擔投資決策之全部責任。
          </p>
          <p>
            我們不對因使用或無法使用本服務所產生之任何直接、間接、衍生或附帶損害負責。
          </p>
        </section>

        <section className="service-section">
          <h2>智慧財產與授權</h2>
          <p>
            本平台之<strong>程式碼、介面設計、圖表、文字說明及相關內容</strong>之智慧財產權均屬本平台或授權人所有。除本條款另有規定外，未經我們事先書面同意，您不得重製、改作、散布、公開傳輸或為任何商業利用。您使用本服務僅取得依本網站正常操作所需之<strong>個人、非商業使用</strong>授權。
          </p>
        </section>

        <section className="service-section">
          <h2>服務變更、暫停與終止</h2>
          <p>
            我們保留<strong>調整、暫停或終止</strong>全部或部分服務之權利。若進行重大變更（例如功能下線、服務中斷），將於本網站以公告方式說明；惟遇緊急狀況或不可抗力時，得先行暫停或調整後再行公告。您若不同意變更後之條款或服務內容，應停止使用本服務。
          </p>
        </section>

        <section className="service-section">
          <h2>準據法與爭議處理</h2>
          <p>
            本服務條款之解釋與適用，以<strong>中華民國法律</strong>為準據法。因本條款或使用本服務所生之爭議，雙方同意先以善意協調方式解決；若無法達成共識，得依中華民國法律及有管轄權之法院處理。如有任何疑問，請先透過本網站所載之聯絡方式與我們聯繫。
          </p>
        </section>

        <section className="service-section">
          <h2>條款修訂與聯絡方式</h2>
          <p>
            我們得隨時修訂本服務條款，修訂後之內容將公告於本網站，<strong>以網站公告為準</strong>。您繼續使用本服務即視為同意修訂後之條款。若您對本條款或本服務有任何疑問或建議，請透過首頁或系統說明頁所載之聯絡管道與我們聯繫。
          </p>
          <p className="service-updated">
            最後更新日期：2025-02-02
          </p>
        </section>
      </main>
    </div>
  );
}
