import React, { useState } from "react";
import "./OllamaChat.css";
import { generateWithOllama } from "./services/ollama";
import Header from "./components/OllamaChat/Header";
import ChatHistory from "./components/OllamaChat/ChatHistory";
import ResponsePanel from "./components/OllamaChat/ResponsePanel";
import PromptInput from "./components/OllamaChat/PromptInput";

// Container
export default function OllamaChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("qwen2:1.5b");
  const [chatHistory, setChatHistory] = useState([]);

  const availableModels = [
    "qwen2:1.5b",
    "tinyllama",
    "llama3.2:1b",
    "llama3.2:3b",
    "gemma:2b",
    "phi3:3.8b-mini-4k-instruct-q4_0",
    "deepseek-coder",
  ];

  const ollamaUrl = process.env.REACT_APP_OLLAMA_API_URL;

  const copyToClipboard = (t) =>
    navigator.clipboard.writeText(t).catch(() => {});

  const clearChat = () => {
    setPrompt("");
    setResponse("");
    setChatHistory([]);
  };

  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    const currentPrompt = prompt;
    setPrompt("");

    const userMsg = {
      type: "user",
      content: currentPrompt,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const data = await generateWithOllama({
        url: ollamaUrl,
        model: selectedModel,
        prompt: currentPrompt,
      });
      const assistantMsg = {
        type: "assistant",
        content: data.response,
        timestamp: new Date(),
        model: selectedModel,
      };
      setChatHistory((prev) => [...prev, assistantMsg]);
      setResponse(data.response);
    } catch (error) {
      console.error("Erro ao comunicar com Ollama:", error);
      const errMsg = {
        type: "error",
        content: `Erro: ${error.message}. Verifique se o Ollama está rodando em http://localhost:11434 com CORS configurado.`,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errMsg]);
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
