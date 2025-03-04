import React from 'react';
import PropTypes from 'prop-types';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
// import '../styles/dashboard.css';

const DashboardCard = ({ metric, label, trend, trendValue }) => {
  return (
    <div className="dashboard-card">
      <div className="metric">{metric}</div>
      <div className="label">{label}</div>
      {trend && (
        <div className={`trend ${trend}`}>
          {trend === 'up' ? <FaArrowUp /> : <FaArrowDown />} {trendValue}
        </div>
      )}
    </div>
  );
};

DashboardCard.propTypes = {
  metric: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(['up', 'down', '']),
  trendValue: PropTypes.string,
};

DashboardCard.defaultProps = {
  trend: '',
  trendValue: '',
};

export default DashboardCard;