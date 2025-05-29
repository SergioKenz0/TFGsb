import Plot from "react-plotly.js";

const CommitActivityChart = ({ repos }) => {
  // Calcular el total de commits por repo
  const enriched = repos.map((repo) => {
    const totalCommits = repo.activity.commit_activity.reduce(
      (sum, entry) => sum + entry.count,
      0
    );
    return { ...repo, totalCommits };
  });

  // Ordenar y seleccionar top 5
  const sorted = enriched.sort((a, b) => b.totalCommits - a.totalCommits);
  const top5 = sorted.slice(0, 5);
  const others = sorted.slice(5);

  // Construir trazas para top 5
  const traces = top5.map((repo) => ({
    name: repo.repo.name,
    x: repo.activity.commit_activity.map((entry) => entry.week),
    y: repo.activity.commit_activity.map((entry) => entry.count),
    mode: "lines+markers",
    type: "scatter",
    line: { shape: "spline" },
  }));

  // Agregar traza "Otros" si hay más de 5
  if (others.length > 0) {
    // Asumimos que todos los repos tienen las mismas semanas
    const semanas = others[0].activity.commit_activity.map((entry) => entry.week);
    const sumaPorSemana = semanas.map((_, i) =>
      others.reduce(
        (acc, repo) => acc + (repo.activity.commit_activity[i]?.count || 0),
        0
      )
    );

    traces.push({
      name: "Otros",
      x: semanas,
      y: sumaPorSemana,
      mode: "lines+markers",
      type: "scatter",
      line: {
        shape: "spline",
        dash: "dot",
        color: "#888"
      },
    });
  }

  return (
    <Plot
      data={traces}
      layout={{
        height: 300,
        margin: { t: 30, r: 80 },
        xaxis: {
          title: "Semana",
          tickangle: -45,
        },
        yaxis: {
          title: "Commits",
        },
        legend: {
          orientation: "v",
          x: 1.02,
          y: 1,
          xanchor: "left",
        },
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default CommitActivityChart;
