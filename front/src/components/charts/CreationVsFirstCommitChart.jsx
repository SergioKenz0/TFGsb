import Plot from "react-plotly.js";

const CreationVsFirstCommitChart = ({ repos }) => {
  const data = repos
    .map((repo) => {
      const created = new Date(repo.repo.created_at);
      const firstCommit = new Date(repo.repo.first_commit);
      const delayDays = (firstCommit - created) / (1000 * 60 * 60 * 24);
      return {
        name: repo.repo.name,
        x: created.toISOString().split("T")[0],
        y: delayDays >= 0 ? delayDays : null,
      };
    })
    .filter((point) => point.y !== null);

  return (
    <Plot
      data={[
        {
          x: data.map((d) => d.x),
          y: data.map((d) => d.y),
          mode: "markers+text",
          type: "scatter",
          text: data.map((d) => d.name),
          textposition: "top center",
          marker: { size: 8, color: "#4a3ddf" },
        },
      ]}
      layout={{
        margin: { t: 30 },
        xaxis: { title: "Fecha de creación" },
        yaxis: { title: "Días hasta primer commit" },
        height: 300,
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default CreationVsFirstCommitChart;
