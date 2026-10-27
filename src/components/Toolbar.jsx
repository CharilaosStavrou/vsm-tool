import { useRef } from 'react';

function Toolbar({ onAddProcess, onLoadSample, onNewMap, onExportJson, onImportJson, onExportPng }) {
  const fileInputRef = useRef(null);

  function handleFileChange(event) {
    const file = event.target.files[0];
    // Reset so choosing the same file again still triggers a change.
    event.target.value = '';
    if (file) onImportJson(file);
  }

  return (
    <div className="toolbar">
      <button type="button" className="button-primary" onClick={onAddProcess}>
        + Add process
      </button>
      <div className="toolbar-group">
        <button type="button" onClick={onLoadSample}>Load sample</button>
        <button type="button" onClick={onNewMap}>New map</button>
        <button type="button" onClick={onExportJson}>Export JSON</button>
        <button type="button" onClick={() => fileInputRef.current.click()}>Import JSON</button>
        <button type="button" onClick={onExportPng}>Export PNG</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default Toolbar;
