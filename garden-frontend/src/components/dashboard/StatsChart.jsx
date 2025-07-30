import React from 'react';
import './StatsChart.scss';

const StatsChart = ({ title, type, data, labels }) => {
  if (!data || data.length === 0) {
    return (
      <div className="stats-chart empty">
        <h4>{title}</h4>
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);

  const renderLineChart = () => {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - minValue) / (maxValue - minValue)) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="#059669"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - minValue) / (maxValue - minValue)) * 80;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill="#059669"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
    );
  };

  const renderBarChart = () => {
    return (
      <div className="bar-chart">
        {data.map((value, index) => {
          const height = ((value - minValue) / (maxValue - minValue)) * 100;
          return (
            <div key={index} className="bar-container">
              <div 
                className="bar"
                style={{ height: `${height}%` }}
                title={`${labels?.[index] || index}: ${value}`}
              ></div>
              {labels && (
                <span className="bar-label">{labels[index]}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderAreaChart = () => {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - minValue) / (maxValue - minValue)) * 80;
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `0,100 ${points} 100,100`;

    return (
      <svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          points={areaPoints}
          fill="rgba(5, 150, 105, 0.2)"
          stroke="#059669"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#059669"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'area':
        return renderAreaChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <div className={`stats-chart ${type}`}>
      <h4>{title}</h4>
      <div className="chart-container">
        {renderChart()}
      </div>
      <div className="chart-stats">
        <span className="stat-item">
          <span className="stat-label">Max:</span>
          <span className="stat-value">{maxValue}</span>
        </span>
        <span className="stat-item">
          <span className="stat-label">Min:</span>
          <span className="stat-value">{minValue}</span>
        </span>
        <span className="stat-item">
          <span className="stat-label">Avg:</span>
          <span className="stat-value">
            {Math.round(data.reduce((a, b) => a + b, 0) / data.length)}
          </span>
        </span>
      </div>
    </div>
  );
};

export default StatsChart;
