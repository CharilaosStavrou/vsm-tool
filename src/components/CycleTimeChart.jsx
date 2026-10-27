import { formatNumber } from '../lib/format.js';
import { getEffectiveCycleTime } from '../lib/vsmCalculations.js';

const width = 720;
const height = 280;
const margin = { top: 24, right: 90, bottom: 44, left: 48 };
const plotWidth = width - margin.left - margin.right;
const plotHeight = height - margin.top - margin.bottom;

// Bar chart (plain SVG) of each process's effective cycle time against takt time.
function CycleTimeChart({ processes, metrics }) {
  const { taktTime, bottleneck, aboveTaktIds } = metrics;
  const bars = processes.map((process) => ({
    process,
    value: getEffectiveCycleTime(process),
  }));

  const ticks = getTicks(Math.max(taktTime, ...bars.map((bar) => bar.value)));
  const maxTick = ticks[ticks.length - 1];
  const toY = (value) => margin.top + plotHeight - (value / maxTick) * plotHeight;
  const bandWidth = plotWidth / bars.length;
  const barWidth = Math.min(bandWidth * 0.6, 70);

  function getBarClass(process) {
    if (process.id === bottleneck?.id) return 'chart-bar is-bottleneck';
    if (aboveTaktIds.includes(process.id)) return 'chart-bar is-aboveTakt';
    return 'chart-bar';
  }

  return (
    <section className="chart-section">
      <h2 className="section-title">Effective cycle time vs takt time</h2>
      <svg className="cycle-time-chart" viewBox={`0 0 ${width} ${height}`} role="img"
        aria-label="Bar chart of effective cycle time per process compared to takt time">
        {ticks.map((tick) => (
          <g key={tick}>
            <line className="chart-grid" x1={margin.left} x2={margin.left + plotWidth}
              y1={toY(tick)} y2={toY(tick)} />
            <text className="chart-tick" x={margin.left - 8} y={toY(tick) + 4} textAnchor="end">
              {tick}
            </text>
          </g>
        ))}
        <text className="chart-tick" x={12} y={margin.top + plotHeight / 2} textAnchor="middle"
          transform={`rotate(-90 12 ${margin.top + plotHeight / 2})`}>
          seconds
        </text>

        {bars.map(({ process, value }, index) => {
          const x = margin.left + index * bandWidth + (bandWidth - barWidth) / 2;
          return (
            <g key={process.id}>
              <rect className={getBarClass(process)} x={x} y={toY(value)}
                width={barWidth} height={margin.top + plotHeight - toY(value)} />
              <text className="chart-value" x={x + barWidth / 2} y={toY(value) - 6} textAnchor="middle">
                {formatNumber(value)}
              </text>
              <text className="chart-label" x={x + barWidth / 2} y={height - margin.bottom + 18}
                textAnchor="middle">
                {process.name}
              </text>
            </g>
          );
        })}

        <line className="chart-axis" x1={margin.left} x2={margin.left + plotWidth}
          y1={margin.top + plotHeight} y2={margin.top + plotHeight} />
        <line className="chart-takt" x1={margin.left} x2={margin.left + plotWidth}
          y1={toY(taktTime)} y2={toY(taktTime)} />
        <text className="chart-takt-label" x={margin.left + plotWidth + 6} y={toY(taktTime) + 4}>
          Takt {formatNumber(taktTime)} s
        </text>
      </svg>
    </section>
  );
}

// Evenly spaced axis ticks with a "nice" step (1, 2 or 5 × 10^n), about 5 of them.
function getTicks(maxValue) {
  if (!(maxValue > 0) || !Number.isFinite(maxValue)) return [0, 1];
  const roughStep = maxValue / 5;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const step = [1, 2, 5, 10].map((factor) => factor * magnitude).find((s) => s >= roughStep);
  const ticks = [];
  for (let tick = 0; tick < maxValue + step; tick += step) ticks.push(tick);
  return ticks;
}

export default CycleTimeChart;
