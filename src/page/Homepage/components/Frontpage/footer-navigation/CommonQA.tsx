import { Link } from 'react-router-dom';
import './CommonQA.css';

const PathURL = import.meta.env.VITE_PATH || '/FA';

const qaList: { question: string; answer: string }[] = [
  {
    question: '如何搜尋股票？',
    answer:
      '請至首頁點選「開始分析」或從導覽進入股票搜尋頁，在搜尋欄輸入股票代碼或公司名稱即可。例如台股可輸入 2330 或「台積電」進行查詢。',
  },
  {
    question: '資料更新頻率為何？是否為即時報價？',
    answer:
      '本系統使用歷史行情資料（開、高、低、收、量），每次分析或預測時會向資料源取得當時可用的最新資料，並非即時 tick 報價。若您需要即時報價，請另行參考交易所或券商提供的即時服務。',
  },
  {
    question: '支援哪些市場？台股代碼怎麼輸入？',
    answer:
      '凡 yfinance 支援的市場皆可使用。台股請在代碼後加上 .TW，例如 2330.TW 代表台積電。其他市場請依該資料源之代碼格式輸入。',
  },
  {
    question: '系統建議「長期持有」「觀望」「不建議持有」如何解讀？',
    answer:
      '系統依模型買進機率、基本面評分與技術面評分加權計算出系統總分，並依總分給出建議：總分 ≥ 0.6 為「長期持有」、≥ 0.5 且 < 0.6 為「觀望」、< 0.5 為「不建議持有」。此建議僅供參考，不構成投資建議，詳細邏輯請見「系統說明」頁面。',
  },
  {
    question: '回測結果代表什麼？是否保證獲利？',
    answer:
      '回測是依歷史資料與既定策略參數（如訊號閾值、持有天數、手續費、停損規則等）模擬過往表現，僅供理解策略邏輯與風險。過往回測結果不保證未來表現，實際投資請自行評估風險並遵守相關法規。',
  },
  {
    question: '如何聯絡客服或技術支援？',
    answer:
      '請至「聯絡我們」頁面查看客服信箱、服務時間與其他聯絡方式，我們會儘速回覆您的問題。',
  },
];

export default function CommonQA() {
  return (
    <div className="common-qa">
      <Link to={`${PathURL}`} className="common-qa-back">
        ← 返回頁面
      </Link>
      <header className="common-qa-header">
        <h1 className="common-qa-title">常見問題</h1>
        <p className="common-qa-lead">
          以下彙整使用本平台時常見的疑問與說明，若您需要更詳細的系統邏輯或功能介紹，請參考「系統說明」與「文檔」頁面。
        </p>
      </header>

      <main className="common-qa-main">
        {qaList.map((qa, index) => (
          <section key={index} className="common-qa-section">
            <h2>{qa.question}</h2>
            <p>{qa.answer}</p>
          </section>
        ))}
      </main>
    </div>
  );
}
