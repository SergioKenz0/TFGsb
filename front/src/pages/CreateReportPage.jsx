import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/pages/_create-report-page.scss";

const MAX_REPOS = 100;

const CreateReportPage = () => {
  const [urlText, setUrlText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const parseUrls = (text) => {
    return text
      .split(/[\s,]+/)
      .map((u) => u.trim())
      .filter((u) => u !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedUrls = parseUrls(urlText);

    if (parsedUrls.length === 0) {
      setError("Debes introducir al menos una URL.");
      return;
    }

    if (parsedUrls.length > MAX_REPOS) {
      setError(`Solo puedes analizar hasta ${MAX_REPOS} repositorios.`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_urls: parsedUrls
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar el informe.");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-report">
      <h1>Crea un Informe</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={6}
          placeholder="Introduce hasta 100 URLs de repositorios GitHub"
          value={urlText}
          onChange={(e) => setUrlText(e.target.value)}
          className="urls-textarea"
          required
        />

        <p>{parseUrls(urlText).length} / {MAX_REPOS} repos introducidos</p>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <div className="loader"></div>
        ) : (
          <button type="submit" className="submit-btn">
            Crear Informe
          </button>
        )}
      </form>
    </div>
  );
};

export default CreateReportPage;
