// src/components/charts/AvgDaysBetweenCommitsChart.jsx
import Plot from "react-plotly.js";

const AvgDaysBetweenCommitsChart = ({ repos }) => {
  // Line plots de actividad semanal
  const commitLines = repos.map((repo) => {
    const x = repo.activity.commit_activity.map((d) => d.week);
    const y = repo.activity.commit_activity.map((d) => d.count);
    return {
      x,
      y,
      mode: "lines+markers",
      type: "scatter",
      name: repo.repo.name,
      line: { shape: "spline" },
    };
  });

  // Línea de promedio teórico (commit cada X días)
  const avgLines = repos.map((repo) => {
    const avg = repo.advanced_metrics?.avg_days_between_commits;
    const x = repo.activity.commit_activity.map((d) => d.week);
    const y = x.map(() => avg && avg !== "N/A" ? 7 / avg : null); // commits por semana estimados
    return {
      x,
      y,
      mode: "lines",
      type: "scatter",
      name: `${repo.repo.name} (promedio estimado)`,
      line: {
        dash: "dot",
        width: 2,
        color: "rgba(150,150,150,0.6)"
      },
      hoverinfo: "name+y",
      showlegend: false,
    };
  });

  return (
    <Plot
      data={[...commitLines, ...avgLines]}
      layout={{
        title: "",
        xaxis: { title: "Semana" },
        yaxis: { title: "Commits" },
        margin: { t: 20, r: 10, l: 50, b: 50 },
        height: 300,
        legend: { orientation: "h" }
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default AvgDaysBetweenCommitsChart;
