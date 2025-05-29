import Plot from "react-plotly.js";

const OwnerTypeByLocationChart = ({ repos }) => {
  const rawLocations = {};

  repos.forEach((repo) => {
    const location = repo.repo.owner_location || "Desconocida";
    const type = repo.repo.owner_type || "Desconocido";

    if (!rawLocations[location]) {
      rawLocations[location] = { User: 0, Organization: 0 };
    }
    rawLocations[location][type] += 1;
  });

  // Paso 1: convertir a array y ordenar por total
  const sorted = Object.entries(rawLocations)
    .map(([loc, counts]) => ({
      location: loc,
      User: counts.User || 0,
      Organization: counts.Organization || 0,
      total: (counts.User || 0) + (counts.Organization || 0),
    }))
    .sort((a, b) => b.total - a.total);

  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);

  if (rest.length > 0) {
    const otros = rest.reduce(
      (acc, loc) => {
        acc.User += loc.User;
        acc.Organization += loc.Organization;
        return acc;
      },
      { location: "Otros", User: 0, Organization: 0 }
    );
    top.push(otros);
  }

  return (
    <Plot
      data={[
        {
          y: top.map((l) => l.location),
          x: top.map((l) => l.User),
          name: "User",
          type: "bar",
          orientation: "h",
          marker: { color: "#4a3ddf" },
        },
        {
          y: top.map((l) => l.location),
          x: top.map((l) => l.Organization),
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
          x: 1.05,
          y: 1,
          orientation: "v",
        },
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default OwnerTypeByLocationChart;
