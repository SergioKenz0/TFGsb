import Plot from "react-plotly.js";
import TopNWithOthers from "../utils/TopNWithOthers";

const AverageCommitsPerWeekChart = ({ repos }) => {
  // Datos base: promedio de commits por semana por repo
  const baseData = repos.map((repo) => {
    const totalCommits = repo.metrics.contributors.by_commit.reduce(
      (sum, c) => sum + c.commits,
      0
    );
    const weeks = repo.activity.commit_activity.length || 1;
    return {
      name: repo.repo.name,
      value: parseFloat((totalCommits / weeks).toFixed(2)),
    };
  });

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
            xaxis: { title: "Repositorio" },
            yaxis: { title: "Commits por semana" },
            height: 300,
          }}
          config={{ displayModeBar: false }}
        />
      )}
    </TopNWithOthers>
  );
};

export default AverageCommitsPerWeekChart;
