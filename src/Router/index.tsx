import { Route, Routes, Navigate } from 'react-router-dom'
import Home from '../page/Homepage';
import SearchPage from '../page/Homepage/components/Frontpage/SearchPage'
import SystemDirections from '../page/Homepage/components/Frontpage/footer-navigation/SystemDirections'
import AnalysisTools from '../page/Homepage/components/Frontpage/footer-navigation/AnalysisTools'
import Function from '../page/Homepage/components/Frontpage/footer-navigation/Function'
import PrivacyPolicy from '../page/Homepage/components/Frontpage/footer-navigation/PrivacyPolicy'
import Service from '../page/Homepage/components/Frontpage/footer-navigation/Service'
import AboutUs from '../page/Homepage/components/Frontpage/footer-navigation/AboutUs'
import ContactInformation from '../page/Homepage/components/Frontpage/footer-navigation/ContactInformation'
import Document from '../page/Homepage/components/Frontpage/footer-navigation/Document'
import CommonQA from '../page/Homepage/components/Frontpage/footer-navigation/CommonQA'
const PathURL = import.meta.env.VITE_PATH || '/FA';
export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={PathURL} replace />} />

      <Route path={PathURL}>
        <Route index element={<Home />} />
        <Route path="stocksearch" element={<SearchPage />} />
        <Route path="system-directions" element={<SystemDirections />} />
        <Route path="analysis-tools" element={<AnalysisTools />} />
        <Route path="function" element={<Function />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="service" element={<Service />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="contact-information" element={<ContactInformation />} />
        <Route path="document" element={<Document />} />
        <Route path="common-qa" element={<CommonQA />} />
      </Route>
      
      <Route path="*" element={<Navigate to={PathURL} replace />} />
    </Routes>
  )
}

