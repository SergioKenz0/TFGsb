import { useState } from "react";
import PlotlyChart from "./components/PlotlyChart";
import "./App.css";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [repoData, setRepoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!repoUrl) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repo_url: repoUrl }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      console.log("📡 Datos recibidos en el front:", data);

      setRepoData({
        repoName: data.name || "Nombre no disponible",
        creationYear: data.createdAt ? data.createdAt.split("-")[0] : "Desconocido",
        firstCommitDate: data.first_commit_date || "Desconocida",
        stars: data.stargazerCount || 0,
        forks: data.forkCount || 0,
        openIssues: data.issues?.totalCount || 0,
        closedIssues: data.closedIssues?.totalCount || 0,
        ownerType: data.owner_type || "Desconocido",
        ownerLocation: data.owner_location || "Ubicación desconocida",
      });

      setLoading(false);
    } catch (error) {
      console.error(" Error al analizar el repositorio:", error);
      setError("Hubo un problema al obtener los datos");
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Analizador de Repositorios GitHub</h1>
      <input
        type="text"
        placeholder="Introduce la URL del repositorio"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analizando..." : "Analizar"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {repoData && (
        <div>
          <h2>Resultados para: {repoData.repoName}</h2>
          <p><strong>Año de creación:</strong> {repoData.creationYear}</p>
          <p><strong>Fecha del primer commit:</strong> {repoData.firstCommitDate}</p>
          <p><strong>Estrellas:</strong> {repoData.stars}</p>
          <p><strong>Forks:</strong> {repoData.forks}</p>
          <p><strong>Issues abiertas:</strong> {repoData.openIssues}</p>
          <p><strong>Issues cerradas:</strong> {repoData.closedIssues}</p>
          <p><strong>Tipo de propietario:</strong> {repoData.ownerType}</p>
          <p><strong>Ubicación del propietario:</strong> {repoData.ownerLocation}</p>

          <h3>Gráficos de análisis</h3>
          <PlotlyChart repoData={repoData} chartType="grafico1" />
          <PlotlyChart repoData={repoData} chartType="grafico2" />
          <PlotlyChart repoData={repoData} chartType="grafico3" />
        </div>
      )}
    </div>
  );
}

export default App;
