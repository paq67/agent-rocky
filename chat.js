require('dotenv').config()
const { ZEN_ENDPOINT, GROQ_ENDPOINT, MODELS, SYSTEM_PROMPT } = require('./config')

async function sendToRocky(userMessage, history, selectedModel) {
  const cfg = MODELS[selectedModel] || MODELS['big-pickle']
  const endpoint = cfg.provider === 'zen' ? ZEN_ENDPOINT : GROQ_ENDPOINT
  const apiKey   = cfg.provider === 'zen'
    ? process.env.OPENCODE_API_KEY
    : process.env.GROQ_API_KEY

  if (!apiKey) throw { type: 'NO_KEY', message: `no api key set for ${cfg.provider}. check your .env file.` }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({
      model: cfg.id,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: userMessage }
      ]
    })
  })

  if (res.status === 429) {
    const retryAfter = res.headers.get('retry-after') || res.headers.get('x-ratelimit-reset-requests') || ''
    const secs = parseInt(retryAfter) || 0
    const hh = String(Math.floor(secs / 3600)).padStart(2, '0')
    const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0')
    const timeStr = secs > 0 ? `${hh}:${mm}` : 'a while'
    throw { type: 'EXHAUSTED', message: `rocky exhausted 😴 check back in ${timeStr} I miss thanu` }
  }

  const data = await res.json()
  if (data.error) {
    if (data.error.code === 'rate_limit_exceeded' || data.error.type === 'rate_limit_error') {
      throw { type: 'EXHAUSTED', message: 'rocky exhausted 😴 check back in a bit I miss thanu' }
    }
    throw { type: 'API_ERROR', message: data.error.message }
  }
  return data.choices[0].message.content
}

module.exports = { sendToRocky }