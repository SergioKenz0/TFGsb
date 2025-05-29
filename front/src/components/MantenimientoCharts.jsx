import ClosedIssuesPercentageChart from "./charts/ClosedIssuesPercentageChart";
import IssueClosureRateChart from "./charts/IssueClosureRateChart";
import InfoChart from "./InfoChart";

const MantenimientoCharts = ({ repos }) => {
  return (
    <div className="report-detail__grid">
      <div className="report-detail__chart-card">
        <h3 className="resumen-diagnostico__titulo-grafico">
          ✅ Porcentaje de issues cerradas
          <InfoChart texto="Este gráfico de barras muestra el porcentaje de issues que han sido cerrados en cada repositorio, comparado con el total de issues registrados. Una cifra alta indica buena gestión del mantenimiento del proyecto." />
        </h3>
        <ClosedIssuesPercentageChart repos={repos} />
      </div>

      <div className="report-detail__chart-card">
        <h3 className="resumen-diagnostico__titulo-grafico">
          📉 Tasa de cierre de issues (%)
          <InfoChart texto="Este gráfico horizontal muestra la tasa de cierre de issues por repositorio, expresada como un porcentaje. Esta métrica considera también la evolución reciente de los issues. Permite identificar proyectos activos en resolución de incidencias." />
        </h3>
        <IssueClosureRateChart repos={repos} />
      </div>
    </div>
  );
};

export default MantenimientoCharts;
