import { useState } from 'react';
import PlotlyChart from './components/PlotlyChart';

function App() {
    const [repoUrl, setRepoUrl] = useState('');
    const [repoData, setRepoData] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Estado para carga

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log("Enviando solicitud a backend con URL:", repoUrl);
    
        setIsLoading(true); // Activar estado de carga
    
        try {
            const response = await fetch('http://127.0.0.1:5000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ repo_url: repoUrl }), // Corregido para coincidir con el backend
            });
    
            console.log("Respuesta recibida:", response);
    
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Datos recibidos del backend:", data);
    
            if (data.error) {
                alert("Error del servidor: " + data.error);
            } else {
                // Verifica que los datos sean válidos y los imprime antes de procesarlos
                console.log("Estructura de los datos de repoData:", data);
                setRepoData(data);
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            alert('Error al procesar la solicitud. Revisa la consola para más detalles.');
        } finally {
            setIsLoading(false); // Desactivar estado de carga
        }
    };

    return (
        <div className="App">
            <h1>Analizador de Repositorios GitHub</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Introduce la URL del repositorio"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    required
                />
                <button type="submit">Analizar</button>
            </form>

            {/* Mostrar estado de carga mientras se están obteniendo los datos */}
            {isLoading && <div>Cargando datos del repositorio...</div>}

            {/* Mostrar los resultados si repoData está disponible */}
            {repoData && !isLoading && (
                <div>
                    <h2>Resultados para: {repoData.name}</h2>
                    <p>Año de creación: {new Date(repoData.createdAt).getFullYear()}</p>
                    <p>Estrellas: {repoData.stargazerCount}</p>
                    <p>Forks: {repoData.forkCount}</p>
                    <p>Issues abiertas: {repoData.issues.totalCount - repoData.closedIssues.totalCount}</p>
                    <p>Commits: {repoData.defaultBranchRef?.target?.history?.totalCount || 0}</p>
                    <PlotlyChart repoData={repoData} />
                </div>
            )}
        </div>
    );
}

export default App;
