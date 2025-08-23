// src/OllamaChat.jsx
import React, { useState } from "react";
import "./OllamaChat.css";
import { generateWithOpenRouter } from "./services/openrouter";
import Header from "./components/OllamaChat/Header";
import ChatHistory from "./components/OllamaChat/ChatHistory";
import ResponsePanel from "./components/OllamaChat/ResponsePanel";
import PromptInput from "./components/OllamaChat/PromptInput";

export default function OllamaChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("mistralai/mistral-7b-instruct:free");
  const [chatHistory, setChatHistory] = useState([]);

  const availableModels = [
    "mistralai/mistral-7b-instruct:free",
    // adicione outros modelos se quiser
  ];

  const copyToClipboard = (t) =>
    navigator.clipboard.writeText(t).catch(() => {});

  const clearChat = () => {
    setPrompt("");
    setResponse("");
    setChatHistory([]);
  };

  // Converte seu chatHistory para messages para o OpenRouter
  const buildMessages = (history) => {
    return history.map((m) => {
      const role = m.type === "user" ? "user" : m.type === "assistant" ? "assistant" : "system";
      return { role, content: m.content };
    });
  };

  // limita histórico por turns (user+assistant)
  const truncateMessages = (msgs, maxTurns = 8) => {
    const maxMessages = Math.max(4, maxTurns * 2);
    if (msgs.length <= maxMessages) return msgs;
    return msgs.slice(msgs.length - maxMessages);
  };

  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    const current = prompt;
    setPrompt("");

    const userMsg = { type: "user", content: current, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMsg]);

    try {
      // montar mensagens com histórico
      const prevMsgs = buildMessages(chatHistory);
      const allMsgs = [...prevMsgs, { role: "user", content: current }];
      const truncated = truncateMessages(allMsgs, 8);

      // chama o serviço OpenRouter
      const json = await generateWithOpenRouter({
        model: selectedModel,
        messages: truncated
      });

      // interpretar o retorno (OpenRouter costuma retornar choices[0].message)
      let assistantText = "";
      if (json.choices?.[0]?.message?.content) {
        assistantText = json.choices[0].message.content;
      } else if (json.output) {
        // por segurança, tenta outras chaves
        assistantText = Array.isArray(json.output) ? json.output.join("\n") : String(json.output);
      } else {
        assistantText = JSON.stringify(json);
      }

      const assistantMsg = {
        type: "assistant",
        content: assistantText,
        timestamp: new Date(),
        model: selectedModel
      };
      setChatHistory(prev => [...prev, assistantMsg]);
      setResponse(assistantText);
    } catch (err) {
      console.error("Erro OpenRouter:", err);
      const errMsg = {
        type: "error",
        content: `Erro: ${err.message}`,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="oc-wrapper">
      <div className="oc-container">
        <Header
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          onClear={clearChat}
          models={availableModels}
        />

        <div className="oc-grid">
          <ChatHistory
            items={chatHistory}
            isLoading={isLoading}
            onCopy={copyToClipboard}
          />

          <div className="oc-col-right">
            <ResponsePanel
              text={response}
              isLoading={isLoading}
              onCopy={copyToClipboard}
            />
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSend={sendPrompt}
              disabled={isLoading}
              charCount={prompt.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
