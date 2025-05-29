import Plot from "react-plotly.js";

// Agrupa los lenguajes del resto de repos y promedia los porcentajes por lenguaje
function agruparOtros(repos, topRepos, allLanguages) {
  const otros = repos.filter((r) => !topRepos.includes(r));
  if (otros.length === 0) return null;

  const sumPorLenguaje = {};
  allLanguages.forEach((lang) => (sumPorLenguaje[lang] = 0));

  otros.forEach((repo) => {
    allLanguages.forEach((lang) => {
      const found = repo.languages.breakdown.find((l) => l.name === lang);
      if (found) sumPorLenguaje[lang] += found.percentage;
    });
  });

  const promedioPorLenguaje = {};
  allLanguages.forEach((lang) => {
    promedioPorLenguaje[lang] = Math.round((sumPorLenguaje[lang] / otros.length) * 100) / 100;
  });

  return {
    repo: { name: "Otros" },
    languages: {
      breakdown: allLanguages.map((lang) => ({
        name: lang,
        percentage: promedioPorLenguaje[lang],
      })),
    },
  };
}

const LanguagesBreakdownChart = ({ repos }) => {
  // Paso 1: obtener todos los lenguajes únicos
  const allLanguages = Array.from(
    new Set(repos.flatMap((repo) => repo.languages.breakdown.map((l) => l.name)))
  );

  // Paso 2: calcular tamaño total por repo y obtener top 5
  const reposOrdenados = [...repos].sort((a, b) => {
    const sizeA = a.languages.breakdown.reduce((sum, l) => sum + l.percentage, 0);
    const sizeB = b.languages.breakdown.reduce((sum, l) => sum + l.percentage, 0);
    return sizeB - sizeA;
  });

  const topRepos = reposOrdenados.slice(0, 5);
  const otrosRepo = agruparOtros(repos, topRepos, allLanguages);

  const finalRepos = otrosRepo ? [...topRepos, otrosRepo] : topRepos;

  // Paso 3: generar trazas por lenguaje
  const traces = allLanguages.map((lang) => ({
    name: lang,
    type: "bar",
    x: finalRepos.map((r) => r.repo.name),
    y: finalRepos.map((r) => {
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
