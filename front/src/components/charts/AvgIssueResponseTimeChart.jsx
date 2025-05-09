import Plot from "react-plotly.js";

const AvgIssueResponseTimeChart = ({ repos }) => {
  const data = repos
    .map((r) => {
      const time = r.advanced_metrics?.avg_response_time_issues;
      return time !== "N/A" ? { name: r.repo.name, time } : null;
    })
    .filter(Boolean);

  return (
    <Plot
      data={[
        {
          type: "bar",
          x: data.map((r) => r.name),
          y: data.map((r) => r.time),
          marker: { color: "#4a3ddf" },
        },
      ]}
      layout={{
        margin: { t: 30, b: 80 },
        xaxis: {
          title: "Repositorio",
          tickangle: -45,
        },
        yaxis: {
          title: "Tiempo medio de respuesta (días)",
        },
        height: 300,
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default AvgIssueResponseTimeChart;
