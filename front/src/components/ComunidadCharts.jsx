import OwnerTypeByLocationChart from "./charts/OwnerTypeByLocationChart";
import CommitConcentrationChart from "./charts/CommitConcentrationChart";

const ComunidadCharts = ({ repos }) => (
  <div className="report-detail__grid">
    <div className="report-detail__chart-card">
      <h3>🏷️ Tipo + ubicación de propietarios</h3>
      <OwnerTypeByLocationChart repos={repos} />
    </div>
    <div className="report-detail__chart-card">
      <h3>🤝 Concentración de contribuciones (80/20)</h3>
      <CommitConcentrationChart repos={repos} />
    </div>
  </div>
);

export default ComunidadCharts;
