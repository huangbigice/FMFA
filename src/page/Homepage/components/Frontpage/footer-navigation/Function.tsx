import { Link } from 'react-router-dom';
import './Function.css';

const PathURL = import.meta.env.VITE_PATH || '/FA';

export default function Function() {
  return (
    <div className="function-page">
      <Link to={`${PathURL}`} className="function-page-back">
        ← 返回頁面
      </Link>
      <header className="function-page-header">
        <h1 className="function-page-title">功能</h1>
        <p className="function-page-lead">
          本頁說明本平台的核心功能、使用流程與其他延伸功能，協助您快速上手並善用各項服務。
        </p>
      </header>

      <main className="function-page-main">
        <section className="function-page-section">
          <h2>核心功能</h2>
          <p>
            本平台整合即時股票數據、技術指標分析與 AI 驅動的投資建議，提供以下三大核心功能：
          </p>
          <ul>
            <li><strong>即時數據分析</strong>：實時獲取股票價格、交易量與歷史數據，支援多個股票市場與代碼（如台股 .TW），可依需求選擇不同時間區間檢視。</li>
            <li><strong>技術指標計算</strong>：計算 MA、MACD、RSI、KD、EMA、報酬率等專業技術指標，並以 K 線圖、成交量圖、KD 圖、MACD 圖等方式視覺化展示，便於技術分析。</li>
            <li><strong>AI 投資建議</strong>：基於技術指標、基本面評分與市場數據，透過機器學習模型產出買進機率、系統評分與文字建議（不建議持有／觀望／長期持有），供您綜合參考。</li>
          </ul>
        </section>

        <section className="function-page-section">
          <h2>使用流程</h2>
          <p>
            使用本平台進行投資分析，可依下列三步驟操作：
          </p>
          <ul>
            <li><strong>搜尋股票</strong>：於分析頁面輸入股票代碼或公司名稱進行搜尋，並選擇欲檢視的歷史資料區間（如 3 個月、6 個月、12 個月、24 個月）。</li>
            <li><strong>查看分析</strong>：瀏覽價格走勢、成交量與各項技術指標圖表，切換不同指標組（MA、RSI、EMA、KD、MACD 等）以多角度解讀行情。</li>
            <li><strong>獲取建議</strong>：查看 AI 生成的投資建議、買進機率、系統評分與技術面／基本面評分，並可依需要執行回測，了解策略在歷史區間的表現。</li>
          </ul>
          <p>
            詳細操作與各分析工具說明請參考首頁「分析工具」與「系統說明」頁面。
          </p>
        </section>

        <section className="function-page-section">
          <h2>其他功能</h2>
          <p>
            除上述核心流程外，本平台另提供：
          </p>
          <ul>
            <li><strong>回測</strong>：指定起訖日期查詢策略的歷史回測結果與權益曲線，協助您理解策略在過往資料上的表現（過往績效不保證未來結果）。</li>
            <li><strong>系統評分與風險</strong>：系統評分由模型機率、技術面與基本面加權計算，可搭配「系統說明」頁面了解評分公式、閾值與回測假設，以便更完整地解讀建議與風險。</li>
          </ul>
          <p>
            若需進一步了解資料來源、模型邏輯與回測假設，請前往「系統說明」頁面查閱。
          </p>
        </section>
      </main>
    </div>
  );
}
