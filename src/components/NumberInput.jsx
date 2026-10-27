import { useState } from 'react';

// Numeric input that only reports valid values to its parent.
// While the typed text is invalid it is shown in red and the last
// valid value is kept; on blur the field reverts to that value.
function NumberInput({ value, onChange, min = 0, max, step = 1, label, className = '' }) {
  const [draft, setDraft] = useState(String(value));
  const [prevValue, setPrevValue] = useState(value);

  // Sync the draft when the value changes from outside (e.g. loading a map).
  if (value !== prevValue) {
    setPrevValue(value);
    setDraft(String(value));
  }

  const error = getError(draft, min, max);

  function handleChange(event) {
    const text = event.target.value;
    setDraft(text);
    if (!getError(text, min, max)) onChange(Number(text));
  }

  return (
    <input
      type="number"
      className={`number-input ${error ? 'is-invalid' : ''} ${className}`}
      value={draft}
      min={min}
      max={max}
      step={step}
      aria-label={label}
      aria-invalid={Boolean(error)}
      title={error || label}
      onChange={handleChange}
      onBlur={() => setDraft(String(value))}
    />
  );
}

function getError(text, min, max) {
  if (text.trim() === '' || Number.isNaN(Number(text))) return 'Enter a number';
  const number = Number(text);
  if (number < min) return min === 0 ? 'Must not be negative' : `Must be at least ${min}`;
  if (max !== undefined && number > max) return `Must be at most ${max}`;
  return '';
}

export default NumberInput;
