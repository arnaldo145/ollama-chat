import { useState } from "react";
import { generateWithOpenRouter } from "../services/openrouter";
import { buildMessages, truncateMessages } from "../utils/chatUtils";

// Nosso custom hook: encapsula toda a lógica de chat
export function useChat(initialModel) {
  // Estado do prompt atual digitado pelo usuário
  const [prompt, setPrompt] = useState("");

  // Última resposta recebida do modelo
  const [response, setResponse] = useState("");

  // Indica se estamos aguardando resposta da API
  const [isLoading, setIsLoading] = useState(false);

  // Modelo selecionado (vem do parâmetro initialModel)
  const [selectedModel, setSelectedModel] = useState(initialModel);

  // Histórico completo do chat (array de mensagens)
  const [chatHistory, setChatHistory] = useState([]);

  // Função para limpar o chat (zera todos os estados principais)
  const clearChat = () => {
    setPrompt("");
    setResponse("");
    setChatHistory([]);
  };

  // Função principal: envia o prompt para a API
  const sendPrompt = async () => {
    // Se o prompt estiver vazio (só espaços), não faz nada
    if (!prompt.trim()) return;

    // Marca como "carregando"
    setIsLoading(true);

    // Guarda o valor atual do prompt
    const current = prompt;

    // Limpa o campo de input (deixa pronto para o próximo texto)
    setPrompt("");

    // Cria objeto de mensagem do usuário
    const userMsg = { type: "user", content: current, timestamp: new Date() };

    // Atualiza o histórico adicionando a mensagem do usuário
    setChatHistory((prev) => [...prev, userMsg]);

    try {
      // Converte histórico interno para o formato aceito pelo OpenRouter
      const prevMsgs = buildMessages(chatHistory);

      // Junta mensagens antigas + a nova do usuário
      const allMsgs = [...prevMsgs, { role: "user", content: current }];

      // Limita a quantidade de mensagens enviadas (para não sobrecarregar a API)
      const truncated = truncateMessages(allMsgs);

      // Faz a chamada para a API do OpenRouter
      const json = await generateWithOpenRouter({ model: selectedModel, messages: truncated });

      // Interpreta o retorno da API
      // - primeiro tenta pegar choices[0].message.content
      // - se não existir, tenta pegar json.output
      // - se nada der certo, converte o JSON em string
      let assistantText =
        json.choices?.[0]?.message?.content ??
        (Array.isArray(json.output) ? json.output.join("\n") : String(json.output ?? JSON.stringify(json)));

      // Cria objeto de mensagem do assistente
      const assistantMsg = {
        type: "assistant",
        content: assistantText,
        timestamp: new Date(),
        model: selectedModel,
      };

      // Adiciona resposta do assistente no histórico
      setChatHistory((prev) => [...prev, assistantMsg]);

      // Atualiza o estado "response" (usado no painel de resposta)
      setResponse(assistantText);
    } catch (err) {
      // Se der erro na chamada, registra no console e adiciona no histórico
      console.error("Erro OpenRouter:", err);
      setChatHistory((prev) => [
        ...prev,
        { type: "error", content: `Erro: ${err.message}`, timestamp: new Date() },
      ]);
    } finally {
      // Ao final (com sucesso ou erro), marca isLoading como false
      setIsLoading(false);
    }
  };

  // 🔹 Retorna tudo que o componente pai precisa usar
  return {
    prompt,            // Texto atual do usuário
    setPrompt,         // Função para alterar o prompt
    response,          // Última resposta do modelo
    isLoading,         // Indica se está carregando
    selectedModel,     // Modelo escolhido
    setSelectedModel,  // Função para trocar modelo
    chatHistory,       // Histórico completo
    clearChat,         // Função para limpar chat
    sendPrompt,        // Função para enviar mensagem
  };
}
