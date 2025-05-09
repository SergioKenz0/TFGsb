import Plot from "react-plotly.js";

const AvgDaysBetweenCommitsChart = ({ repos }) => {
  const filtered = repos.filter(
    (repo) =>
      repo.advanced_metrics?.avg_days_between_commits !== undefined &&
      repo.advanced_metrics.avg_days_between_commits !== "N/A"
  );

  const names = filtered.map((repo) => repo.repo.name);
  const values = filtered.map((repo) => repo.advanced_metrics.avg_days_between_commits);

  return (
    <Plot
      data={[
        {
          x: names,
          y: values,
          type: "scatter",
          mode: "lines+markers+text",
          text: values.map((val) => `${val} días`),
          textposition: "top center",
          line: { shape: "linear" },
          marker: { color: "#4a3ddf" },
          name: "Días promedio entre commits",
        },
      ]}
      layout={{
        title: "Días promedio entre commits",
        xaxis: { title: "Repositorio" },
        yaxis: { title: "Días", rangemode: "tozero" },
        height: 320,
        margin: { t: 40 },
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default AvgDaysBetweenCommitsChart;
