import { Link } from 'react-router-dom';
import './ContactInformation.css';

const PathURL = import.meta.env.VITE_PATH || '/FA';

export default function ContactInformation() {
  return (
    <div className="contact-information">
      <Link to={`${PathURL}`} className="contact-information-back">
        ← 返回頁面
      </Link>
      <header className="contact-information-header">
        <h1 className="contact-information-title">聯絡我們</h1>
        <p className="contact-information-lead">
          歡迎透過下列方式與我們聯繫，我們會儘速回覆您的問題。
        </p>
      </header>

      <main className="contact-information-main">
        <section className="contact-information-section">
          <h2>聯絡方式</h2>
          <ul className="contact-information-list">
            <li className="contact-information-card">
              <span className="contact-information-card-label">客服／一般諮詢</span>
              <a
                href="mailto:support@example.com"
                className="contact-information-link"
              >
                support@example.com
              </a>
            </li>
            <li className="contact-information-card">
              <span className="contact-information-card-label">技術支援</span>
              <a
                href="mailto:tech@example.com"
                className="contact-information-link"
              >
                tech@example.com
              </a>
            </li>
          </ul>
        </section>

        <section className="contact-information-section">
          <h2>服務時間</h2>
          <p>
            我們於<strong>工作日 09:00–18:00</strong>處理來信與諮詢，一般情況下將於<strong>2 個工作天內</strong>回覆。若遇假日或大量來信，回覆時間可能略為延長，敬請見諒。
          </p>
        </section>

        <section className="contact-information-section">
          <h2>其他說明</h2>
          <p>
            若您對<strong>隱私權政策</strong>或個人資料之蒐集、利用、保存有任何疑問，或欲行使相關權利，請參閱 <Link to={`${PathURL}/privacy-policy`} className="contact-information-link">隱私權政策</Link> 頁面，並可透過上述信箱與我們聯繫。本平台所提供之投資建議僅供參考，不構成投資建議，實際投資決策請您自行評估風險並遵守相關法規。
          </p>
        </section>
      </main>
    </div>
  );
}
