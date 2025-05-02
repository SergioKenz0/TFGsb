import Plot from "react-plotly.js";
import { useMemo } from "react";

const TopContributorsChart = ({ repos }) => {
  // Colores para diferenciar repos
  const colorPalette = [
    "#4a3ddf",
    "#FF6B6B",
    "#1DD1A1",
    "#FF9F43",
    "#00B894",
    "#0984E3",
    "#D980FA",
    "#00CED1",
  ];

  // Asignar colores únicos a cada repo (memoizado para consistencia)
  const repoColors = useMemo(() => {
    const map = {};
    repos.forEach((repo, i) => {
      map[repo.repo.name] = colorPalette[i % colorPalette.length];
    });
    return map;
  }, [repos]);

  // Crear lista de contribuciones
  const contributions = [];
  repos.forEach((repo) => {
    const repoName = repo.repo.name;
    const color = repoColors[repoName];
    repo.metrics.contributors.by_commit.forEach((contributor) => {
      const label = `${contributor.login} (${repoName})`;
      contributions.push({
        label,
        commits: contributor.commits,
        color,
        repo: repoName,
      });
    });
  });

  // Tomar top 10
  const top = contributions
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 10);

  // Lista única de repositorios presentes en el top
  const usedRepos = Array.from(
    new Set(top.map((c) => c.repo))
  );

  return (
    <div>
      <Plot
        data={[
          {
            type: "bar",
            orientation: "h",
            x: top.map((d) => d.commits),
            y: top.map((d) => d.label),
            marker: {
              color: top.map((d) => d.color),
            },
            hoverinfo: "x+y",
          },
        ]}
        layout={{
          height: 300,
          margin: { l: 180, r: 30, t: 30, b: 30 },
          yaxis: { automargin: true },
          xaxis: { title: "Commits" },
          showlegend: false,
        }}
        config={{ displayModeBar: false }}
      />

      {/* Leyenda manual */}
      <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {usedRepos.map((repo) => (
          <div key={repo} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                display: "inline-block",
                width: "14px",
                height: "14px",
                backgroundColor: repoColors[repo],
                borderRadius: "3px",
              }}
            ></span>
            <span style={{ fontSize: "0.9rem" }}>{repo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopContributorsChart;
