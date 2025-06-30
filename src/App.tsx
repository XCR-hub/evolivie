import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';

// Pages
import HomePage from './pages/HomePage';
import QuotePage from './pages/QuotePage';
import SubscriptionPage from './pages/SubscriptionPage';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import TermsPage from './pages/TermsPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

import './App.css';

function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/simulation" element={<QuotePage />} />
            <Route path="/resultat" element={<QuotePage />} />
            <Route path="/souscription" element={<SubscriptionPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/mentions-legales" element={<LegalPage />} />
            <Route path="/conditions-generales" element={<TermsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </motion.main>

        <Footer />
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </HelmetProvider>
  );
}

export default App;