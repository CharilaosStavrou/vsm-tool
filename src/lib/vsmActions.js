// Pure state updates for the map editor.
// Each function takes the current map and returns a new one (no mutation).

import { createInventory, createProcess } from './vsmModel.js';

export function updateSettings(vsm, field, value) {
  return { ...vsm, settings: { ...vsm.settings, [field]: value } };
}

export function updateProcess(vsm, processId, field, value) {
  return {
    ...vsm,
    processes: vsm.processes.map((process) =>
      process.id === processId ? { ...process, [field]: value } : process,
    ),
  };
}

export function addProcess(vsm) {
  const process = createProcess(`Process ${vsm.processes.length + 1}`);
  return {
    ...vsm,
    processes: [...vsm.processes, process],
    inventories: [...vsm.inventories, createInventory(process.id)],
  };
}

// A map always keeps at least one process.
export function deleteProcess(vsm, processId) {
  if (vsm.processes.length <= 1) return vsm;
  return {
    ...vsm,
    processes: vsm.processes.filter((process) => process.id !== processId),
    inventories: vsm.inventories.filter((inv) => inv.afterProcessId !== processId),
  };
}

// direction: -1 moves the process left, +1 moves it right.
// The inventory after a process moves together with it.
export function moveProcess(vsm, processId, direction) {
  const index = vsm.processes.findIndex((process) => process.id === processId);
  const targetIndex = index + direction;
  if (index < 0 || targetIndex < 0 || targetIndex >= vsm.processes.length) return vsm;

  const processes = [...vsm.processes];
  [processes[index], processes[targetIndex]] = [processes[targetIndex], processes[index]];
  return { ...vsm, processes };
}

// `inventory` is an entry from getOrderedInventories().
export function updateInventoryQuantity(vsm, inventory, quantity) {
  if (inventory.kind === 'rawMaterial') return { ...vsm, rawMaterial: { quantity } };
  if (inventory.kind === 'finishedGoods') return { ...vsm, finishedGoods: { quantity } };

  const exists = vsm.inventories.some((inv) => inv.afterProcessId === inventory.afterProcessId);
  const inventories = exists
    ? vsm.inventories.map((inv) =>
        inv.afterProcessId === inventory.afterProcessId ? { ...inv, quantity } : inv,
      )
    : [...vsm.inventories, createInventory(inventory.afterProcessId, quantity)];
  return { ...vsm, inventories };
}
