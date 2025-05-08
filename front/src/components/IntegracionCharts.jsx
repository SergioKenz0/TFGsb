import LanguagesBreakdownChart from "./charts/LanguagesBreakdownChart";
import PopularityChart from "./charts/PopularityChart";

const IntegracionCharts = ({ repos }) => (
  <div className="report-detail__grid">
    <div className="report-detail__chart-card">
      <h3>👨‍💻 Lenguajes principales</h3>
      <LanguagesBreakdownChart repos={repos} />
    </div>
    <div className="report-detail__chart-card">
      <h3>⭐ Popularidad (stars, forks)</h3>
      <PopularityChart repos={repos} />
    </div>
    {/* Aquí se integrará avg_merge_time más adelante */}
  </div>
);

export default IntegracionCharts;
