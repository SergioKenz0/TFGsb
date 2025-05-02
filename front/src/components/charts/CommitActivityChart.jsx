import Plot from "react-plotly.js";

const CommitActivityChart = ({ repos }) => {
  const traces = repos.map((repo) => {
    return {
      name: repo.repo.name,
      x: repo.activity.commit_activity.map((entry) => entry.week),
      y: repo.activity.commit_activity.map((entry) => entry.count),
      mode: "lines+markers",
      type: "scatter",
      line: { shape: "spline" },
    };
  });

  return (
    <Plot
      data={traces}
      layout={{
        height: 300,
        margin: { t: 30, r: 80 }, // deja espacio a la derecha para la leyenda
        xaxis: {
          title: "Semana",
          tickangle: -45,
        },
        yaxis: {
          title: "Commits",
        },
        legend: {
          orientation: "v",
          x: 1.02,    // justo fuera del borde derecho
          y: 1,
          xanchor: "left",
        },
      }}
      
      config={{ displayModeBar: false }}
    />
  );
};

export default CommitActivityChart;
