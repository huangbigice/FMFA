import { Link } from 'react-router-dom';
import './SystemDirections.css';

const PathURL = import.meta.env.VITE_PATH || '/FA';

export default function SystemDirections() {
  return (
    <div className="system-directions">
      <Link to={`${PathURL}/stocksearch`} className="system-directions-back">
        ← 返回分析頁面
      </Link>
      <header className="system-directions-header">
        <h1 className="system-directions-title">關於這套系統</h1>
        <p className="system-directions-lead">
          本頁說明本系統的資料來源、模型邏輯、評分方式與回測假設，供您理解與驗證系統運作輪廓。
        </p>
      </header>

      <main className="system-directions-main">
        <section className="system-directions-section">
          <h2>資料來源與更新</h2>
          <p>
            本系統使用 <strong>yfinance</strong> 取得股票歷史行情（開、高、低、收、量）。查詢時可指定區間，例如 1 年、5 年或 10 年；每次分析或預測時會向資料源取得當時可用的最新資料，並非即時 tick 報價。前端預測功能目前以約 10 年歷史資料為輸入。
          </p>
          <p>
            <strong>適用市場</strong>：凡 yfinance 支援的市場皆可使用，例如台股請使用代碼加上 .TW（如 2330.TW）。
          </p>
        </section>

        <section className="system-directions-section">
          <h2>模型類型與輸入輸出</h2>
          <p>
            <strong>模型類型</strong>：本系統採用 <strong>Random Forest（隨機森林）</strong> 分類模型，經訓練後以模型檔載入使用。
          </p>
          <p>
            <strong>輸入特徵</strong>：包含價格與成交量（開、高、低、收、量）、多組均線（例如 5、20、60、120、240 日）、短期報酬（1 日、5 日）、多週期 RSI（如 120、240、420 日）、多週期 EMA（如 120、240、420、200 日），以及基本面評分（fund_score）。以上特徵由後端依同一套規則計算，確保與訓練時一致。
          </p>
          <p>
            <strong>輸出</strong>：模型會輸出三類建議的機率，並轉成文字建議——<strong>不建議持有</strong>、<strong>觀望</strong>、<strong>長期持有</strong>。同時提供買進機率（proba_buy）、系統評分、技術面評分與基本面評分，供您綜合參考。
          </p>
        </section>

        <section className="system-directions-section">
          <h2>系統評分公式與閾值</h2>
          <p>
            系統總分（system_score）由三部分加權組成，皆正規化在 0～1 區間後計算：
          </p>
          <ul>
            <li>模型買進機率（proba_buy）權重 <strong>0.45</strong></li>
            <li>基本面評分（fund_score）權重 <strong>0.30</strong></li>
            <li>技術面評分（tech_score）權重 <strong>0.25</strong></li>
          </ul>
          <p>
            技術面評分由均線多空、RSI 區間、EMA 趨勢等規則計算後，正規化至 0～1。系統依總分決定建議：
          </p>
          <ul>
            <li>系統總分 &ge; 0.6：<strong>長期持有</strong></li>
            <li>系統總分 &ge; 0.5 且 &lt; 0.6：<strong>觀望</strong></li>
            <li>系統總分 &lt; 0.5：<strong>不建議持有</strong></li>
          </ul>
        </section>

        <section className="system-directions-section">
          <h2>回測假設</h2>
          <p>
            回測功能採用以下假設（僅供理解系統邏輯，過往回測結果不保證未來表現）：
          </p>
          <ul>
            <li><strong>訊號閾值</strong>：買進訊號依模型機率與基本面門檻，例如機率閾值 0.6。</li>
            <li><strong>持有天數</strong>：策略中採用約 60 日之持有週期設計。</li>
            <li><strong>手續費</strong>：假設單邊手續費率約 0.15%（可依實際情境調整）。</li>
            <li><strong>停損</strong>：依 2 ATR 移動停損規則出場。</li>
            <li><strong>倉位</strong>：可選波動率目標（Volatility Targeting）動態調整倉位；多資產回測時採逆波動率權重與單一資產權重上限等風控假設。</li>
          </ul>
          <p>
            回測區間由使用者於分析頁選擇起訖日期，結果僅供參考，不構成投資建議。
          </p>
        </section>
      </main>
    </div>
  );
}
