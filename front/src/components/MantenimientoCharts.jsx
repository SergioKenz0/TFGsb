import ClosedIssuesPercentageChart from "./charts/ClosedIssuesPercentageChart";
import IssueClosureRateChart from "./charts/IssueClosureRateChart";

const MantenimientoCharts = ({ repos }) => {
  return (
    <div className="report-detail__grid">
      <div className="report-detail__chart-card">
        <h3>✅ % de issues cerradas</h3>
        <ClosedIssuesPercentageChart repos={repos} />
      </div>

      <div className="report-detail__chart-card">
        <h3>📉 Tasa de cierre de issues</h3>
        <IssueClosureRateChart repos={repos} />
      </div>
    </div>
  );
};

export default MantenimientoCharts;
