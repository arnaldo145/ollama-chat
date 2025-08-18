import React from "react";

export default function ResponsePanel({ text, isLoading, onCopy }) {
  return (
    <section className="oc-card oc-grow">
      <div className="oc-card-head">
        <h3 className="oc-card-title">Última Resposta</h3>
        {text && (
          <button onClick={() => onCopy(text)} className="oc-btn oc-btn-ghost">📋 Copiar</button>
        )}
      </div>

      <div className="oc-panel">
        {isLoading ? (
          <div className="oc-panel-empty">
            <div className="oc-spinner" />
            <p className="oc-muted">Aguardando resposta...</p>
          </div>
        ) : text ? (
          <pre className="oc-panel-text">{text}</pre>
        ) : (
          <div className="oc-panel-empty">
            <div className="oc-panel-emoji">✨</div>
            <p className="oc-muted">A resposta aparecerá aqui</p>
          </div>
        )}
      </div>
    </section>
  );
}
