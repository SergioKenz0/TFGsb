import Plot from "react-plotly.js";

const ExternalContributorsRatioChart = ({ repos }) => {
  const data = repos
    .map((r) => {
      const ratio = r.advanced_metrics?.external_contributors_ratio;
      return {
        name: r.repo.name,
        ratio: typeof ratio === "number" ? ratio : null,
      };
    })
    .filter((d) => d.ratio !== null)
    .sort((a, b) => b.ratio - a.ratio);

  return (
    <Plot
      data={[
        {
          x: data.map((d) => d.ratio),
          y: data.map((d) => d.name),
          type: "bar",
          orientation: "h",
          marker: {
            color: "#3a2ccc",
          },
        },
      ]}
      layout={{
        title: {
          text: "Contribución externa por repositorio",
          font: { size: 16 },
        },
        xaxis: {
          title: "% de contribuciones externas",
          range: [0, 100],
        },
        margin: { t: 40, l: 180 },
        height: 300 + data.length * 20,
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default ExternalContributorsRatioChart;
