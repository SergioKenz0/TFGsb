import CreationDelayChart from "./charts/CreationDelayChart";
import AverageCommitsPerWeekChart from "./charts/AverageCommitsPerWeekChart";
import CommitActivityChart from "./charts/CommitActivityChart";
import AvgDaysBetweenCommitsChart from "./charts/AvgDaysBetweenCommitsChart";

const ActividadCharts = ({ repos }) => (
  <div className="report-detail__grid">

    <div className="report-detail__chart-card">
      <h3>📈 Actividad semanal de commits</h3>
      <CommitActivityChart repos={repos} />
    </div>
    <div className="report-detail__chart-card">
      <h3>⏱️ Tiempo creación → primer commit</h3>
      <CreationDelayChart repos={repos} />
    </div>


    <div className="report-detail__chart-card">
      <h3>📆 Commits por semana</h3>
      <AverageCommitsPerWeekChart repos={repos} />
    </div>
    
    <div className="report-detail__chart-card">
        <h3>📊 Días promedio entre commits</h3>
        <AvgDaysBetweenCommitsChart repos={repos} />
    </div>
  </div>
);

export default ActividadCharts;
