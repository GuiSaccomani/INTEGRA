// 🔗 PYTHON BACKEND CONNECTION
// Backend Python (FastAPI) rodando na porta 3001
const API_BASE = 'http://localhost:3001/api' // ← Servidor Python FastAPI

// 📡 API Service - Conecta com backend Python via REST
export const api = {
  async saveConfig(config) {
    const response = await fetch(`${API_BASE}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })
    return response.json()
  },

  async getLogs(params) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE}/logs?${query}`)
    return response.json()
  },

  async getLogStream(params) {
    const query = new URLSearchParams(params).toString()
    return new EventSource(`${API_BASE}/logs/stream?${query}`)
  },

  async createLog(logData) {
    const response = await fetch(`${API_BASE}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    })
    return response.json()
  }
}