import Plot from 'react-plotly.js';

const MiniPopularityChart = ({ repos }) => {
  const stars = repos.map((r) => r.metrics.stars);
  const forks = repos.map((r) => r.metrics.forks);
  const labels = repos.map((r) => r.repo.name);

  return (
    <div className="mini-chart">
      <Plot
        data={[
          {
            type: 'bar',
            x: stars,
            y: labels,
            orientation: 'h',
            marker: { color: '#4a3ddf' },
            hoverinfo: 'skip',
            name: 'Stars',
          },
          {
            type: 'bar',
            x: forks,
            y: labels,
            orientation: 'h',
            marker: { color: '#999' },
            hoverinfo: 'skip',
            name: 'Forks',
          },
        ]}
        layout={{
          barmode: 'group',
          height: 25 * repos.length + 60,
          margin: { l: 140, r: 80, t: 10, b: 30 },
          showlegend: true,
          legend: {
            orientation: 'v',
            x: 1.05,
            y: 1,
            font: { size: 10 },
          },
          xaxis: {
            showgrid: false,
            showticklabels: true,
            tickfont: { size: 10 },
            zeroline: true,
            zerolinewidth: 1,
            zerolinecolor: '#ccc',
            linecolor: '#ccc',
            linewidth: 1,
            title: 'Cantidad',
            titlefont: { size: 10 },
          },
          yaxis: {
            showticklabels: true,
            tickfont: { size: 10 },
            showgrid: false,
            zeroline: true,
            zerolinewidth: 1,
            zerolinecolor: '#ccc',
            linecolor: '#ccc',
            linewidth: 1,
          },
        }}
        config={{ displayModeBar: false, staticPlot: true }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
      />
    </div>
  );
};

export default MiniPopularityChart;
