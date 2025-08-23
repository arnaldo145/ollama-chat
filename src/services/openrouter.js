const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function generateWithOpenRouter({
  model = "mistralai/mistral-7b-instruct:free",
  messages = [], // array de { role: "user"|"assistant"|"system", content: string }
  maxRetries = 3,
  fallbackModels = [
    "mistralai/mistral-7b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free",
  ],
} = {}) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("messages deve ser um array não-vazio");
  }

  const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("REACT_APP_OPENROUTER_API_KEY não definida no .env.local");
  }

  const headersBase = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const callOnce = async (mdl, attempt) => {
    const body = {
      model: mdl,
      messages: messages,
    };

    const resp = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: headersBase,
      body: JSON.stringify(body),
    });

    if (resp.status === 429 && attempt < maxRetries) {
      // backoff exponencial: 1s,2s,4s...
      const waitMs = 1000 * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, waitMs));
      const err = new Error("RETRY");
      err._retry = true;
      throw err;
    }

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`HTTP ${resp.status} - ${txt}`);
    }

    return resp.json();
  };

  // tenta modelo principal com retries
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const json = await callOnce(model, attempt);
      return json;
    } catch (e) {
      if (e && e._retry) {
        attempt++;
        continue;
      }
      break;
    }
  }

  // fallbacks
  for (const fb of fallbackModels) {
    attempt = 0;
    while (attempt <= maxRetries) {
      try {
        const json = await callOnce(fb, attempt);
        return json;
      } catch (e) {
        if (e && e._retry) {
          attempt++;
          continue;
        }
        break;
      }
    }
  }

  throw new Error("Sem sucesso após retries e fallbacks.");
}
