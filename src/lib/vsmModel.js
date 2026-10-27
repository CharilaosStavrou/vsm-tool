// Data model for a Value Stream Map.
//
// A map has:
//   settings       – product and customer demand information
//   processes      – ordered left to right (array order = flow order)
//   rawMaterial    – inventory before the first process
//   inventories    – buffers between processes, linked by afterProcessId
//   finishedGoods  – inventory after the last process

export function createId(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function createSettings() {
  return {
    productName: 'New product',
    customerDemandPerDay: 100, // units/day
    availableTimePerShift: 27000, // seconds (7.5 h)
    shiftsPerDay: 1,
  };
}

export function createProcess(name = 'New process') {
  return {
    id: createId('p'),
    name,
    cycleTime: 60, // seconds
    changeoverTime: 0, // minutes
    uptime: 100, // %
    operators: 1,
    shifts: 1,
  };
}

export function createInventory(afterProcessId, quantity = 0) {
  return { id: createId('i'), afterProcessId, quantity };
}

export function createEmptyVsm() {
  const firstProcess = createProcess('Process 1');
  return {
    settings: createSettings(),
    processes: [firstProcess],
    rawMaterial: { quantity: 0 },
    inventories: [createInventory(firstProcess.id)],
    finishedGoods: { quantity: 0 },
  };
}

// Returns the inventories in flow order, left to right:
// raw material, the buffer after each process except the last, finished goods.
// Every entry has a `kind` so the UI and calculations can tell them apart.
export function getOrderedInventories(vsm) {
  const { processes, inventories, rawMaterial, finishedGoods } = vsm;
  const betweenProcesses = processes.slice(0, -1).map((process) => {
    const inventory = inventories.find((inv) => inv.afterProcessId === process.id);
    return {
      kind: 'between',
      id: inventory?.id ?? `missing-${process.id}`,
      afterProcessId: process.id,
      quantity: inventory?.quantity ?? 0,
    };
  });

  return [
    { kind: 'rawMaterial', id: 'rawMaterial', quantity: rawMaterial.quantity },
    ...betweenProcesses,
    { kind: 'finishedGoods', id: 'finishedGoods', quantity: finishedGoods.quantity },
  ];
}
