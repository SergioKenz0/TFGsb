import Plot from "react-plotly.js";

const AverageCommitsPerWeekChart = ({ repos }) => {
  const data = repos.map((repo) => {
    const totalCommits = repo.metrics.contributors.by_commit.reduce(
      (sum, c) => sum + c.commits,
      0
    );
    const weeks = repo.activity.commit_activity.length || 1; // evitar división por 0
    return {
      name: repo.repo.name,
      average: (totalCommits / weeks).toFixed(2),
    };
  });

  return (
    <Plot
      data={[
        {
          x: data.map((d) => d.name),
          y: data.map((d) => d.average),
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
  );
};

export default AverageCommitsPerWeekChart;
