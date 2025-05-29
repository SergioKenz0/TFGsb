
import { Link } from "react-router-dom";
import "../assets/styles/components/_header.scss";

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <span className="header__logo--github">GitHub</span>
        <span className="header__logo--repominer">Miner</span>
      </Link>
      <Link to="/analyze" className="header__button">
        Crear Informe +
      </Link>
    </header>
  );
};

export default Header;
