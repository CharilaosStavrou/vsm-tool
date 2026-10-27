// Number formatting for display, e.g. formatNumber(1234.567, 1) → "1,234.6".
export function formatNumber(value, maxDecimals = 1) {
  if (!Number.isFinite(value)) return '–';
  return value.toLocaleString('en-US', { maximumFractionDigits: maxDecimals });
}
