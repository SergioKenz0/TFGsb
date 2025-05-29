import '../assets/styles/components/_report-card.scss';
import { Link } from 'react-router-dom';
import MiniPopularityChart from './MiniPopularityChart';

const MAX_REPOS_MOSTRADOS = 5;

const ReportCard = ({ index, report }) => {
  const totalRepos = report.repos.length;
  const visibleRepos = report.repos.slice(0, MAX_REPOS_MOSTRADOS);
  const hayMas = totalRepos > MAX_REPOS_MOSTRADOS;

  return (
    <div className="report-card">
      <div className="report-card__header">
        <div className="report-card__info">
          <h2 className="report-card__title">
            Report {index + 1}
            {report.fecha && (
              <span className="report-card__fecha">
                {'  '}· {new Date(report.fecha).toLocaleDateString()}
              </span>
            )}
          </h2>
          <p className="report-card__subtitle">
            {totalRepos} Repositorios
          </p>
          <ul className="report-card__repos">
            {visibleRepos.map((r, i) => (
              <li key={i}>{r.repo.name}</li>
            ))}
            {hayMas && <li>etc.</li>}
          </ul>
          <Link to={`/report/${index + 1}`} className="report-card__link">
            📊 Ver análisis
          </Link>
        </div>
        <div className="mini-chart">
          <MiniPopularityChart repos={visibleRepos} />
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
