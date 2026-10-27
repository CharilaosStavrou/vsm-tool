import NumberInput from './NumberInput.jsx';

const kindLabels = {
  rawMaterial: 'Raw material',
  between: 'WIP',
  finishedGoods: 'Finished goods',
};

// Classic VSM inventory triangle with quantity and days of inventory.
function InventoryTriangle({ inventory, days, onQuantityChange }) {
  return (
    <div className="inventory">
      <span className="inventory-kind">{kindLabels[inventory.kind]}</span>
      <svg className="inventory-icon" viewBox="0 0 60 52" aria-hidden="true">
        <polygon points="30,2 58,50 2,50" />
        <text x="30" y="42" textAnchor="middle">I</text>
      </svg>
      <label className="inventory-quantity">
        <NumberInput
          value={inventory.quantity}
          label={`${kindLabels[inventory.kind]} quantity`}
          className="data-input"
          onChange={onQuantityChange}
        />
        <span className="data-unit">units</span>
      </label>
      <span className="inventory-days">{days.toFixed(1)} days</span>
    </div>
  );
}

export default InventoryTriangle;
