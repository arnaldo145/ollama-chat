export const availableModels = [
  "mistralai/mistral-7b-instruct:free",
  "deepseek/deepseek-r1-0528-qwen3-8b:free",
];

export const buildMessages = (history) =>
  history.map((m) => ({
    role: m.type === "user" ? "user" : m.type === "assistant" ? "assistant" : "system",
    content: m.content,
  }));

export const truncateMessages = (msgs, maxTurns = 8) => {
  const maxMessages = Math.max(4, maxTurns * 2);
  return msgs.length <= maxMessages ? msgs : msgs.slice(-maxMessages);
};
