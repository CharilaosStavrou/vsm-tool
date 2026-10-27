import { describe, expect, it } from 'vitest';
import { sampleVsm } from '../data/sampleVsm.js';
import {
  calculateMetrics,
  getAvailableTimePerDay,
  getBottleneck,
  getDaysOfInventory,
  getEffectiveCycleTime,
  getLeadTimeDays,
  getProcessCycleEfficiency,
  getProcessesAboveTakt,
  getTaktTime,
  getValueAddedTime,
} from './vsmCalculations.js';

const { settings, processes } = sampleVsm;
const findProcess = (name) => processes.find((process) => process.name === name);

describe('time and takt', () => {
  it('multiplies available time per shift by shifts per day', () => {
    expect(getAvailableTimePerDay(settings)).toBe(55200); // 27 600 s × 2
  });

  it('calculates takt time as available time ÷ demand', () => {
    expect(getTaktTime(settings)).toBe(120); // 55 200 s ÷ 460 units
  });

  it('returns 0 takt time when demand is 0', () => {
    expect(getTaktTime({ ...settings, customerDemandPerDay: 0 })).toBe(0);
  });
});

describe('effective cycle time', () => {
  it('divides cycle time by uptime', () => {
    expect(getEffectiveCycleTime(findProcess('Welding'))).toBeCloseTo(137.5); // 110 ÷ 0.80
  });

  it('equals cycle time at 100 % uptime', () => {
    expect(getEffectiveCycleTime({ cycleTime: 45, uptime: 100 })).toBe(45);
  });
});

describe('inventory and lead time', () => {
  it('converts quantity to days of demand', () => {
    expect(getDaysOfInventory(4600, 460)).toBe(10);
  });

  it('sums all inventories, including raw material and finished goods', () => {
    // (4600 + 1100 + 1600 + 850 + 600 + 1800) ÷ 460 = 10 550 ÷ 460
    expect(getLeadTimeDays(sampleVsm)).toBeCloseTo(22.935, 3);
  });
});

describe('value-added time and PCE', () => {
  it('sums the process cycle times', () => {
    expect(getValueAddedTime(processes)).toBe(378); // 40 + 60 + 110 + 118 + 50
  });

  it('converts lead time to seconds with the available time per day', () => {
    // 378 s ÷ (10 550 / 460 days × 55 200 s/day) = 378 ÷ 1 266 000
    const pce = getProcessCycleEfficiency(378, 10550 / 460, 55200);
    expect(pce).toBeCloseTo(0.02986, 5);
  });

  it('returns 0 when lead time is 0', () => {
    expect(getProcessCycleEfficiency(378, 0, 55200)).toBe(0);
  });
});

describe('bottleneck and takt check', () => {
  it('finds the process with the highest effective cycle time', () => {
    expect(getBottleneck(processes).name).toBe('Welding');
  });

  it('returns null for an empty line', () => {
    expect(getBottleneck([])).toBeNull();
  });

  it('flags every process slower than takt time', () => {
    const names = getProcessesAboveTakt(processes, 120).map((process) => process.name);
    expect(names).toEqual(['Welding', 'Assembly']);
  });
});

describe('calculateMetrics', () => {
  it('combines all metrics for the sample map', () => {
    const metrics = calculateMetrics(sampleVsm);
    expect(metrics.taktTime).toBe(120);
    expect(metrics.valueAddedTime).toBe(378);
    expect(metrics.leadTimeDays).toBeCloseTo(22.935, 3);
    expect(metrics.processCycleEfficiency).toBeCloseTo(0.02986, 5);
    expect(metrics.bottleneck.id).toBe('p-welding');
    expect(metrics.aboveTaktIds).toEqual(['p-welding', 'p-assembly']);
  });
});
