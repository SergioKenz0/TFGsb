import React from 'react';
import Plot from 'react-plotly.js';

function PlotlyChart({ repoData }) {
    // Comprobar si repoData está disponible
    if (!repoData) {
        return <div>Cargando datos del repositorio...</div>;
    }

    // Acceder a las propiedades de repoData de forma segura
    const { name, stargazerCount, forkCount, issues, closedIssues, defaultBranchRef } = repoData;

    // Extraer las cantidades correctamente desde los objetos anidados
    const openIssues = issues ? issues.totalCount - closedIssues.totalCount : 0;
    const closedIssuesCount = closedIssues ? closedIssues.totalCount : 0;

    // Preparamos los datos para el gráfico
    const data = [
        {
            x: ['Estrellas', 'Forks', 'Issues Abiertas', 'Issues Cerradas', 'Commits'],
            y: [
                stargazerCount, 
                forkCount, 
                openIssues, 
                closedIssuesCount, 
                defaultBranchRef?.target?.history?.totalCount || 0 // Aseguramos que commits sea 0 si no está disponible
            ],
            type: 'bar',
        },
    ];

    return (
        <div>
            <h2>Repositorio: {name}</h2>
            <Plot
                data={data}
                layout={{
                    title: `Análisis de ${name}`,
                    width: 700,
                    height: 500,
                }}
            />
        </div>
    );
}

export default PlotlyChart;
