import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CreateReportPage from "./pages/CreateReportPage";
import Header from "./components/Header";
import ReportDetailPage from "./pages/ReportDetailPage";


const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<CreateReportPage />} />
        <Route path="/report/:id" element={<ReportDetailPage />} />

      </Routes>
    </>
  );
};

export default App;

