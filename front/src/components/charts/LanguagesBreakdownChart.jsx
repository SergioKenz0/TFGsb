import Plot from "react-plotly.js";

const LanguagesBreakdownChart = ({ repos }) => {
  // Extraemos todos los lenguajes únicos
  const allLanguages = Array.from(
    new Set(repos.flatMap((repo) => repo.languages.breakdown.map((l) => l.name)))
  );

  // Construimos las trazas por lenguaje
  const traces = allLanguages.map((lang) => ({
    name: lang,
    type: "bar",
    x: repos.map((r) => r.repo.name),
    y: repos.map((r) => {
      const found = r.languages.breakdown.find((l) => l.name === lang);
      return found ? found.percentage : 0;
    }),
  }));

  return (
    <Plot
      data={traces}
      layout={{
        barmode: "stack",
        height: 300,
        margin: { t: 30 },
        yaxis: { title: "Porcentaje (%)", ticksuffix: "%" },
        xaxis: { title: "Repositorio" },
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default LanguagesBreakdownChart;
