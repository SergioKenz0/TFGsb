import Plot from "react-plotly.js";
import TopNWithOthers from "../utils/TopNWithOthers";

const PopularityChart = ({ repos }) => {
  // Preparamos los datos base
  const baseData = repos.map((r) => ({
    name: r.repo.name,
    stars: r.metrics.stars || 0,
    forks: r.metrics.forks || 0,
    watchers: r.metrics.watchers || 0,
  }));

  return (
    <TopNWithOthers data={baseData} valueKey="stars" nameKey="name">
      {(filteredData) => (
        <Plot
          data={[
            {
              name: "⭐ Stars",
              x: filteredData.map((d) => d.name),
              y: filteredData.map((d) => d.stars),
              type: "bar",
            },
            {
              name: "🍴 Forks",
              x: filteredData.map((d) => d.name),
              y: filteredData.map((d) => d.forks),
              type: "bar",
            },
            {
              name: "👁️ Watchers",
              x: filteredData.map((d) => d.name),
              y: filteredData.map((d) => d.watchers),
              type: "bar",
            },
          ]}
          layout={{
            barmode: "group",
            height: 300,
            margin: { t: 30 },
            yaxis: { title: "Cantidad" },
            xaxis: { title: "Repositorio" },
          }}
          config={{ displayModeBar: false }}
        />
      )}
    </TopNWithOthers>
  );
};

export default PopularityChart;
