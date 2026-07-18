// proxy helper for Claude AI chat via Cloudflare Workers

export async function sendAIChatMessage(prompt, options = {}) {
  return {
    ok: true,
    message: 'Claude chat proxy placeholder',
    prompt,
    options,
  };
}
