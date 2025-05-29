import CreationDelayChart from "./charts/CreationDelayChart";
import AverageCommitsPerWeekChart from "./charts/AverageCommitsPerWeekChart";
import CommitActivityChart from "./charts/CommitActivityChart";
import AvgDaysBetweenCommitsChart from "./charts/AvgDaysBetweenCommitsChart";
import InfoChart from "./InfoChart";

const ActividadCharts = ({ repos }) => (
  <div className="report-detail__grid">

    <div className="report-detail__chart-card">
      <h3 className="resumen-diagnostico__titulo-grafico">
        📈 Actividad semanal de commits
        <InfoChart texto="Este gráfico muestra la evolución semanal del número de commits realizados en cada repositorio. El eje X representa las semanas y el eje Y el número total de commits en esa semana. Se comparan hasta 5 repositorios más un grupo agregado llamado 'Otros'." />
      </h3>
      <CommitActivityChart repos={repos} />
    </div>

    <div className="report-detail__chart-card">
      <h3 className="resumen-diagnostico__titulo-grafico">
        ⏱️ Tiempo creación → primer commit
        <InfoChart texto="Este gráfico horizontal muestra cuántos días pasaron desde la creación del repositorio hasta que se realizó su primer commit. Se indican además las fechas exactas de creación y del primer commit. Se incluye una línea de promedio para comparación." />
      </h3>
      <CreationDelayChart repos={repos} />
    </div>

    <div className="report-detail__chart-card">
      <h3 className="resumen-diagnostico__titulo-grafico">
        📆 Commits por semana
        <InfoChart texto="Este gráfico de barras muestra el promedio de commits realizados por semana en cada repositorio, calculado a partir de toda la actividad histórica registrada. Permite detectar proyectos con actividad constante o baja." />
      </h3>
      <AverageCommitsPerWeekChart repos={repos} />
    </div>

    <div className="report-detail__chart-card">
      <h3 className="resumen-diagnostico__titulo-grafico">
        📊 Días promedio entre commits
        <InfoChart texto="Este gráfico muestra cuántos días, en promedio, pasan entre cada commit en los distintos repositorios. Un valor bajo indica un flujo continuo de trabajo; valores altos pueden señalar pausas en el desarrollo." />
      </h3>
      <AvgDaysBetweenCommitsChart repos={repos} />
    </div>
  </div>
);

export default ActividadCharts;
