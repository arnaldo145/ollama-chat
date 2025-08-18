import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatHistory({ items, isLoading, onCopy }) {
  const responseRef = useRef(null);
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [items, isLoading]);

  return (
    <section className="oc-card oc-col-left">
      <div className="oc-card-head">
        <h3 className="oc-card-title">Histórico do Chat</h3>
        <div className="oc-card-meta">{items.length > 0 && `${items.length} mensagens`}</div>
      </div>

      <div ref={responseRef} className="oc-chat-scroll">
        {items.length === 0 ? (
          <div className="oc-empty">
            <div className="oc-empty-emoji">💭</div>
            <p>Digite um prompt para começar a conversar</p>
          </div>
        ) : (
          items.map((msg, idx) => <MessageBubble key={idx} message={msg} onCopy={onCopy} />)
        )}

        {isLoading && (
          <div className="oc-row oc-row-start">
            <div className="oc-bubble oc-bubble-assistant">
              <div className="oc-loading">
                <div className="oc-dot" />
                <div className="oc-dot" />
                <div className="oc-dot" />
                <span className="oc-loading-text">Processando...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
