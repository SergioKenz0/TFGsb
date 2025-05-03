import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/styles/pages/_report-detail.scss";
//Charts
import CreationDelayChart  from "../components/charts/CreationDelayChart";
import OwnerTypeByLocationChart  from "../components/charts/OwnerTypeByLocationChart";
import AverageCommitsPerWeekChart from "../components/charts/AverageCommitsPerWeekChart";
import LanguagesBreakdownChart from "../components/charts/LanguagesBreakdownChart";
import PopularityChart from "../components/charts/PopularityChart";
import CommitActivityChart from "../components/charts/CommitActivityChart";
import ClosedIssuesPercentageChart from "../components/charts/ClosedIssuesPercentageChart";
import CommitConcentrationChart from "../components/charts/CommitConcentrationChart"; 



const ReportDetailPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
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
          <span className="report-detail__count">
                 {report.repos.length} repositorios
          </span>
        </h2>
      </div>

      <div className="report-detail__repos">
        {report.repos.map((r, i) => (
          <span key={i}>{r.repo.name}</span>
        ))}
      </div>

      <div className="report-detail__grid">
        {page === 1 && (
          <>
            <div className="report-detail__chart-card">
              <h3>⏱️ Tiempo de creación → primer commit</h3>
              <CreationDelayChart repos={report.repos} />
            </div>
            <div className="report-detail__chart-card">
              <h3>📍 Tipo + ubicación de propietario</h3>
              <OwnerTypeByLocationChart repos={report.repos} />
            </div>
            <div className="report-detail__chart-card">
              <h3>👨‍💻 Lenguajes principales por repositorio</h3>
              <LanguagesBreakdownChart repos={report.repos} />
            </div>
            <div className="report-detail__chart-card">
              <h3>📆 Promedio de commits por semana</h3>
                <AverageCommitsPerWeekChart repos={report.repos} />
            </div>
          </>
        )}

        {page === 2 && (
          <>
            {/* Aquí irán los gráficos 5-8 */}
            <div className="report-detail__chart-card">
              <h3>⭐ Popularidad</h3>
              <PopularityChart repos={report.repos} />
            </div>
            <div className="report-detail__chart-card">
              <h3>📈 Actividad de commits</h3>
              <CommitActivityChart repos={report.repos} />
            </div>
            <div className="report-detail__chart-card">
            <h3>✅ % de issues cerradas</h3>
              <ClosedIssuesPercentageChart repos={report.repos} />
            </div>
            <div className="report-detail__chart-card">
            <h3>⚖️ Concentración de commits (80/20)</h3>
              <CommitConcentrationChart repos={report.repos} />
            </div>
          </>
        )}
      </div>

      <div className="report-detail__pagination">
        <button
          onClick={() => setPage(1)}
          disabled={page === 1}
          className="report-detail__page-btn"
        >
          ⬅ Anterior
        </button>
        <button
          onClick={() => setPage(2)}
          disabled={page === 2}
          className="report-detail__page-btn"
        >
          Siguiente ➡
        </button>
      </div>

    </div>
  );
};

export default ReportDetailPage;
