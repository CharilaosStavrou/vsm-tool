// Saving and loading maps: localStorage auto-save and JSON import validation.

const storageKey = 'vsm-tool:map';

// Returns the saved map, or null if there is none or it cannot be read.
export function loadSavedVsm() {
  try {
    const text = localStorage.getItem(storageKey);
    if (!text) return null;
    const data = JSON.parse(text);
    return isValidVsm(data) ? data : null;
  } catch {
    return null;
  }
}

// Saving can fail (private mode, storage full); the app keeps working without it.
export function saveVsm(vsm) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(vsm));
  } catch {
    // Ignore: auto-save is a convenience, not a requirement.
  }
}

// Parses an imported JSON file. Throws an Error with a user-facing message.
export function parseVsmJson(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('The file is not valid JSON.');
  }
  if (!isValidVsm(data)) {
    throw new Error('The file does not contain a valid value stream map.');
  }
  return data;
}

// Checks that the data has the shape and value ranges the editor expects.
export function isValidVsm(data) {
  if (!isObject(data) || !isObject(data.settings)) return false;
  const { settings, processes, inventories, rawMaterial, finishedGoods } = data;

  const isSettingsValid =
    typeof settings.productName === 'string' &&
    isNumberAtLeast(settings.customerDemandPerDay, 1) &&
    isNumberAtLeast(settings.availableTimePerShift, 1) &&
    isNumberAtLeast(settings.shiftsPerDay, 1);

  const isProcessesValid =
    Array.isArray(processes) &&
    processes.length > 0 &&
    processes.every(
      (process) =>
        isObject(process) &&
        typeof process.id === 'string' &&
        typeof process.name === 'string' &&
        ['cycleTime', 'changeoverTime', 'operators', 'shifts'].every((field) =>
          isNumberAtLeast(process[field], 0),
        ) &&
        isNumberAtLeast(process.uptime, 1) &&
        process.uptime <= 100,
    );

  const isInventoriesValid =
    Array.isArray(inventories) &&
    inventories.every(
      (inventory) =>
        isObject(inventory) &&
        typeof inventory.afterProcessId === 'string' &&
        isNumberAtLeast(inventory.quantity, 0),
    ) &&
    isObject(rawMaterial) &&
    isNumberAtLeast(rawMaterial.quantity, 0) &&
    isObject(finishedGoods) &&
    isNumberAtLeast(finishedGoods.quantity, 0);

  return isSettingsValid && isProcessesValid && isInventoriesValid;
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNumberAtLeast(value, min) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min;
}
