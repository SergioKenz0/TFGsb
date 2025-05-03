import Plot from "react-plotly.js";

const ClosedIssuesPercentageChart = ({ repos }) => {
  const data = repos.map((repo) => {
    const closed = repo.metrics.closed_issues;
    const open = repo.metrics.open_issues;
    const total = open + closed;
    const percentage = total > 0 ? ((closed / total) * 100).toFixed(1) : null;

    return {
      name: repo.repo.name,
      percentage: percentage,
    };
  }).filter((r) => r.percentage !== null);

  return (
    <Plot
      data={[
        {
          x: data.map((d) => d.name),
          y: data.map((d) => d.percentage),
          type: "bar",
          marker: { color: "#4a3ddf" },
        },
      ]}
      layout={{
        margin: { t: 30 },
        height: 300,
        xaxis: { title: "Repositorio" },
        yaxis: {
          title: "% cerradas",
          range: [0, 100],
          ticksuffix: "%",
        },
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default ClosedIssuesPercentageChart;
