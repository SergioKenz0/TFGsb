import OwnerTypeByLocationChart from "./charts/OwnerTypeByLocationChart";
import CommitConcentrationChart from "./charts/CommitConcentrationChart";
import ExternalContributorsRatioChart from "./charts/ExternalContributorsRatioChart";

const ComunidadCharts = ({ repos }) => {
  return (
    <div className="report-detail__grid">
      <div className="report-detail__chart-card">
        <h3>📍 Tipo + ubicación de propietario</h3>
        <OwnerTypeByLocationChart repos={repos} />
      </div>

      <div className="report-detail__chart-card">
        <h3>⚖️ Concentración de commits (80/20)</h3>
        <CommitConcentrationChart repos={repos} />
      </div>

      <div className="report-detail__chart-card">
        <h3>🌍 % de contribuciones externas</h3>
        <ExternalContributorsRatioChart repos={repos} />
      </div>
    </div>
  );
};

export default ComunidadCharts;
