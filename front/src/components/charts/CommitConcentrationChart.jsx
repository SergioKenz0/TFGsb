import Plot from "react-plotly.js";

const CommitConcentrationChart = ({ repos }) => {
  const bars = [];
  const repoColors = {};

  const colorPalette = [
    "#4a3ddf", "#ff6b6b", "#1dd1a1", "#feca57", "#54a0ff", "#ff9ff3", "#00d2d3", "#5f27cd"
  ];

  repos.forEach((repo, i) => {
    const contributors = repo.metrics.contributors.by_commit;
    const sorted = contributors.slice().sort((a, b) => b.commits - a.commits);
    const top = sorted.slice(0, 10);
    const color = colorPalette[i % colorPalette.length];
    repoColors[repo.repo.name] = color;

    bars.push({
      y: top.map((c) => c.login),
      x: top.map((c) => c.commits),
      name: repo.repo.name,
      type: "bar",
      orientation: "h",
      marker: { color },
    });
  });

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
