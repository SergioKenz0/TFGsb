import Plot from "react-plotly.js";

const OwnerTypeByLocationChart = ({ repos }) => {
  const locations = {};

  repos.forEach((repo) => {
    const location = repo.repo.owner_location || "Desconocida";
    const type = repo.repo.owner_type || "Desconocido";

    if (!locations[location]) {
      locations[location] = { User: 0, Organization: 0 };
    }
    locations[location][type] += 1;
  });

  const locationNames = Object.keys(locations);

  return (
    <Plot
      data={[
        {
          y: locationNames,
          x: locationNames.map((loc) => locations[loc].User || 0),
          name: "User",
          type: "bar",
          orientation: "h",
          marker: { color: "#4a3ddf" },
        },
        {
          y: locationNames,
          x: locationNames.map((loc) => locations[loc].Organization || 0),
          name: "Organization",
          type: "bar",
          orientation: "h",
          marker: { color: "gray" },
        },
      ]}
      layout={{
        barmode: "group",
        margin: { t: 30, l: 150, r: 50 },
        xaxis: { title: "Repositorios" },
        yaxis: { title: "Ubicación" },
        height: 300,
        legend: {
          x: 1.05, // posición derecha
          y: 1,
          orientation: "v",
        },
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default OwnerTypeByLocationChart;
