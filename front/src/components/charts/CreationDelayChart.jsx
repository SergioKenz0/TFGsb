import Plot from "react-plotly.js";
import TopNWithOthers from "../utils/TopNWithOthers";

const CreationDelayChart = ({ repos }) => {
  const baseData = repos
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
    .filter((r) => r.delay !== null);

  const average = baseData.reduce((acc, r) => acc + r.delay, 0) / (baseData.length || 1);

  return (
    <TopNWithOthers
      data={baseData.map(({ name, delay }) => ({ name, value: delay }))}
      valueKey="value"
      nameKey="name"
    >
      {(filteredTop) => {
        // reconstruir el resto de campos desde los originales
        const mergedData = filteredTop.map((entry) => {
          if (entry.name === "Otros") {
            return {
              name: "Otros",
              delay: entry.value,
              created: "—",
              firstCommit: "—",
            };
          }
          const full = baseData.find((r) => r.name === entry.name);
          return full || entry;
        });

        return (
          <Plot
            data={[
              {
                type: "bar",
                orientation: "h",
                x: mergedData.map((r) => r.delay),
                y: mergedData.map((r) => r.name),
                text: mergedData.map(
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
                y: [mergedData[0].name, mergedData[mergedData.length - 1].name],
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
      }}
    </TopNWithOthers>
  );
};

export default CreationDelayChart;
