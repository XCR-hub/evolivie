import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Home from './pages/Home';
import Offers from './pages/Offers';
import Subscribe from './pages/Subscribe';
import Confirmation from './pages/Confirmation';
import './App.css';

function App() {
  return (
    <SubscriptionProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/offres" element={<Offers />} />
        <Route path="/souscription" element={<Subscribe />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </SubscriptionProvider>
  );
}

export default App;
