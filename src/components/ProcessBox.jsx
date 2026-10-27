import { formatNumber } from '../lib/format.js';
import NumberInput from './NumberInput.jsx';

const dataFields = [
  { field: 'cycleTime', label: 'C/T', unit: 's' },
  { field: 'changeoverTime', label: 'C/O', unit: 'min' },
  { field: 'uptime', label: 'Uptime', unit: '%', min: 1, max: 100 },
  { field: 'operators', label: 'Operators', unit: '' },
  { field: 'shifts', label: 'Shifts', unit: '' },
];

const statusLabels = {
  bottleneck: 'Bottleneck',
  aboveTakt: 'Above takt',
};

// Classic VSM process box: name on top, data box below.
// status is 'bottleneck', 'aboveTakt' or null and sets the warning colour.
function ProcessBox({
  process,
  effectiveCycleTime,
  status,
  isFirst,
  isLast,
  canDelete,
  onChange,
  onMove,
  onDelete,
}) {
  return (
    <div className={`process ${status ? `is-${status}` : ''}`}>
      <span className="process-status">{statusLabels[status] ?? ''}</span>
      <div className="process-box">
        <input
          type="text"
          className="process-name"
          value={process.name}
          aria-label="Process name"
          onChange={(event) => onChange('name', event.target.value)}
        />
      </div>
      <div className="data-box">
        {dataFields.map(({ field, label, unit, min = 0, max }) => (
          <label key={field} className="data-row">
            <span className="data-label">{label}</span>
            <NumberInput
              value={process[field]}
              min={min}
              max={max}
              label={`${process.name} ${label}`}
              className="data-input"
              onChange={(value) => onChange(field, value)}
            />
            <span className="data-unit">{unit}</span>
          </label>
        ))}
        <div className="data-row" title="Effective C/T = C/T ÷ (uptime / 100)">
          <span className="data-label">Eff. C/T</span>
          <span className="data-value">{formatNumber(effectiveCycleTime)}</span>
          <span className="data-unit">s</span>
        </div>
      </div>
      <div className="process-actions no-export">
        <button type="button" onClick={() => onMove(-1)} disabled={isFirst} title="Move left">
          ←
        </button>
        <button type="button" onClick={onDelete} disabled={!canDelete} title="Delete process">
          Delete
        </button>
        <button type="button" onClick={() => onMove(1)} disabled={isLast} title="Move right">
          →
        </button>
      </div>
    </div>
  );
}

export default ProcessBox;
