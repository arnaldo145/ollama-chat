// 🔹 URL base da API do OpenRouter
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Função que envia mensagens para a API do OpenRouter e retorna a resposta
 *
 * @param {Object} options - Configurações da chamada
 * @param {string} options.model - Modelo principal a ser usado
 * @param {Array} options.messages - Histórico de mensagens no formato [{role, content}]
 * @param {number} options.maxRetries - Número máximo de tentativas em caso de erro (ex: 429 Too Many Requests)
 * @param {Array} options.fallbackModels - Lista de modelos alternativos caso o principal falhe
 */
export async function generateWithOpenRouter({
  model = "mistralai/mistral-7b-instruct:free",
  messages = [],
  maxRetries = 3,
  fallbackModels = [
    "mistralai/mistral-7b-instruct:free",
    "deepseek/deepseek-r1-0528-qwen3-8b:free",
  ],
} = {}) {
  // 🔹 Validação básica: precisa ter pelo menos 1 mensagem
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("messages deve ser um array não-vazio");
  }

  // 🔹 Recupera a API key do .env.local
  const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("REACT_APP_OPENROUTER_API_KEY não definida no .env.local");
  }

  // 🔹 Cabeçalhos padrão para todas as requisições
  const headersBase = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  /**
   * Função que faz uma chamada única para um modelo específico
   * - Implementa retries com backoff exponencial em caso de erro 429
   *
   * @param {string} mdl - Nome do modelo a ser usado
   * @param {number} attempt - Número da tentativa atual
   */
  const callOnce = async (mdl, attempt) => {
    const body = { model: mdl, messages };

    const resp = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: headersBase,
      body: JSON.stringify(body),
    });

    // 🔹 Se a API retornar "Too Many Requests" (429), aguarda e tenta de novo
    if (resp.status === 429 && attempt < maxRetries) {
      const waitMs = 1000 * Math.pow(2, attempt); // backoff exponencial: 1s, 2s, 4s...
      await new Promise((r) => setTimeout(r, waitMs));

      // Marca o erro como "retriável"
      const err = new Error("RETRY");
      err._retry = true;
      throw err;
    }

    // 🔹 Se a resposta não for OK, lança erro com detalhes
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`HTTP ${resp.status} - ${txt}`);
    }

    // 🔹 Retorna JSON com a resposta válida
    return resp.json();
  };

  // =====================================================
  // 1) Tenta o modelo principal com até "maxRetries" tentativas
  // =====================================================
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const json = await callOnce(model, attempt);
      return json; // sucesso → retorna resultado
    } catch (e) {
      if (e && e._retry) {
        attempt++; // incrementa tentativas se for erro 429
        continue;
      }
      break; // erro não-retriável → sai do loop
    }
  }

  // =====================================================
  // 2) Se o modelo principal falhar, tenta fallback models
  // =====================================================
  for (const fb of fallbackModels) {
    attempt = 0;
    while (attempt <= maxRetries) {
      try {
        const json = await callOnce(fb, attempt);
        return json; // sucesso com fallback
      } catch (e) {
        if (e && e._retry) {
          attempt++; // tenta novamente em caso de 429
          continue;
        }
        break; // falhou sem retry → passa para próximo fallback
      }
    }
  }

  // =====================================================
  // 3) Se nenhum modelo funcionou, lança erro final
  // =====================================================
  throw new Error("Sem sucesso após retries e fallbacks.");
}
