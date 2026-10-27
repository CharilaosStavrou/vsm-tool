import { formatNumber } from '../lib/format.js';
import { getEffectiveCycleTime } from '../lib/vsmCalculations.js';

// Key lean metrics. Each card has a tooltip with the formula behind it.
function MetricsPanel({ metrics }) {
  const { taktTime, leadTimeDays, valueAddedTime, processCycleEfficiency, bottleneck } = metrics;
  const isBottleneckAboveTakt = bottleneck && getEffectiveCycleTime(bottleneck) > taktTime;

  const cards = [
    {
      label: 'Takt time',
      value: formatNumber(taktTime),
      unit: 's/unit',
      tooltip: 'Available time per day ÷ customer demand per day',
    },
    {
      label: 'Lead time',
      value: formatNumber(leadTimeDays),
      unit: 'days',
      tooltip: 'Sum of days of inventory, raw material to finished goods',
    },
    {
      label: 'VA time',
      value: formatNumber(valueAddedTime),
      unit: 's',
      tooltip: 'Value-added time: sum of all process cycle times',
    },
    {
      label: 'PCE',
      // Process cycle efficiency is often far below 1 %, so show more decimals there.
      value: formatNumber(processCycleEfficiency, processCycleEfficiency < 1 ? 3 : 1),
      unit: '%',
      tooltip:
        'Process cycle efficiency = VA time ÷ lead time × 100. ' +
        'Assumption: lead time is converted to seconds using the available ' +
        'time per day (working time), not 24 hours.',
    },
    {
      label: 'Bottleneck',
      value: bottleneck ? bottleneck.name : '–',
      unit: bottleneck ? `${formatNumber(getEffectiveCycleTime(bottleneck))} s eff.` : '',
      tooltip: 'Process with the highest effective cycle time (C/T ÷ uptime)',
      isWarning: isBottleneckAboveTakt,
    },
  ];

  return (
    <section className="metrics-panel" aria-label="Metrics">
      {cards.map(({ label, value, unit, tooltip, isWarning }) => (
        <div key={label} className={`metric ${isWarning ? 'is-danger' : ''}`} title={tooltip}>
          <span className="metric-label">
            {label} <span className="info-icon" aria-hidden="true">ⓘ</span>
          </span>
          <span className="metric-value">{value}</span>
          <span className="metric-unit">{unit}</span>
        </div>
      ))}
    </section>
  );
}

export default MetricsPanel;
