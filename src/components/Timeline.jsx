import { getOrderedInventories } from '../lib/vsmModel.js';
import { getDaysOfInventory } from '../lib/vsmCalculations.js';
import { formatNumber } from '../lib/format.js';

// Classic VSM timeline (ladder). Its columns use the same widths as the map
// above, so every step lines up with its inventory triangle or process box:
// upper steps = waiting time at inventories (days),
// lower steps = cycle time at processes (seconds).
function Timeline({ vsm, metrics }) {
  const { processes, settings } = vsm;
  const inventories = getOrderedInventories(vsm);

  function renderWaitStep(inventory) {
    const days = getDaysOfInventory(inventory.quantity, settings.customerDemandPerDay);
    return (
      <div key={inventory.id} className="timeline-cell timeline-wait">
        <span className="timeline-value">{formatNumber(days)} days</span>
        <div className="timeline-line" />
      </div>
    );
  }

  return (
    <div className="timeline" aria-label="Timeline">
      <div className="timeline-cell timeline-spacer" />
      {processes.flatMap((process, index) => [
        renderWaitStep(inventories[index]),
        <div key={process.id} className="timeline-cell timeline-process">
          <div className="timeline-line" />
          <span className="timeline-value">{formatNumber(process.cycleTime)} s</span>
        </div>,
      ])}
      {renderWaitStep(inventories[inventories.length - 1])}
      <div className="timeline-cell timeline-totals">
        <span className="timeline-total-label">Lead time</span>
        <strong>{formatNumber(metrics.leadTimeDays)} days</strong>
        <span className="timeline-total-label">VA time</span>
        <strong>{formatNumber(metrics.valueAddedTime)} s</strong>
      </div>
    </div>
  );
}

export default Timeline;
