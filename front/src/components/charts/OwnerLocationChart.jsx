import Plot from "react-plotly.js";

const OwnerLocationChart = ({ repos }) => {
  // Contamos ubicaciones
  const locationCounts = repos.reduce((acc, repo) => {
    const loc = repo.repo.owner_location || "Desconocida";
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  const locations = Object.keys(locationCounts);
  const counts = Object.values(locationCounts);

  return (
    <Plot
      data={[
        {
          type: "bar",
          x: counts,
          y: locations,
          orientation: "h",
          marker: {
            color: "#4a3ddf",
          },
        },
      ]}
      layout={{
        height: 300,
        margin: { l: 100, r: 30, t: 30, b: 30 },
        yaxis: { automargin: true },
        xaxis: { title: "Repositorios" },
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default OwnerLocationChart;
