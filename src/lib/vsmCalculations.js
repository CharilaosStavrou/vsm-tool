// Pure calculation functions for lean metrics.
// No React, no side effects: every function takes plain data and returns a value,
// so they can be unit tested in isolation.
//
// Units: times in seconds, inventory in units, lead time in days.

import { getOrderedInventories } from './vsmModel.js';

// Available time per day = available time per shift × shifts per day.
export function getAvailableTimePerDay(settings) {
  return settings.availableTimePerShift * settings.shiftsPerDay;
}

// Takt time = available time per day ÷ customer demand per day.
// The pace (seconds per unit) at which the line must produce to meet demand.
export function getTaktTime(settings) {
  if (settings.customerDemandPerDay <= 0) return 0;
  return getAvailableTimePerDay(settings) / settings.customerDemandPerDay;
}

// Effective cycle time = cycle time ÷ (uptime / 100).
// Spreads downtime over every unit, e.g. 60 s at 80 % uptime = 75 s per unit.
export function getEffectiveCycleTime(process) {
  if (process.uptime <= 0) return Infinity;
  return process.cycleTime / (process.uptime / 100);
}

// Days of inventory = quantity ÷ customer demand per day.
// How many days the stock would last if the customer kept pulling at demand rate.
export function getDaysOfInventory(quantity, customerDemandPerDay) {
  if (customerDemandPerDay <= 0) return 0;
  return quantity / customerDemandPerDay;
}

// Production lead time (days) = sum of the days of every inventory,
// including raw material and finished goods.
export function getLeadTimeDays(vsm) {
  return getOrderedInventories(vsm).reduce(
    (total, inventory) =>
      total + getDaysOfInventory(inventory.quantity, vsm.settings.customerDemandPerDay),
    0,
  );
}

// Value-added time (seconds) = sum of all process cycle times.
export function getValueAddedTime(processes) {
  return processes.reduce((total, process) => total + process.cycleTime, 0);
}

// Process cycle efficiency (%) = value-added time ÷ lead time × 100.
// Lead time is converted from days to seconds with the available (working)
// time per day, not 24 hours, so both times are measured in working time.
export function getProcessCycleEfficiency(valueAddedTime, leadTimeDays, availableTimePerDay) {
  const leadTimeSeconds = leadTimeDays * availableTimePerDay;
  if (leadTimeSeconds <= 0) return 0;
  return (valueAddedTime / leadTimeSeconds) * 100;
}

// Bottleneck = the process with the highest effective cycle time.
// Returns null for an empty line; on a tie the first (upstream) process wins.
export function getBottleneck(processes) {
  return processes.reduce(
    (slowest, process) =>
      !slowest || getEffectiveCycleTime(process) > getEffectiveCycleTime(slowest)
        ? process
        : slowest,
    null,
  );
}

// Processes whose effective cycle time is greater than takt time
// cannot keep up with customer demand.
export function getProcessesAboveTakt(processes, taktTime) {
  return processes.filter((process) => getEffectiveCycleTime(process) > taktTime);
}

// All metrics for the metrics panel and the map highlights in one object.
export function calculateMetrics(vsm) {
  const { settings, processes } = vsm;
  const availableTimePerDay = getAvailableTimePerDay(settings);
  const taktTime = getTaktTime(settings);
  const leadTimeDays = getLeadTimeDays(vsm);
  const valueAddedTime = getValueAddedTime(processes);

  return {
    availableTimePerDay,
    taktTime,
    leadTimeDays,
    valueAddedTime,
    processCycleEfficiency: getProcessCycleEfficiency(
      valueAddedTime,
      leadTimeDays,
      availableTimePerDay,
    ),
    bottleneck: getBottleneck(processes),
    aboveTaktIds: getProcessesAboveTakt(processes, taktTime).map((process) => process.id),
  };
}
