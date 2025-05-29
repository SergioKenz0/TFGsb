import React from 'react';
import '../assets/styles/components/_resumen-diagnostico.scss';

import PopularityChart from './charts/PopularityChart';
import LanguagesBreakdownChart from './charts/LanguagesBreakdownChart';
import InfoChart from './InfoChart';

const MAX_REPOS_MOSTRADOS = 5;

const agruparTopN = (items) => {
  if (items.length <= MAX_REPOS_MOSTRADOS) return items;

  const top = items.slice(0, MAX_REPOS_MOSTRADOS);
  const otros = items.slice(MAX_REPOS_MOSTRADOS);

  const categorias = {};
  otros.forEach((item) => {
    if (!categorias[item.valor]) categorias[item.valor] = 0;
    categorias[item.valor]++;
  });

  const resumenOtros = Object.entries(categorias)
    .map(([desc, count]) => `${count} con: ${desc}`)
    .join(', ');

  top.push({ name: 'Otros', valor: resumenOtros });
  return top;
};

const getColorClass = (tipo, valor) => {
  const reglas = {
    actividad: {
      'Alta frecuencia de commits': 'verde',
      'Frecuencia semanal de commits': 'ambar',
      'Frecuencia baja de commits': 'rojo',
    },
    mantenimiento: {
      'Excelente mantenimiento de issues': 'verde',
      'Mantenimiento aceptable de issues': 'ambar',
      'Mantenimiento deficiente de issues': 'rojo',
    },
    comunidad: {
      'Participación externa activa': 'verde',
      'Contribuciones mayoritariamente internas': 'ambar',
      'Pocos contribuidores en total': 'rojo',
    },
    integracion: {
      'PRs integradas rápidamente': 'verde',
      'Integración lenta de PRs': 'rojo',
    },
  };

  return reglas[tipo]?.[valor] || 'gris';
};

const getColorLegend = (tipo) => {
  const leyendas = {
    actividad: {
      verde: 'Alta frecuencia de commits — menos de 1 día entre commits (avg_days_between_commits < 1)',
      ambar: 'Frecuencia semanal de commits — entre 1 y 7 días entre commits (1 ≤ avg_days_between_commits < 7)',
      rojo: 'Frecuencia baja de commits — más de 7 días entre commits (avg_days_between_commits ≥ 7)',
    },
    mantenimiento: {
      verde: 'Excelente mantenimiento — más del 80% de issues cerradas (issue_closure_rate > 80)',
      ambar: 'Mantenimiento aceptable — entre 40% y 80% de issues cerradas (40 ≤ issue_closure_rate ≤ 80)',
      rojo: 'Mantenimiento deficiente — menos del 40% de issues cerradas (issue_closure_rate < 40)',
    },
    comunidad: {
      verde: 'Participación externa activa — más de 5 contribuidores y al menos 50% externos (external_contributors_ratio ≥ 50)',
      ambar: 'Contribuciones internas dominantes — más de 5 contribuidores pero menos del 50% externos (external_contributors_ratio < 50)',
      rojo: 'Pocos contribuidores en total — 5 o menos contribuidores (contributors.total ≤ 5)',
    },
    integracion: {
      verde: 'PRs integradas rápidamente — menos de 2 días desde creación al merge (avg_merge_time < 2)',
      rojo: 'Integración lenta — 2 días o más para integrar PRs (avg_merge_time ≥ 2)',
    },
  };
  return leyendas[tipo] || {};
};

const ResumenDiagnostico = ({ repos }) => {
  if (!repos) return <p>Cargando análisis...</p>;

  const actividad = [];
  const mantenimiento = [];
  const comunidad = [];
  const integracion = [];

  repos.forEach((r) => {
    const { repo, advanced_metrics, metrics } = r;

    const dias = advanced_metrics.avg_days_between_commits;
    let act = dias !== 'N/A'
      ? dias < 1 ? 'Alta frecuencia de commits'
      : dias < 7 ? 'Frecuencia semanal de commits'
      : 'Frecuencia baja de commits'
      : 'Sin datos de actividad';
    actividad.push({ name: repo.name, valor: act });

    const tasa = advanced_metrics.issue_closure_rate;
    let mant = tasa !== 'N/A'
      ? tasa > 80 ? 'Excelente mantenimiento de issues'
      : tasa > 40 ? 'Mantenimiento aceptable de issues'
      : 'Mantenimiento deficiente de issues'
      : 'Sin datos de mantenimiento';
    mantenimiento.push({ name: repo.name, valor: mant });

    const contribs = metrics.contributors.total;
    const ext_ratio = advanced_metrics.external_contributors_ratio;
    let comm = contribs > 5
      ? ext_ratio >= 50 ? 'Participación externa activa'
      : 'Contribuciones mayoritariamente internas'
      : 'Pocos contribuidores en total';
    comunidad.push({ name: repo.name, valor: comm });

    const merge = advanced_metrics.avg_merge_time;
    let prs = merge !== 'N/A'
      ? merge < 2 ? 'PRs integradas rápidamente'
      : 'Integración lenta de PRs'
      : 'Sin datos sobre PRs';
    integracion.push({ name: repo.name, valor: prs });
  });

  const renderItems = (data, tipo) => (
    <div className="resumen-diagnostico__card">
      {agruparTopN(data).map((d, i) => (
        <div key={i} className="resumen-diagnostico__linea">
          <span className={`circulo circulo--${getColorClass(tipo, d.valor)}`}></span>
          <span className="resumen-diagnostico__repo">{d.name}</span>
        </div>
      ))}
    </div>
  );

  const renderLegend = (tipo) => (
    <div className="resumen-diagnostico__leyenda">
      <strong>Leyenda:</strong>
      <ul>
        {Object.entries(getColorLegend(tipo)).map(([color, texto], i) => (
          <li key={i}>
            <span className={`circulo circulo--${color}`}></span> {texto}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderSection = (titulo, valores, descripcion, metricas, tipo) => (
    <div className="resumen-diagnostico__item">
      <h3 className="resumen-diagnostico__titulo">{titulo}</h3>
      <div className="resumen-diagnostico__content">
        {renderItems(valores, tipo)}
        <div className="resumen-diagnostico__descripcion">
          <p>{descripcion}</p>
          <p className="resumen-diagnostico__metricas-titulo">Métrica usadas:</p>
          <ul className="resumen-diagnostico__metricas-lista">
            {metricas.map((m, i) => (
              <li key={i}>
                <code>{m.nombre}</code> — {m.descripcion}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {renderLegend(tipo)}
    </div>
  );

  return (
    <div className="resumen-diagnostico">
      <h2 className="resumen-diagnostico__header">Resumen de Análisis</h2>

      <div className="resumen-diagnostico__visuales">
        <div className="resumen-diagnostico__chart">
          <h3 className="resumen-diagnostico__titulo-grafico">
            📊 Popularidad 
            <InfoChart texto="Este gráfico compara la popularidad relativa de los repositorios en función de tres métricas clave: estrellas (stars), forks y watchers. El eje X muestra los repositorios y el eje Y la cantidad absoluta de cada métrica. Las barras están agrupadas para permitir la comparación entre métricas dentro de cada repositorio." />
          </h3>
          <PopularityChart repos={repos} />
        </div>
        <div className="resumen-diagnostico__chart">
          <h3 className="resumen-diagnostico__titulo-grafico">
            🎨 Distribución de Lenguajes
            <InfoChart texto="Este gráfico muestra qué lenguajes de programación predominan en los repositorios seleccionados. Cada barra apilada representa un repositorio y está dividida por colores según el porcentaje de uso de cada lenguaje. El eje X indica los repositorios y el eje Y muestra el porcentaje acumulado de lenguajes en cada uno." />
          </h3>
          <LanguagesBreakdownChart repos={repos} />
        </div>
      </div>

      <div className="resumen-diagnostico__grid">
        {renderSection(
          'Actividad (frecuencia de commits)',
          actividad,
          'Evalúa cada cuánto tiempo se realizan commits. Frecuencias altas indican desarrollo activo.',
          [{ nombre: 'avg_days_between_commits', descripcion: 'días promedio entre commits' }],
          'actividad'
        )}
        {renderSection(
          'Mantenimiento (issues cerradas)',
          mantenimiento,
          'Analiza si los issues se están gestionando y resolviendo adecuadamente.',
          [{ nombre: 'issue_closure_rate', descripcion: 'Porcentaje de issues cerrados' }],
          'mantenimiento'
        )}
        {renderSection(
          'Comunidad (participación externa)',
          comunidad,
          'Mide cuántos contribuidores externos colaboran en el proyecto.',
          [{ nombre: 'external_contributors_ratio', descripcion: 'Ratio de contribuidores externos sobre el total' }],
          'comunidad'
        )}
        {renderSection(
          'Integración de Pull Requests',
          integracion,
          'Analiza la rapidez con la que se integran los Pull Requests enviados.',
          [{ nombre: 'avg_merge_time', descripcion: 'tiempo promedio hasta integrar Pull Requests (días)' }],
          'integracion'
        )}
      </div>
    </div>
  );
};

export default ResumenDiagnostico;
