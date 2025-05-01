import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/pages/_create-report-page.scss";

const CreateReportPage = () => {
  const [urls, setUrls] = useState([""]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleAddField = () => {
    if (urls.length < 5) setUrls([...urls, ""]);
  };

  const handleRemoveField = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validUrls = urls.filter((url) => url.trim() !== "");

    if (validUrls.length === 0) {
      setError("Debes introducir al menos una URL.");
      return;
    }

    if (validUrls.length > 5) {
      setError("Solo puedes analizar hasta 5 repositorios.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_urls: validUrls }),
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
        {urls.map((url, index) => (
          <div key={index} className="url-input">
            <input
              type="url"
              placeholder={`Repositorio #${index + 1}`}
              value={url}
              onChange={(e) => handleChange(index, e.target.value)}
              required
            />
            {urls.length > 1 && (
              <button type="button" onClick={() => handleRemoveField(index)}>
                ✖
              </button>
            )}
          </div>
        ))}
        {urls.length < 5 && (
          <button
            type="button"
            className="add-url"
            onClick={handleAddField}
            disabled={loading}
          >
            + Añadir otro repositorio
          </button>
        )}
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
