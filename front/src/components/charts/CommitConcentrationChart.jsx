import Plot from "react-plotly.js";

const CommitConcentrationChart = ({ repos }) => {
  const colorPalette = [
    "#4a3ddf", "#ff6b6b", "#1dd1a1", "#feca57", "#54a0ff", "#ff9ff3", "#00d2d3", "#5f27cd"
  ];

  // Paso 1: calcular el total de commits por repo
  const enriched = repos.map((repo) => {
    const totalCommits = repo.metrics.contributors.by_commit.reduce((acc, c) => acc + c.commits, 0);
    return { ...repo, totalCommits };
  });

  // Paso 2: top 5 por commits
  const sorted = enriched.sort((a, b) => b.totalCommits - a.totalCommits);
  const top5 = sorted.slice(0, 5);
  const others = sorted.slice(5);

  const bars = [];

  top5.forEach((repo, i) => {
    const contributors = repo.metrics.contributors.by_commit;
    const top = contributors.slice().sort((a, b) => b.commits - a.commits).slice(0, 10);
    const color = colorPalette[i % colorPalette.length];

    bars.push({
      y: top.map((c) => c.login),
      x: top.map((c) => c.commits),
      name: repo.repo.name,
      type: "bar",
      orientation: "h",
      marker: { color },
    });
  });

  // Paso 3: agregamos "Otros" si hay más de 5
  if (others.length > 0) {
    const combined = {};

    others.forEach((repo) => {
      repo.metrics.contributors.by_commit.forEach((c) => {
        combined[c.login] = (combined[c.login] || 0) + c.commits;
      });
    });

    const topCombined = Object.entries(combined)
      .map(([login, commits]) => ({ login, commits }))
      .sort((a, b) => b.commits - a.commits)
      .slice(0, 10);

    bars.push({
      y: topCombined.map((c) => c.login),
      x: topCombined.map((c) => c.commits),
      name: "Otros",
      type: "bar",
      orientation: "h",
      marker: { color: "#888" },
    });
  }

  return (
    <Plot
      data={bars}
      layout={{
        barmode: "stack",
        height: 370,
        margin: { t: 30, l: 120 },
        xaxis: { title: "Commits" },
        yaxis: { title: "Top Contributors" },
        legend: {
          orientation: "v",
          x: 1,
          y: 1,
        },
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default CommitConcentrationChart;
