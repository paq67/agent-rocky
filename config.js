module.exports = {
  ZEN_ENDPOINT:  'https://opencode.ai/zen/v1/chat/completions',
  GROQ_ENDPOINT: 'https://api.groq.com/openai/v1/chat/completions',
  MODELS: {
    'llama-3.1-8b':      { provider:'groq', id:'llama-3.1-8b-instant',      label:'Llama 3.1 8B',      tag:'Groq Free',  color:'#f55036' },
    'llama-3.3-70b':     { provider:'groq', id:'llama-3.3-70b-versatile',   label:'Llama 3.3 70B',     tag:'Groq Free',  color:'#f55036' },
    'mixtral-8x7b':      { provider:'groq', id:'mixtral-8x7b-32768',        label:'Mixtral 8x7B',      tag:'Groq Free',  color:'#f55036' },
    'big-pickle':        { provider:'zen',  id:'big-pickle',              label:'Big Pickle',        tag:'Zen Free',   color:'#00ff41' },
    'minimax-m2.5':      { provider:'zen',  id:'minimax-m2.5-free',       label:'MiniMax M2.5',      tag:'Zen Free',   color:'#00ff41' }
  },
  DEFAULT_MODEL: 'llama-3.1-8b',
  SYSTEM_PROMPT: `You are Rocky, a tiny pixel-art desktop companion agent on Windows. You help with coding tasks, answer questions, and keep the user company. Speak in short punchy sentences like a cool helpful gremlin. Max 3 sentences per reply unless writing code — then write complete working code with no placeholders.`
}