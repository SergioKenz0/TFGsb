import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AnalyzePage from "./pages/AnalyzePage";
import PlotlyChart from "./components/PlotlyChart";
import CreateReportPage from "./pages/CreateReportPage";
import Header from "./components/Header";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<CreateReportPage />} />
        <Route path="/chart1" element={<PlotlyChart chartType="grafico1" />} />
        <Route path="/chart2" element={<PlotlyChart chartType="grafico2" />} />
        <Route path="/chart3" element={<PlotlyChart chartType="grafico3" />} />
      </Routes>
    </>
  );
};

export default App;
