import React from "react";

export default function PromptInput({ value, disabled, charCount, onChange, onSend }) {
  const onKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <section className="oc-card">
      <h3 className="oc-card-title">Digite seu prompt</h3>
      <div className="oc-stack">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Digite seu prompt aqui... (Ctrl+Enter para enviar)"
          className="oc-textarea"
          disabled={disabled}
        />
        <div className="oc-bar">
          <div className="oc-meta">
            <span>Ctrl+Enter para enviar</span>
            {value && <span> • {charCount} caracteres</span>}
          </div>
          <button onClick={onSend} disabled={disabled || !value.trim()} className="oc-btn oc-btn-primary">
            {disabled ? (<><span className="oc-btn-spinner"/> Enviando...</>) : (<>Enviar <span className="oc-btn-emoji">🚀</span></>)}
          </button>
        </div>
      </div>
    </section>
  );
}
