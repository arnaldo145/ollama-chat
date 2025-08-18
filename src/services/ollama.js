export async function generateWithOllama({ url, model, prompt }) {
  const body = { model, prompt, stream: false };
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
  return resp.json();
}