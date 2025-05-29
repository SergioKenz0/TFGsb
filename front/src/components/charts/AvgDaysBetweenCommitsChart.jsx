import Plot from "react-plotly.js";
import TopNWithOthers from "../utils/TopNWithOthers";

const AvgDaysBetweenCommitsChart = ({ repos }) => {
  // Filtramos solo los repos válidos
  const filtered = repos.filter(
    (repo) =>
      repo.advanced_metrics?.avg_days_between_commits !== undefined &&
      repo.advanced_metrics.avg_days_between_commits !== "N/A"
  );

  // Transformamos los datos para usar con TopNWithOthers
  const baseData = filtered.map((repo) => ({
    name: repo.repo.name,
    value: repo.advanced_metrics.avg_days_between_commits,
  }));

  return (
    <TopNWithOthers data={baseData} valueKey="value" nameKey="name">
      {(filteredData) => (
        <Plot
          data={[
            {
              x: filteredData.map((d) => d.name),
              y: filteredData.map((d) => d.value),
              type: "scatter",
              mode: "lines+markers+text",
              text: filteredData.map((val) => `${val.value} días`),
              textposition: "top center",
              line: { shape: "linear" },
              marker: { color: "#4a3ddf" },
              name: "Días promedio entre commits",
            },
          ]}
          layout={{
            title: "Días promedio entre commits",
            xaxis: { title: "Repositorio" },
            yaxis: { title: "Días", rangemode: "tozero" },
            height: 320,
            margin: { t: 40 },
          }}
          config={{ displayModeBar: false }}
        />
      )}
    </TopNWithOthers>
  );
};

export default AvgDaysBetweenCommitsChart;
