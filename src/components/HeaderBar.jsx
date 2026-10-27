import NumberInput from './NumberInput.jsx';

const numberFields = [
  { field: 'customerDemandPerDay', label: 'Demand', unit: 'units/day', min: 1 },
  { field: 'availableTimePerShift', label: 'Available time', unit: 's/shift', min: 1 },
  { field: 'shiftsPerDay', label: 'Shifts', unit: 'per day', min: 1 },
];

function HeaderBar({ settings, onSettingChange }) {
  return (
    <header className="header-bar">
      <h1 className="app-name">VSM Tool</h1>
      <div className="settings">
        <label className="setting">
          <span className="setting-label">Product</span>
          <input
            type="text"
            className="text-input"
            value={settings.productName}
            onChange={(event) => onSettingChange('productName', event.target.value)}
          />
        </label>
        {numberFields.map(({ field, label, unit, min }) => (
          <label key={field} className="setting">
            <span className="setting-label">{label}</span>
            <NumberInput
              value={settings[field]}
              min={min}
              label={label}
              onChange={(value) => onSettingChange(field, value)}
            />
            <span className="setting-unit">{unit}</span>
          </label>
        ))}
      </div>
    </header>
  );
}

export default HeaderBar;
