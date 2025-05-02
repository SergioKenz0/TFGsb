import Plot from "react-plotly.js";

const IssuesOpenClosedChart = ({ repos }) => {
  const names = repos.map((r) => r.repo.name);
  const openIssues = repos.map((r) => r.metrics.open_issues || 0);
  const closedIssues = repos.map((r) => r.metrics.closed_issues || 0);

  return (
    <Plot
      data={[
        {
          name: "🟢 Abiertas",
          x: names,
          y: openIssues,
          type: "bar",
          marker: { color: "#4a3ddf" },
        },
        {
          name: "🔴 Cerradas",
          x: names,
          y: closedIssues,
          type: "bar",
          marker: { color: "#aaa" },
        },
      ]}
      layout={{
        barmode: "stack",
        height: 300,
        margin: { t: 30 },
        yaxis: { title: "Issues" },
        xaxis: { title: "Repositorio" },
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

export default IssuesOpenClosedChart;
