import { useEffect, useRef, useState } from 'react';
import { sampleVsm } from './data/sampleVsm.js';
import { createEmptyVsm } from './lib/vsmModel.js';
import {
  addProcess,
  deleteProcess,
  moveProcess,
  updateInventoryQuantity,
  updateProcess,
  updateSettings,
} from './lib/vsmActions.js';
import { calculateMetrics } from './lib/vsmCalculations.js';
import { loadSavedVsm, parseVsmJson, saveVsm } from './lib/vsmStorage.js';
import { downloadJson, downloadPng, getFileBaseName } from './lib/fileExport.js';
import CycleTimeChart from './components/CycleTimeChart.jsx';
import HeaderBar from './components/HeaderBar.jsx';
import MetricsPanel from './components/MetricsPanel.jsx';
import Toolbar from './components/Toolbar.jsx';
import ValueStreamMap from './components/ValueStreamMap.jsx';

function App() {
  const [vsm, setVsm] = useState(() => loadSavedVsm() ?? sampleVsm);
  const metricsRef = useRef(null);
  const canvasRef = useRef(null);
  const metrics = calculateMetrics(vsm);
  const fileBaseName = getFileBaseName(vsm.settings.productName);

  // Auto-save every change.
  useEffect(() => saveVsm(vsm), [vsm]);

  function replaceMap(nextVsm) {
    if (window.confirm('Replace the current map? Unsaved changes will be lost.')) setVsm(nextVsm);
  }

  async function handleImportJson(file) {
    try {
      replaceMap(parseVsmJson(await file.text()));
    } catch (error) {
      window.alert(`Could not import "${file.name}": ${error.message}`);
    }
  }

  async function handleExportPng() {
    try {
      await downloadPng([metricsRef.current, canvasRef.current], `${fileBaseName}.png`);
    } catch {
      window.alert('Could not export the PNG image.');
    }
  }

  return (
    <div className="app">
      <HeaderBar
        settings={vsm.settings}
        onSettingChange={(field, value) => setVsm((current) => updateSettings(current, field, value))}
      />
      <main className="app-main">
        <Toolbar
          onAddProcess={() => setVsm(addProcess)}
          onLoadSample={() => replaceMap(sampleVsm)}
          onNewMap={() => replaceMap(createEmptyVsm())}
          onExportJson={() => downloadJson(vsm, `${fileBaseName}.json`)}
          onImportJson={handleImportJson}
          onExportPng={handleExportPng}
        />
        <MetricsPanel metrics={metrics} panelRef={metricsRef} />
        <ValueStreamMap
          vsm={vsm}
          metrics={metrics}
          canvasRef={canvasRef}
          onProcessChange={(id, field, value) =>
            setVsm((current) => updateProcess(current, id, field, value))
          }
          onMoveProcess={(id, direction) => setVsm((current) => moveProcess(current, id, direction))}
          onDeleteProcess={(id) => setVsm((current) => deleteProcess(current, id))}
          onInventoryChange={(inventory, quantity) =>
            setVsm((current) => updateInventoryQuantity(current, inventory, quantity))
          }
        />
        <CycleTimeChart processes={vsm.processes} metrics={metrics} />
      </main>
    </div>
  );
}

export default App;
