import Plot from "react-plotly.js";

const OwnerTypeChart = ({ repos }) => {
  const counts = repos.reduce(
    (acc, repo) => {
      const type = repo.repo.owner_type;
      if (type === "User") acc.user += 1;
      else if (type === "Organization") acc.org += 1;
      return acc;
    },
    { user: 0, org: 0 }
  );

  return (
    <Plot
      data={[
        {
          values: [counts.user, counts.org],
          labels: ["User", "Organization"],
          type: "pie",
          marker: {
            colors: ["#4a3ddf", "#aaa"],
          },
          textinfo: "label+percent",
          hoverinfo: "label+value",
        },
      ]}
      layout={{
        height: 300,
        margin: { t: 30 },
        showlegend: true,
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default OwnerTypeChart;
