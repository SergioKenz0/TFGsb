// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AnalyzePage from './pages/AnalyzePage';
import PlotlyChart from './components/PlotlyChart';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analyze" element={<AnalyzePage />} />
      <Route path="/chart1" element={<PlotlyChart chartType="grafico1" />} />
      <Route path="/chart2" element={<PlotlyChart chartType="grafico2" />} />
      <Route path="/chart3" element={<PlotlyChart chartType="grafico3" />} />
    </Routes>
  );
};

export default App;
