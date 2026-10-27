import { Fragment } from 'react';
import { getOrderedInventories } from '../lib/vsmModel.js';
import { getDaysOfInventory, getEffectiveCycleTime } from '../lib/vsmCalculations.js';
import InventoryTriangle from './InventoryTriangle.jsx';
import ProcessBox from './ProcessBox.jsx';
import { FactoryIcon, PushArrow } from './MapIcons.jsx';

// Horizontal flow, left to right:
// supplier → raw material → process → WIP → process … → finished goods → customer
function ValueStreamMap({ vsm, metrics, onProcessChange, onMoveProcess, onDeleteProcess, onInventoryChange }) {
  const { processes, settings } = vsm;
  const inventories = getOrderedInventories(vsm);

  function getStatus(process) {
    if (process.id === metrics.bottleneck?.id) return 'bottleneck';
    if (metrics.aboveTaktIds.includes(process.id)) return 'aboveTakt';
    return null;
  }

  // inventories[i] sits before processes[i]; the last one is finished goods.
  function renderInventory(inventory, withArrow) {
    return (
      <div className="flow-gap">
        <InventoryTriangle
          inventory={inventory}
          days={getDaysOfInventory(inventory.quantity, settings.customerDemandPerDay)}
          onQuantityChange={(quantity) => onInventoryChange(inventory, quantity)}
        />
        {withArrow && <PushArrow />}
      </div>
    );
  }

  return (
    <section className="vsm-map" aria-label="Value stream map">
      <div className="vsm-flow">
        <FactoryIcon label="Supplier" />
        {processes.map((process, index) => (
          <Fragment key={process.id}>
            {renderInventory(inventories[index], index > 0)}
            <ProcessBox
              process={process}
              effectiveCycleTime={getEffectiveCycleTime(process)}
              status={getStatus(process)}
              isFirst={index === 0}
              isLast={index === processes.length - 1}
              canDelete={processes.length > 1}
              onChange={(field, value) => onProcessChange(process.id, field, value)}
              onMove={(direction) => onMoveProcess(process.id, direction)}
              onDelete={() => onDeleteProcess(process.id)}
            />
          </Fragment>
        ))}
        {renderInventory(inventories[inventories.length - 1], false)}
        <FactoryIcon label="Customer" />
      </div>
    </section>
  );
}

export default ValueStreamMap;
