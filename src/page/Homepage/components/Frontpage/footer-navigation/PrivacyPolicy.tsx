import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';

const PathURL = import.meta.env.VITE_PATH || '/FA';

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy">
      <Link to={`${PathURL}`} className="privacy-policy-back">
        ← 返回頁面
      </Link>
      <header className="privacy-policy-header">
        <h1 className="privacy-policy-title">隱私權政策</h1>
        <p className="privacy-policy-lead">
          本政策說明我們如何蒐集、使用與保護您的資料。使用本平台即表示您已閱讀並同意本政策之內容。
        </p>
      </header>

      <main className="privacy-policy-main">
        <section className="privacy-policy-section">
          <h2>政策適用範圍與目的</h2>
          <p>
            本隱私權政策適用於所有使用本平台（包含股票分析、技術指標、AI 建議與回測等服務）之使用者。我們制定本政策之目的在於<strong>保護個人資料</strong>、<strong>符合相關法規</strong>，並以<strong>透明化</strong>方式說明資料之蒐集、使用與保護措施，讓您了解自身權益。
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>蒐集之資料類型與方式</h2>
          <p>
            我們可能蒐集之資料類型與方式如下：
          </p>
          <ul>
            <li><strong>您主動提供或操作產生之資料</strong>：例如查詢時輸入之股票代碼、所選之資料區間（如 3 個月、6 個月、12 個月、24 個月）等，於您使用分析、搜尋或回測功能時產生。</li>
            <li><strong>使用紀錄與技術資料</strong>：例如 IP 位址、存取時間、瀏覽器類型、裝置資訊等，透過伺服器日誌或類似技術自動記錄。</li>
            <li><strong>Cookie 與類似技術</strong>：為維持服務運作、記住偏好或進行統計，我們可能使用 Cookie、本地儲存等技術，詳見下方「Cookie 與類似技術」一節。</li>
          </ul>
          <p>
            以上蒐集均以提供與改善本平台服務、保障系統安全為目的，並依本政策及相關法令為之。
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>資料使用目的</h2>
          <p>
            我們將蒐集之資料用於下列目的：
          </p>
          <ul>
            <li><strong>提供分析服務</strong>：依您之查詢與設定，提供股票數據、技術指標、AI 建議與回測結果。</li>
            <li><strong>改善系統與使用體驗</strong>：分析使用情形（含匿名或彙總數據），以優化功能、效能與介面。</li>
            <li><strong>安全與防濫用</strong>：偵測、防範異常存取、爬蟲或違反服務條款之行為，以維護系統穩定與其他使用者權益。</li>
            <li><strong>統計與匿名分析</strong>：在無法識別個人身分之前提下，進行整體使用趨勢或行為統計，供營運與產品決策參考。</li>
          </ul>
        </section>

        <section className="privacy-policy-section">
          <h2>資料保存與保護</h2>
          <p>
            我們依<strong>服務需求與法令要求</strong>決定資料保存期限；逾保存期限或經您請求刪除且無保留義務時，將予以刪除或匿名化。在保存期間內，我們採取適當之<strong>技術與管理措施</strong>（例如傳輸加密、存取控制、伺服器安全設定）保護您的資料，並僅由授權人員基於業務需要接觸；除法律要求或本政策另有說明外，我們不會向未授權之第三人揭露您的個人資料。
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>Cookie 與類似技術</h2>
          <p>
            本平台可能使用<strong>Cookie</strong>或類似技術（如本地儲存），用於維持作業階段、記住您的偏好設定，或進行匿名之流量與使用分析。您可透過瀏覽器設定管理或刪除 Cookie；若您選擇停用或封鎖特定 Cookie，部分功能（例如記住偏好）可能無法正常運作，但不影響您使用核心分析與查詢功能。
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>第三方服務與連結</h2>
          <p>
            本平台之資料來源或技術可能涉及<strong>第三方服務</strong>（例如資料供應商、雲端或託管服務）；我們僅與具備適當安全與隱私承諾之合作方合作。若本網站含有對外部網站之連結，該等網站之隱私做法由各該網站負責，建議您另行閱讀其隱私政策。目前我們<strong>未將您之個人資料出售或與第三方共享用於行銷目的</strong>；若未來政策有所變更，將於本網站公告並更新本政策。
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>用戶權利</h2>
          <p>
            依個人資料保護相關法規，您對自身個人資料享有下列權利，並得向我們提出請求：
          </p>
          <ul>
            <li><strong>查詢、閱覽</strong>：了解我們是否持有您的個人資料及其內容。</li>
            <li><strong>補充或更正</strong>：請求補充不完整之資料或更正錯誤之資料。</li>
            <li><strong>請求停止蒐集、利用或刪除</strong>：於符合法令及契約約定之前提下，請求停止蒐集、利用或刪除您的個人資料。</li>
          </ul>
          <p>
            若您欲行使上述權利，請透過本網站所載之聯絡方式（例如首頁或系統說明頁之聯絡管道）與我們聯繫，我們將依法律規定之期限與方式處理您的請求。
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>政策更新與生效</h2>
          <p>
            我們得隨時修訂本隱私權政策。修訂後之內容將<strong>公告於本網站</strong>，並自公告時或公告所載之生效日起適用。建議您<strong>定期查看</strong>本頁面，以掌握最新政策內容。您繼續使用本平台即視為同意修訂後之政策。
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>聯絡方式</h2>
          <p>
            若您對本隱私權政策或個人資料之蒐集、利用、保存有任何疑問或欲行使上述權利，請透過首頁或系統說明頁所載之聯絡管道與我們聯繫，我們將儘速回覆。
          </p>
          <p className="privacy-policy-updated">
            最後更新日期：2025-02-02
          </p>
        </section>
      </main>
    </div>
  );
}
