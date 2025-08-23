import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ResponsePanel({ text, isLoading, onCopy }) {
  return (
    <section className="oc-card">
      <div className="oc-card-head">
        <h3 className="oc-card-title">Última Resposta</h3>
        {text && (
          <button
            onClick={() => onCopy(text)}
            className="oc-btn oc-btn-ghost"
            aria-label="Copiar resposta"
          >
            📋 <span className="sr-only">Copiar</span>
          </button>
        )}
      </div>

      <div className="oc-panel">
        {isLoading ? (
          <div className="oc-panel-empty">
            <div className="oc-spinner" />
            <p className="oc-muted">Aguardando resposta...</p>
          </div>
        ) : text ? (
          <div className="oc-panel-text">
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
                code: ({ node, ...props }) => <code className="oc-markdown-code" {...props} />,
                pre: ({ node, ...props }) => <pre className="oc-markdown-pre" {...props} />,
                a: ({ node, children, ...props }) => (
                  <a
                    className="oc-markdown-a"
                    {...props}
                    aria-label={props.title || (typeof children === 'string' ? children : 'Link')}
                  >
                    {children || props.href}
                  </a>
                ),
                ul: ({ node, ...props }) => <ul className="oc-markdown-ul" {...props} />,
                ol: ({ node, ...props }) => <ol className="oc-markdown-ol" {...props} />,
                li: ({ node, ...props }) => <li className="oc-markdown-li" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="oc-markdown-blockquote" {...props} />,
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
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