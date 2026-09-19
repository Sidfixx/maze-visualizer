import './Legend.css';

interface LegendItem {
  label: string;
  className: string;
}

const legendItems: LegendItem[] = [
  {
    label: 'Start',
    className: 'legend-start',
  },
  {
    label: 'End',
    className: 'legend-end',
  },
  {
    label: 'Wall',
    className: 'legend-wall',
  },
  {
    label: 'Weighted',
    className: 'legend-weighted',
  },
  {
    label: 'Visited',
    className: 'legend-visited',
  },
  {
    label: 'Shortest Path',
    className: 'legend-path',
  },
];

export function Legend() {
  return (
    <div className="legend">
      <span className="legend-title">Legend</span>

      <div className="legend-items">
        {legendItems.map((item) => (
          <div className="legend-item" key={item.label}>
            <span
              className={`legend-color ${item.className}`}
            />
            <span className="legend-label">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}