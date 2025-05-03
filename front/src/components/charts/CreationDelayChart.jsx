import Plot from "react-plotly.js";

const CreationDelayChart = ({ repos }) => {
  const data = repos
    .map((repo) => {
      const created = new Date(repo.repo.created_at);
      const firstCommit = new Date(repo.repo.first_commit);
      const delay = (firstCommit - created) / (1000 * 60 * 60 * 24);

      return {
        name: repo.repo.name,
        delay: delay >= 0 ? Math.round(delay) : null,
        created: created.toISOString().split("T")[0],
        firstCommit: firstCommit.toISOString().split("T")[0],
      };
    })
    .filter((r) => r.delay !== null)
    .sort((a, b) => b.delay - a.delay); // orden descendente

  const average =
    data.reduce((acc, r) => acc + r.delay, 0) / (data.length || 1);

  return (
    <Plot
      data={[
        {
          type: "bar",
          orientation: "h",
          x: data.map((r) => r.delay),
          y: data.map((r) => r.name),
          text: data.map(
            (r) =>
              `${r.delay} días\nCreado: ${r.created}\nPrimer commit: ${r.firstCommit}`
          ),
          textposition: "auto",
          hoverinfo: "text",
          marker: { color: "#4a3ddf" },
        },
        {
          type: "scatter",
          mode: "lines",
          x: [average, average],
          y: [data[0].name, data[data.length - 1].name],
          name: "Promedio",
          line: {
            color: "orange",
            width: 2,
            dash: "dash",
          },
          hoverinfo: "x",
        },
      ]}
      layout={{
        margin: { t: 30, l: 100, r: 20 },
        height: 350,
        xaxis: { title: "Días desde creación al primer commit" },
        yaxis: { automargin: true },
        showlegend: true,
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default CreationDelayChart;
