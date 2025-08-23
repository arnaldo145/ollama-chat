import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatTimestamp } from "../../utils/format.js";

export default function MessageBubble({ message, onCopy }) {
  const type = message.type;
  const bubbleClass =
    "oc-bubble " +
    (type === "user"
      ? "oc-bubble-user"
      : type === "error"
        ? "oc-bubble-error"
        : "oc-bubble-assistant");

  return (
    <div className={"oc-row " + (type === "user" ? "oc-row-end" : "oc-row-start")}>
      <div className={bubbleClass}>
        <div className="oc-bubble-top">
          <div className="oc-bubble-meta">
            <span>
              {type === "user" ? "👤 Você" : type === "error" ? "⚠️ Erro" : "🤖 Assistant"}
            </span>
            {message.model && <span> • {message.model}</span>}
            <span> • {formatTimestamp(message.timestamp)}</span>
          </div>
          {type !== "user" && (
            <button
              onClick={() => onCopy(message.content)}
              className="oc-icon-btn"
              title="Copiar resposta"
            >
              📋
            </button>
          )}
        </div>

        <div className="oc-bubble-text">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => <p className="oc-markdown-p" {...props} />,
              h1: ({ node, children, ...props }) => (
                <h1 className="oc-markdown-h1" {...props}>
                  {children || <span className="sr-only">Título sem texto</span>}
                </h1>
              ),
              h2: ({ node, children, ...props }) => (
                <h2 className="oc-markdown-h2" {...props}>
                  {children || <span className="sr-only">Subtítulo sem texto</span>}
                </h2>
              ),
              h3: ({ node, children, ...props }) => (
                <h3 className="oc-markdown-h3" {...props}>
                  {children || <span className="sr-only">Seção sem texto</span>}
                </h3>
              ),
              code: ({ node, ...props }) => (
                <code className="oc-markdown-code" {...props} />
              ),
              pre: ({ node, ...props }) => (
                <pre className="oc-markdown-pre" {...props} />
              ),
              a: ({ node, children, ...props }) => (
                <a
                  className="oc-markdown-a"
                  {...props}
                  aria-label={
                    props.title ||
                    (typeof children === "string" ? children : "Link")
                  }
                >
                  {children || props.href}
                </a>
              ),
              ul: ({ node, ...props }) => <ul className="oc-markdown-ul" {...props} />,
              ol: ({ node, ...props }) => <ol className="oc-markdown-ol" {...props} />,
              li: ({ node, ...props }) => <li className="oc-markdown-li" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="oc-markdown-blockquote" {...props} />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
