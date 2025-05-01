import Plot from 'react-plotly.js';

const MiniPopularityChart = ({ repos }) => {
  const stars = repos.map((r) => r.metrics.stars);
  const forks = repos.map((r) => r.metrics.forks);
  const labels = repos.map((r) => r.repo.name); // necesario para ordenar barras

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
            width: 260,
            height: 25 * repos.length + 40,
            margin: { l: 10, r: 10, t: 10, b: 10 },
            showlegend: false,
            xaxis: {
              showgrid: false,
              showticklabels: false,
              zeroline: true,
              zerolinewidth: 1,
              zerolinecolor: '#ccc',
              linecolor: '#ccc',
              linewidth: 1,
              mirror: false,          // ✅ no reflejar en lado superior
              ticks: ''
            },
            yaxis: {
              showticklabels: false,
              showgrid: false,
              zeroline: true,
              zerolinewidth: 1,
              zerolinecolor: '#ccc',
              linecolor: '#ccc',
              linewidth: 1,
              mirror: false,          // ✅ no reflejar en lado derecho
              ticks: ''
            }
          }}
          
          
        config={{ displayModeBar: false, staticPlot: true }}
        style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
      />
    </div>
  );
};

export default MiniPopularityChart;
