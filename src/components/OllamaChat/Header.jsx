import React from "react";

export default function Header({ selectedModel, onModelChange, onClear, models }) {
  return (
    <header className="oc-card oc-header">
      <div className="oc-header-left">
        <div className="oc-logo">
          <span className="oc-logo-emoji">🤖</span>
        </div>
        <div className="oc-title-wrap">
          <h1 className="oc-title">Ollama Chat</h1>
          <p className="oc-subtitle">Powered by {selectedModel}</p>
        </div>
      </div>

      <div className="oc-header-right">
        <label htmlFor="model" className="oc-label">Modelo:</label>
        <select
          id="model"
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="oc-select"
        >
          {models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <button onClick={onClear} className="oc-btn oc-btn-danger" title="Limpar chat">
          <span className="oc-btn-emoji" aria-hidden>🗑️</span>
          <span className="oc-btn-text">Limpar</span>
        </button>
      </div>
    </header>
  );
}
