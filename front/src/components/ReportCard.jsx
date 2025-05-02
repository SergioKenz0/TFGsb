import '../assets/styles/components/_report-card.scss';
import { Link } from 'react-router-dom';
import MiniPopularityChart from './MiniPopularityChart';

const ReportCard = ({ index, report }) => {
  return (
    <div className="report-card">
      <div className="report-card__header">
        <div className="report-card__info">
          <h2 className="report-card__title">Report {index + 1}</h2>
          <p className="report-card__subtitle">
            {report.repos.length} Repositorios
          </p>
          <ul className="report-card__repos">
            {report.repos.map((r, i) => (
              <li key={i}>{r.repo.name}</li>
            ))}
          </ul>
          <Link to={`/report/${index + 1}`} className="report-card__link">
            📊 Ver análisis
          </Link>

        </div>
        <div className="mini-chart">
          <MiniPopularityChart repos={report.repos} />
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
