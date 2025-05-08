// src/components/MiniNavBar.jsx
import "../assets/styles/components/_mini-navbar.scss";

const MiniNavBar = ({ page, setPage }) => {
  const items = [
    "Resumen",
    "Actividad",
    "Comunidad",
    "Mantenimiento",
    "Integración",
  ];

  return (
    <div className="mini-navbar">
      {items.map((label, i) => (
        <button
          key={i}
          className={`mini-navbar__btn ${page === i ? "active" : ""}`}
          onClick={() => setPage(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default MiniNavBar;
