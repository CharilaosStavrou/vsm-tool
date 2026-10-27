import { useState } from 'react';
import { sampleVsm } from './data/sampleVsm.js';
import {
  addProcess,
  deleteProcess,
  moveProcess,
  updateInventoryQuantity,
  updateProcess,
  updateSettings,
} from './lib/vsmActions.js';
import { calculateMetrics } from './lib/vsmCalculations.js';
import HeaderBar from './components/HeaderBar.jsx';
import MetricsPanel from './components/MetricsPanel.jsx';
import ValueStreamMap from './components/ValueStreamMap.jsx';

function App() {
  const [vsm, setVsm] = useState(sampleVsm);
  const metrics = calculateMetrics(vsm);

  return (
    <div className="app">
      <HeaderBar
        settings={vsm.settings}
        onSettingChange={(field, value) => setVsm((current) => updateSettings(current, field, value))}
      />
      <main className="app-main">
        <div className="toolbar">
          <button type="button" className="button-primary" onClick={() => setVsm(addProcess)}>
            + Add process
          </button>
        </div>
        <MetricsPanel metrics={metrics} />
        <ValueStreamMap
          vsm={vsm}
          metrics={metrics}
          onProcessChange={(id, field, value) =>
            setVsm((current) => updateProcess(current, id, field, value))
          }
          onMoveProcess={(id, direction) => setVsm((current) => moveProcess(current, id, direction))}
          onDeleteProcess={(id) => setVsm((current) => deleteProcess(current, id))}
          onInventoryChange={(inventory, quantity) =>
            setVsm((current) => updateInventoryQuantity(current, inventory, quantity))
          }
        />
      </main>
    </div>
  );
}

export default App;
