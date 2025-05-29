import Plot from "react-plotly.js";
import TopNWithOthers from "../utils/TopNWithOthers";

const AvgIssueResponseTimeChart = ({ repos }) => {
  const baseData = repos
    .map((r) => {
      const time = r.advanced_metrics?.avg_response_time_issues;
      return time !== "N/A" ? { name: r.repo.name, value: time } : null;
    })
    .filter(Boolean);

  return (
    <TopNWithOthers data={baseData} valueKey="value" nameKey="name">
      {(filteredData) => (
        <Plot
          data={[
            {
              type: "bar",
              x: filteredData.map((r) => r.name),
              y: filteredData.map((r) => r.value),
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
      )}
    </TopNWithOthers>
  );
};

export default AvgIssueResponseTimeChart;
