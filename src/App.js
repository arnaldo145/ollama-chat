import "./OllamaChat.css";
import { useChat } from "./hooks/useChat";
import { availableModels } from "./utils/chatUtils";

import Header from "./components/OllamaChat/Header";
import ChatHistory from "./components/OllamaChat/ChatHistory";
import ResponsePanel from "./components/OllamaChat/ResponsePanel";
import PromptInput from "./components/OllamaChat/PromptInput";

// Componente principal da aplicação de chat
export default function OllamaChat() {
  // Hook customizado que já retorna todos os estados e funções do chat
  const {
    prompt,           // texto atual digitado pelo usuário
    setPrompt,        // função para atualizar o prompt
    response,         // última resposta recebida do modelo
    isLoading,        // indica se está carregando
    selectedModel,    // modelo escolhido
    setSelectedModel, // função para trocar modelo
    chatHistory,      // histórico de mensagens
    clearChat,        // função para limpar o chat
    sendPrompt,       // função para enviar mensagem
  } = useChat("mistralai/mistral-7b-instruct:free"); // modelo padrão inicial

  // Função auxiliar para copiar texto para o clipboard
  const copyToClipboard = (text) =>
    navigator.clipboard.writeText(text).catch(() => {});

  return (
    <div className="oc-wrapper">
      <div className="oc-container">
        {/* Cabeçalho com seleção de modelo e botão de limpar */}
        <Header
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          onClear={clearChat}
          models={availableModels}
        />

        <div className="oc-grid">
          {/* Histórico de mensagens do chat */}
          <ChatHistory
            items={chatHistory}
            isLoading={isLoading}
            onCopy={copyToClipboard}
          />

          <div className="oc-col-right">
            {/* Painel que mostra a última resposta */}
            <ResponsePanel
              text={response}
              isLoading={isLoading}
              onCopy={copyToClipboard}
            />

            {/* Input de prompt (campo de digitação do usuário) */}
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSend={sendPrompt}
              disabled={isLoading}
              charCount={prompt.length} // contador de caracteres
            />
          </div>
        </div>
      </div>
    </div>
  );
}
