import { Link } from 'react-router-dom';
import './AnalysisTools.css';

const PathURL = import.meta.env.VITE_PATH || '/FA';

export default function AnalysisTools() {
  return (
    <div className="analysis-tools">
      <Link to={`${PathURL}`} className="analysis-tools-back">
        ← 返回頁面
      </Link>
      <header className="analysis-tools-header">
        <h1 className="analysis-tools-title">分析工具</h1>
        <p className="analysis-tools-lead">
          本頁說明本系統提供的分析工具：股票搜尋與資料區間、技術指標與圖表、AI 預測與評分、回測功能，供您快速了解各工具用途與使用情境。
        </p>
      </header>

      <main className="analysis-tools-main">
        <section className="analysis-tools-section">
          <h2>搜尋與資料區間</h2>
          <p>
            在分析頁面可輸入股票代碼或公司名稱進行搜尋。系統支援多市場標的，例如台股請使用代碼加上 .TW（如 2330.TW）。搜尋後可選擇歷史資料區間，目前提供 <strong>3 個月</strong>、<strong>6 個月</strong>、<strong>12 個月</strong>、<strong>24 個月</strong> 等選項，依您需求檢視不同時間跨度的行情與指標。
          </p>
          <p>
            每次查詢會向資料源取得當時可用的最新資料，分析與預測皆基於所選區間內的歷史資料進行計算。
          </p>
        </section>

        <section className="analysis-tools-section">
          <h2>技術指標與圖表</h2>
          <p>
            系統提供多種技術指標計算與視覺化圖表，協助您從不同角度解讀價格與成交量：
          </p>
          <ul>
            <li><strong>均線（MA）</strong>、<strong>報酬率（RETURN）</strong>、<strong>RSI</strong>、<strong>EMA</strong>、<strong>KD</strong>、<strong>MACD</strong>：可切換檢視各指標組，了解趨勢與動能。</li>
            <li><strong>K 線圖</strong>：顯示開、高、低、收與價格走勢。</li>
            <li><strong>成交量圖</strong>：呈現量能變化，輔助判斷多空力道。</li>
            <li><strong>KD 圖</strong>、<strong>MACD 圖</strong>：分別展示 KD 與 MACD 指標曲線，便於技術分析。</li>
          </ul>
          <p>
            圖表與指標由後端依統一規則計算，確保與模型輸入特徵一致，您可依區間切換比對不同週期的表現。
          </p>
        </section>

        <section className="analysis-tools-section">
          <h2>AI 預測與評分</h2>
          <p>
            分析頁面提供 AI 驅動的投資建議與評分，協助您綜合判斷：
          </p>
          <ul>
            <li><strong>模型建議</strong>：依系統邏輯輸出三類文字建議——<strong>不建議持有</strong>、<strong>觀望</strong>、<strong>長期持有</strong>。</li>
            <li><strong>買進機率（proba_buy）</strong>：模型給出的買進機率，供風險與信心評估。</li>
            <li><strong>系統評分</strong>：綜合技術面、基本面與模型機率加權後的總分。</li>
            <li><strong>技術面評分</strong>、<strong>基本面評分</strong>：分別反映技術指標與基本面狀況，可與系統說明頁的公式對照理解。</li>
          </ul>
          <p>
            以上數值僅供參考，不構成投資建議；詳細評分公式與閾值請見「系統說明」頁面。
          </p>
        </section>

        <section className="analysis-tools-section">
          <h2>回測功能</h2>
          <p>
            回測工具讓您指定起訖日期，查詢該區間內策略的歷史表現。系統會依設定的訊號閾值、持有週期、手續費與停損等假設進行回測，並提供權益曲線等結果，方便您了解策略在過往資料上的表現。
          </p>
          <p>
            回測結果僅供研究與理解系統邏輯使用，過往表現不保證未來績效；詳細假設與參數請參考「系統說明」中的回測假設章節。
          </p>
        </section>
      </main>
    </div>
  );
}
