import { useEffect, useState } from "react";
import ReportCard from "./ReportCard";
import "../assets/styles/components/_dashboard.scss";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/reports`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Respuesta inesperada del servidor");
        }
        setReports(data);
      })
      .catch((err) => {
        console.error("❌ Error al cargar reports:", err);
        setError("No se pudieron cargar los informes.");
      });
  }, []);

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Panel de Informes</h1>

      {error && <p className="dashboard__error">{error}</p>}
      {reports.length === 0 && !error && (
        <p className="dashboard__loading">Cargando informes...</p>
      )}

      <div className="dashboard__grid">
        {reports.map((report, index) => (
          <ReportCard key={index} index={index} report={report} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
