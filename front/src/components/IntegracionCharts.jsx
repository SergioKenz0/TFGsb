import AvgMergeTimeChart from "./charts/AvgMergeTimeChart";
import AvgIssueResponseTimeChart from "./charts/AvgIssueResponseTimeChart";

const IntegracionCharts = ({ repos }) => {
  return (
    <div className="report-detail__grid">
      <div className="report-detail__chart-card">
        <h3>🔁 Tiempo medio de integración de PRs</h3>
        <AvgMergeTimeChart repos={repos} />
      </div>

      <div className="report-detail__chart-card">
        <h3>💬 Tiempo medio de respuesta a issues</h3>
        <AvgIssueResponseTimeChart repos={repos} />
      </div>
    </div>
  );
};

export default IntegracionCharts;
