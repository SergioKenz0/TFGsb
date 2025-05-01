import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const AnalyzePage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/reports`)
      .then((res) => res.json())
      .then((data) => setReport(data[parseInt(id) - 1]))
      .catch((err) => console.error("❌ Error al cargar reporte:", err));
  }, [id]);

  if (!report) return <div className="analyze__loading">Cargando análisis...</div>;

  return (
    <div className="analyze">
      <h1 className="analyze__title">Análisis de {report.repo.name}</h1>
      <div className="analyze__content">
        <p><strong>Repositorio:</strong> <a href={report.repo.url}>{report.repo.url}</a></p>
        <p><strong>Estrellas:</strong> {report.metrics.stars}</p>
        <p><strong>Forks:</strong> {report.metrics.forks}</p>
        <p><strong>Commits:</strong> {report.metrics.contributors.by_commit.reduce((acc, c) => acc + c.commits, 0)}</p>
        <p><strong>Contribuidores activos:</strong> {report.metrics.contributors.active}</p>
        <p><strong>Lenguaje principal:</strong> {report.languages.main}</p>
      </div>
    </div>
  );
};

export default AnalyzePage;
