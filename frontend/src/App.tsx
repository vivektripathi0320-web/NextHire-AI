import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import LandingPage from './pages/LandingPage';
import ResumeGenerator from './pages/ResumeGenerator';
import ResumeEnhancer from './pages/ResumeEnhancer';
import AtsAnalyzer from './pages/AtsAnalyzer';
import PortfolioBuilder from './pages/PortfolioBuilder';
import PublicPortfolio from './pages/PublicPortfolio';
import JdMatcher from './pages/JdMatcher';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="resume-generator" element={<ResumeGenerator />} />
          <Route path="resume-enhancer" element={<ResumeEnhancer />} />
          <Route path="ats-analyzer" element={<AtsAnalyzer />} />
          <Route path="portfolio-builder" element={<PortfolioBuilder />} />
          <Route path="jd-matcher" element={<JdMatcher />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="portfolio/:slug" element={<PublicPortfolio />} />
      </Routes>
    </Router>
  );
}
