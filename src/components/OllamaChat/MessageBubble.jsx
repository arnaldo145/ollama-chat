import React from "react";
import { formatTimestamp } from "../../utils/format.js";

export default function MessageBubble({ message, onCopy }) {
  const type = message.type;
  const bubbleClass =
    "oc-bubble " +
    (type === "user" ? "oc-bubble-user" : type === "error" ? "oc-bubble-error" : "oc-bubble-assistant");

  return (
    <div className={"oc-row " + (type === "user" ? "oc-row-end" : "oc-row-start")}>
      <div className={bubbleClass}>
        <div className="oc-bubble-top">
          <div className="oc-bubble-meta">
            <span>{type === "user" ? "👤 Você" : type === "error" ? "⚠️ Erro" : "🤖 Assistant"}</span>
            {message.model && <span> • {message.model}</span>}
            <span> • {formatTimestamp(message.timestamp)}</span>
          </div>
          {type !== "user" && (
            <button onClick={() => onCopy(message.content)} className="oc-icon-btn" title="Copiar resposta">📋</button>
          )}
        </div>
        <pre className="oc-bubble-text">{message.content}</pre>
      </div>
    </div>
  );
}
