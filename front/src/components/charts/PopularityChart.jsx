import Plot from "react-plotly.js";

const PopularityChart = ({ repos }) => {
  const names = repos.map((r) => r.repo.name);

  const stars = repos.map((r) => r.metrics.stars || 0);
  const forks = repos.map((r) => r.metrics.forks || 0);
  const watchers = repos.map((r) => r.metrics.watchers || 0);

  return (
    <Plot
      data={[
        {
          name: "⭐ Stars",
          x: names,
          y: stars,
          type: "bar",
        },
        {
          name: "🍴 Forks",
          x: names,
          y: forks,
          type: "bar",
        },
        {
          name: "👁️ Watchers",
          x: names,
          y: watchers,
          type: "bar",
        },
      ]}
      layout={{
        barmode: "group",
        height: 300,
        margin: { t: 30 },
        yaxis: { title: "Cantidad" },
        xaxis: { title: "Repositorio" },
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default PopularityChart;
