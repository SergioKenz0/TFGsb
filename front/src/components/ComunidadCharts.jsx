import OwnerTypeByLocationChart from "./charts/OwnerTypeByLocationChart";
import CommitConcentrationChart from "./charts/CommitConcentrationChart";
import InfoChart from "./InfoChart";

const ComunidadCharts = ({ repos }) => {
  return (
    <div className="report-detail__grid">
      <div className="report-detail__chart-card">
        <h3 className="resumen-diagnostico__titulo-grafico">
          📍 Tipo + ubicación de propietario
          <InfoChart texto="Este gráfico muestra cuántos repositorios pertenecen a usuarios individuales (User) o a organizaciones (Organization), agrupados por ubicación geográfica. Se muestran las 5 ubicaciones más frecuentes y un grupo agregado 'Otros'." />
        </h3>
        <OwnerTypeByLocationChart repos={repos} />
      </div>

      <div className="report-detail__chart-card">
        <h3 className="resumen-diagnostico__titulo-grafico">
          ⚖️ Concentración de commits (80/20)
          <InfoChart texto="Este gráfico muestra cuántos commits ha hecho cada colaborador en los repositorios más activos. Se visualiza el top 10 de contribuidores por repositorio, permitiendo identificar concentración del trabajo en pocas personas." />
        </h3>
        <CommitConcentrationChart repos={repos} />
      </div>
    </div>
  );
};

export default ComunidadCharts;
