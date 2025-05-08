import ClosedIssuesPercentageChart from "./charts/ClosedIssuesPercentageChart";

const MantenimientoCharts = ({ repos }) => (
  <div className="report-detail__grid">
    <div className="report-detail__chart-card">
      <h3>✅ % de issues cerradas</h3>
      <ClosedIssuesPercentageChart repos={repos} />
    </div>
    {/* Aquí se integrará avg_response_time_issues cuando el gráfico esté listo */}
  </div>
);

export default MantenimientoCharts;
