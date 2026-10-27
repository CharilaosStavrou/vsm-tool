// Sample value stream: a sheet-metal bracket line with five processes.
// Takt time = (27 600 s × 2 shifts) / 460 units = 120 s/unit.
// Welding is the bottleneck (effective C/T 137.5 s) and Assembly
// also exceeds takt (effective C/T ≈ 122.9 s).

export const sampleVsm = {
  settings: {
    productName: 'Steel bracket SB-200',
    customerDemandPerDay: 460, // units/day
    availableTimePerShift: 27600, // seconds (8 h minus 20 min of breaks)
    shiftsPerDay: 2,
  },
  processes: [
    { id: 'p-cutting', name: 'Cutting', cycleTime: 40, changeoverTime: 30, uptime: 95, operators: 1, shifts: 2 },
    { id: 'p-stamping', name: 'Stamping', cycleTime: 60, changeoverTime: 60, uptime: 85, operators: 1, shifts: 2 },
    { id: 'p-welding', name: 'Welding', cycleTime: 110, changeoverTime: 10, uptime: 80, operators: 2, shifts: 2 },
    { id: 'p-assembly', name: 'Assembly', cycleTime: 118, changeoverTime: 0, uptime: 96, operators: 3, shifts: 2 },
    { id: 'p-packing', name: 'Packing', cycleTime: 50, changeoverTime: 0, uptime: 99, operators: 1, shifts: 2 },
  ],
  rawMaterial: { quantity: 4600 }, // units
  inventories: [
    { id: 'i-cutting', afterProcessId: 'p-cutting', quantity: 1100 },
    { id: 'i-stamping', afterProcessId: 'p-stamping', quantity: 1600 },
    { id: 'i-welding', afterProcessId: 'p-welding', quantity: 850 },
    { id: 'i-assembly', afterProcessId: 'p-assembly', quantity: 600 },
  ],
  finishedGoods: { quantity: 1800 }, // units
};
