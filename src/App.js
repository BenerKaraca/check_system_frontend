import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Masalar from './pages/Masalar';
import MasaDetay from './pages/MasaDetay';
import Rapor from './pages/Rapor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Masalar />} />
        <Route path="/masa/:masaId" element={<MasaDetay />} />
        <Route path="/rapor" element={<Rapor />} />
      </Routes>
    </Router>
  );
}

export default App;
