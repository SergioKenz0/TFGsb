import { useEffect, useState } from "react";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/reports")
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
      <h1>Reportes de Análisis</h1>
      {error && <p className="error">{error}</p>}

      {reports.length === 0 && !error && (
        <p className="loading">Cargando informes...</p>
      )}

      <div className="reports-container">
        {reports.map((report, index) => (
          <div className="report-card" key={index}>
            <h3>{report.filename}</h3>
            {report.repos && report.repos.length > 0 ? (
              <ul>
                {report.repos.map((repo, i) => (
                  <li key={i}>
                    <strong>{repo.repo?.name}</strong> — ⭐ {repo.metrics?.stars} — 🕒{" "}
                    {repo.repo?.created_at?.split("T")[0]}
                  </li>
                ))}
              </ul>
            ) : (
              <p>⚠️ Reporte sin repositorios.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
