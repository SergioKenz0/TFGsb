import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import PlotlyChart from './components/PlotlyChart.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chart1" element={<PlotlyChart chartType="grafico1" />} />
        <Route path="/chart2" element={<PlotlyChart chartType="grafico2" />} />
        <Route path="/chart3" element={<PlotlyChart chartType="grafico3" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
