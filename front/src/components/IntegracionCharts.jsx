import AvgMergeTimeChart from "./charts/AvgMergeTimeChart";
import AvgIssueResponseTimeChart from "./charts/AvgIssueResponseTimeChart";
import InfoChart from "./InfoChart";

const IntegracionCharts = ({ repos }) => {
  return (
    <div className="report-detail__grid">
      <div className="report-detail__chart-card">
        <h3 className="resumen-diagnostico__titulo-grafico">
          🔁 Tiempo medio de integración de PRs
          <InfoChart texto="Este gráfico muestra el promedio de días que tarda cada repositorio en integrar (mergear) sus Pull Requests. Un valor bajo indica agilidad en la revisión y aceptación de contribuciones." />
        </h3>
        <AvgMergeTimeChart repos={repos} />
      </div>

      <div className="report-detail__chart-card">
        <h3 className="resumen-diagnostico__titulo-grafico">
          💬 Tiempo medio de respuesta a issues
          <InfoChart texto="Este gráfico indica cuántos días pasan, en promedio, hasta que un issue recibe su primer comentario. Refleja la capacidad del equipo para atender consultas o reportes de forma ágil." />
        </h3>
        <AvgIssueResponseTimeChart repos={repos} />
      </div>
    </div>
  );
};

export default IntegracionCharts;
