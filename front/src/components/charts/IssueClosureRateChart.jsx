import Plot from "react-plotly.js";

const IssueClosureRateChart = ({ repos }) => {
  const data = repos
    .map((r) => {
      const rate = r.advanced_metrics?.issue_closure_rate;
      return rate !== "N/A" ? { name: r.repo.name, rate } : null;
    })
    .filter(Boolean);

  return (
    <Plot
      data={[
        {
          type: "bar",
          orientation: "h",
          x: data.map((r) => r.rate),
          y: data.map((r) => r.name),
          marker: { color: "#4a3ddf" },
        },
      ]}
      layout={{
        margin: { l: 100, r: 30, t: 30, b: 40 },
        xaxis: {
          title: "Tasa de cierre (%)",
          range: [0, 100],
          ticksuffix: "%",
        },
        height: 300,
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default IssueClosureRateChart;
