import Plot from "react-plotly.js";
import TopNWithOthers from "../utils/TopNWithOthers";

const IssueClosureRateChart = ({ repos }) => {
  const baseData = repos
    .map((r) => {
      const rate = r.advanced_metrics?.issue_closure_rate;
      return rate !== "N/A" ? { name: r.repo.name, value: rate } : null;
    })
    .filter(Boolean);

  return (
    <TopNWithOthers data={baseData} valueKey="value" nameKey="name">
      {(filteredData) => (
        <Plot
          data={[
            {
              type: "bar",
              orientation: "h",
              x: filteredData.map((r) => r.value),
              y: filteredData.map((r) => r.name),
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
      )}
    </TopNWithOthers>
  );
};

export default IssueClosureRateChart;
