import React, { useState } from 'react';
import '../assets/styles/components/_info-chart.scss';
import { Info } from 'lucide-react';

const InfoChart = ({ texto }) => {
  const [visible, setVisible] = useState(false);

  const toggleModal = () => setVisible(!visible);

  return (
    <div className="info-chart">
      <button className="info-chart__button" onClick={toggleModal}>
        <Info size={18} />
      </button>

      {visible && (
        <div className="info-chart__overlay" onClick={toggleModal}>
          <div className="info-chart__modal" onClick={e => e.stopPropagation()}>
            <p>{texto}</p>
            <button className="info-chart__close" onClick={toggleModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoChart;
