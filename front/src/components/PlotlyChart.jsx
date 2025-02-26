import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

function PlotlyChart({ chartType }) {
    const [repoData, setRepoData] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem("repoData");
        if (storedData) {
            setRepoData(JSON.parse(storedData));
        }
    }, []);

    if (!repoData) {
        return <div>Cargando datos del repositorio...</div>;
    }

    const {
        repoName,
        creationYear,
        firstCommitDate,
        stars,
        forks,
        openIssues,
        closedIssues,
        ownerType
    } = repoData;

    let data = [];
    let layout = {};

    switch(chartType) {
        case 'grafico1':
            data = [
                {
                    x: ['Creación', 'Primer Commit'],
                    y: [parseInt(creationYear), new Date(firstCommitDate).getFullYear()],
                    type: 'bar',
                },
            ];
            layout = {
                title: `Comparativa de Año de Creación vs Primer Commit`,
                width: 700,
                height: 500,
            };
            break;
        case 'grafico2':
            data = [
                {
                    labels: ['Estrellas', 'Forks', 'Issues Abiertas', 'Issues Cerradas'],
                    values: [stars, forks, openIssues, closedIssues],
                    type: 'pie',
                },
            ];
            layout = {
                title: `Popularidad del Repositorio`,
                width: 700,
                height: 500,
            };
            break;
        case 'grafico3':
            data = [
                {
                    x: ['Usuario', 'Organización'],
                    y: [ownerType === 'User' ? 1 : 0, ownerType === 'Organization' ? 1 : 0],
                    type: 'bar',
                },
            ];
            layout = {
                title: `Propietarios: Usuario vs Organización`,
                width: 700,
                height: 500,
            };
            break;
        default:
            return <div>No se ha encontrado el gráfico.</div>;
    }

    return (
        <div>
            <h2>Repositorio: {repoName}</h2>
            <Plot
                data={data}
                layout={layout}
            />
        </div>
    );
}

export default PlotlyChart;
