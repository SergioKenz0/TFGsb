import Plot from "react-plotly.js";
import TopNWithOthers from "../utils/TopNWithOthers";

const ClosedIssuesPercentageChart = ({ repos }) => {
  const baseData = repos
    .map((repo) => {
      const closed = repo.metrics.closed_issues;
      const open = repo.metrics.open_issues;
      const total = open + closed;
      const percentage = total > 0 ? parseFloat(((closed / total) * 100).toFixed(1)) : null;

      return {
        name: repo.repo.name,
        value: percentage,
      };
    })
    .filter((r) => r.value !== null);

  return (
    <TopNWithOthers data={baseData} valueKey="value" nameKey="name">
      {(filteredData) => (
        <Plot
          data={[
            {
              x: filteredData.map((d) => d.name),
              y: filteredData.map((d) => d.value),
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
      )}
    </TopNWithOthers>
  );
};

export default ClosedIssuesPercentageChart;
