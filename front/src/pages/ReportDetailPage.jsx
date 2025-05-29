import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/styles/pages/_report-detail.scss";

// Componentes de gráficos (nuevas agrupaciones)
import ActividadCharts from "../components/ActividadCharts";
import ComunidadCharts from "../components/ComunidadCharts";
import MantenimientoCharts from "../components/MantenimientoCharts";
import IntegracionCharts from "../components/IntegracionCharts";

// Otros componentes
import MiniNavBar from "../components/MiniNavBar";
import ResumenDiagnostico from "../components/ResumenDiagnostico";

const MAX_REPOS_VISIBLES = 5;

const ReportDetailPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // 0: Resumen, 1-4: análisis por secciones

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/reports`)
      .then((res) => res.json())
      .then((data) => {
        const selected = data[parseInt(id) - 1];
        if (selected) setReport(selected);
        else setError("Informe no encontrado.");
      })
      .catch((err) => {
        console.error("Error al cargar reporte:", err);
        setError("Error al cargar el informe.");
      });
  }, [id]);

  if (error) return <div className="report-detail__error">{error}</div>;
  if (!report) return <div className="report-detail__loading">Cargando informe...</div>;

  return (
    <div className="report-detail">
      <div className="report-detail__header">
        <h2>
          Informe {id}{" "}
          <span className="report-detail__count">{report.repos.length} repositorios</span>
        </h2>
        <MiniNavBar page={page} setPage={setPage} />
      </div>

      {/* Etiquetas de repos visibles solo en la vista de resumen */}
      {page === 0 && (
        <div className="report-detail__repos">
          {report.repos.slice(0, MAX_REPOS_VISIBLES).map((r, i) => (
            <span key={i} className="report-detail__repo-tag">
              {r.repo.name}
            </span>
          ))}
          {report.repos.length > MAX_REPOS_VISIBLES && (
            <span className="report-detail__repo-tag">...</span>
          )}
        </div>
      )}

      {/* Subvista: Resumen */}
      {page === 0 && (
        <div className="report-detail__summary">
          <ResumenDiagnostico repos={report.repos} />
        </div>
      )}

      {/* Subvistas de análisis */}
      {page === 1 && <ActividadCharts repos={report.repos} />}
      {page === 2 && <ComunidadCharts repos={report.repos} />}
      {page === 3 && <MantenimientoCharts repos={report.repos} />}
      {page === 4 && <IntegracionCharts repos={report.repos} />}
    </div>
  );
};

export default ReportDetailPage;
