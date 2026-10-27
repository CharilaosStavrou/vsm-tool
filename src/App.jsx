import { useState } from 'react';
import { sampleVsm } from './data/sampleVsm.js';
import { getOrderedInventories } from './lib/vsmModel.js';

// Phase 1 placeholder: shows that the data model loads.
// The map editor replaces this in Phase 2.
function App() {
  const [vsm] = useState(sampleVsm);

  return (
    <main className="app">
      <h1>VSM Tool</h1>
      <p>
        {vsm.settings.productName}: {vsm.processes.length} processes,{' '}
        {getOrderedInventories(vsm).length} inventories
      </p>
    </main>
  );
}

export default App;
