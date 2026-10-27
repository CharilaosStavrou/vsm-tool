// Small SVG symbols used on the map.

// Factory icon (sawtooth roof) used for supplier and customer.
export function FactoryIcon({ label }) {
  return (
    <div className="external">
      <svg className="factory-icon" viewBox="0 0 80 56" aria-hidden="true">
        <polygon points="2,54 2,20 22,6 22,20 42,6 42,20 62,6 62,2 78,2 78,54" />
      </svg>
      <span className="external-label">{label}</span>
    </div>
  );
}

// Push arrow: the striped arrow used between push processes.
export function PushArrow() {
  return (
    <svg className="push-arrow" viewBox="0 0 80 24" aria-label="Push">
      <polygon points="0,6 60,6 60,0 80,12 60,24 60,18 0,18" />
      {[8, 20, 32, 44].map((x) => (
        <rect key={x} x={x} y="6" width="6" height="12" className="push-stripe" />
      ))}
    </svg>
  );
}
