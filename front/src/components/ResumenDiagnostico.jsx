import React from 'react';
import '../assets/styles/components/_resumen-diagnostico.scss';

// Nuevos charts visuales para resumen
import PopularityChart from './charts/PopularityChart';
import LanguagesBreakdownChart from './charts/LanguagesBreakdownChart';

const ResumenDiagnostico = ({ repos }) => {
  if (!repos) return <p>Cargando análisis...</p>;

  const actividad = [];
  const mantenimiento = [];
  const comunidad = [];
  const integracion = [];

  repos.forEach((r) => {
    const { repo, advanced_metrics, metrics } = r;

    const dias = advanced_metrics.avg_days_between_commits;
    let act = '';
    if (dias !== 'N/A') {
      act = dias < 1 ? 'Alta frecuencia de commits' : dias < 7 ? 'Frecuencia semanal de commits' : 'Frecuencia baja de commits';
    } else {
      act = 'Sin datos de actividad';
    }
    actividad.push({ name: repo.name, valor: act });

    const tasa = advanced_metrics.issue_closure_rate;
    let mant = '';
    if (tasa !== 'N/A') {
      mant = tasa > 80 ? 'Excelente mantenimiento de issues' : tasa > 40 ? 'Mantenimiento aceptable de issues' : 'Mantenimiento deficiente de issues';
    } else {
      mant = 'Sin datos de mantenimiento';
    }
    mantenimiento.push({ name: repo.name, valor: mant });

    const contribs = metrics.contributors.total;
    const ext_ratio = advanced_metrics.external_contributors_ratio;
    let comm = '';
    if (contribs > 5) {
      comm = ext_ratio >= 50 ? 'Participación externa activa' : 'Contribuciones mayoritariamente internas';
    } else {
      comm = 'Pocos contribuidores en total';
    }
    comunidad.push({ name: repo.name, valor: comm });

    const merge = advanced_metrics.avg_merge_time;
    let prs = '';
    if (merge !== 'N/A') {
      prs = merge < 2 ? 'PRs integradas rápidamente' : 'Integración lenta de PRs';
    } else {
      prs = 'Sin datos sobre PRs';
    }
    integracion.push({ name: repo.name, valor: prs });
  });

  const renderItems = (data) => (
    <div className="resumen-diagnostico__card">
      {data.map((d, i) => (
        <div key={i}>
          <span className="resumen-diagnostico__repo">{d.name}:</span> {d.valor}
        </div>
      ))}
    </div>
  );

  const renderSection = (titulo, valores, descripcion, metricas) => (
    <div className="resumen-diagnostico__item">
      <h3 className="resumen-diagnostico__titulo">{titulo}</h3>
      <div className="resumen-diagnostico__content">
        {renderItems(valores)}
        <div className="resumen-diagnostico__descripcion">
          <p>{descripcion}</p>
          <p className="resumen-diagnostico__metricas-titulo">Métricas usadas:</p>
          <ul className="resumen-diagnostico__metricas-lista">
            {metricas.map((m, i) => (
              <li key={i}>
                <code>{m.nombre}</code> — {m.descripcion}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="resumen-diagnostico">
      <h2 className="resumen-diagnostico__header">Resumen de Análisis</h2>

      {/* Nuevos gráficos visuales arriba */}
      <div className="resumen-diagnostico__visuales">
        <div className="resumen-diagnostico__chart">
          <h3>📊 Popularidad</h3>
          <PopularityChart repos={repos} />
        </div>
        <div className="resumen-diagnostico__chart">
          <h3>🎨 Distribución de Lenguajes</h3>
          <LanguagesBreakdownChart repos={repos} />
        </div>
      </div>

      <div className="resumen-diagnostico__grid">
        {renderSection(
          'Actividad (frecuencia de commits)',
          actividad,
          'Evalúa cada cuánto tiempo se realizan commits. Frecuencias altas indican desarrollo activo.',
          [{ nombre: 'avg_days_between_commits', descripcion: 'días promedio entre commits' }]
        )}
        {renderSection(
          'Mantenimiento (issues cerradas)',
          mantenimiento,
          'Analiza si los issues se están gestionando y resolviendo adecuadamente.',
          [{ nombre: 'issue_closure_rate', descripcion: 'Porcentaje de issues cerrados' }]
        )}
        {renderSection(
          'Comunidad (participación externa)',
          comunidad,
          'Mide cuántos contribuidores externos colaboran en el proyecto.',
          [{ nombre: 'external_contributors_ratio', descripcion: 'Ratio de contribuidores externos sobre el total' }]
        )}
        {renderSection(
          'Integración de Pull Requests',
          integracion,
          'Analiza la rapidez con la que se integran los Pull Requests enviados.',
          [{ nombre: 'avg_merge_time', descripcion: 'tiempo promedio hasta integrar Pull Requests (días)' }]
        )}
      </div>
    </div>
  );
};

export default ResumenDiagnostico;
