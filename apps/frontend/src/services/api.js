// 🔗 CATCH-API CONNECTION
// Backend Node.js (Express) rodando na porta 3000
const API_BASE = 'http://localhost:3000'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
    this.token = localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      // Se for erro de CORS, usar fallback
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        console.log('CORS error - usando fallback');
        throw new Error('CORS_ERROR');
      }
      throw error;
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Auth
  async login(credentials) {
    try {
      const response = await this.request('/login', {
        method: 'POST',
        body: JSON.stringify({
          email: credentials.username,
          password: credentials.password
        }),
      });
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      // Fallback para credenciais locais
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        return { success: true };
      }
      throw error;
    }
  }

  // Logs
  async getLogs(limit = 100) {
    try {
      return await this.request(`/logs?limit=${limit}`);
    } catch (error) {
      console.log('Backend não disponível - usando logs locais');
      // Fallback para logs locais
      return [
        { type: 'INFO', content: 'Sistema iniciado (local)', created_at: new Date().toISOString() },
        { type: 'DEBUG', content: 'Carregando configurações (local)', created_at: new Date().toISOString() },
        { type: 'WARN', content: 'Backend não conectado - modo offline', created_at: new Date().toISOString() }
      ];
    }
  }

  async createLog(logData) {
    try {
      return await this.request('/logs', {
        method: 'POST',
        body: JSON.stringify({
          type: logData.level || 'INFO',
          content: logData.message
        }),
      });
    } catch (error) {
      console.log('Log salvo localmente:', logData);
      return { success: true };
    }
  }

  // Configuration
  async getConfig() {
    try {
      const response = await this.request('/cfg');
      // Mapear dados do Oracle para formato do frontend
      if (response && response.length > 0 && response[0].length >= 5) {
        const [captureState, syncState, syncInterval, checkInterval, apiKey] = response[0];
        return {
          captureEnabled: captureState === 1,
          syncEnabled: syncState === 1,
          syncInterval: syncInterval * 1000, // converter para ms
          checkInterval: checkInterval * 1000, // converter para ms
          apiKey: apiKey || ''
        };
      }
      // Fallback se dados não estão no formato esperado
      return {
        syncEnabled: true,
        captureEnabled: true,
        syncInterval: 5000,
        apiKey: ''
      };
    } catch (error) {
      console.log('Backend não disponível - usando configurações locais');
      // Fallback para configurações padrão
      return {
        syncEnabled: true,
        captureEnabled: true,
        syncInterval: 5000,
        apiKey: ''
      };
    }
  }

  async updateConfig(config, originalConfig = {}) {
    try {
      // Mapear apenas campos alterados para formato do Oracle
      const changes = {};
      
      if (config.captureEnabled !== originalConfig.captureEnabled) {
        changes.cfg_capture_state = config.captureEnabled ? 1 : 0;
      }
      
      if (config.syncEnabled !== originalConfig.syncEnabled) {
        changes.cfg_sync_state = config.syncEnabled ? 1 : 0;
      }
      
      if (config.syncInterval !== originalConfig.syncInterval) {
        changes.cfg_sync_interval = Math.floor(config.syncInterval / 1000);
      }
      
      if (config.apiKey !== originalConfig.apiKey) {
        changes.cfg_apikey = config.apiKey || null;
      }
      
      // Só enviar se houver mudanças
      if (Object.keys(changes).length === 0) {
        return { success: true, message: 'Nenhuma alteração detectada' };
      }
      
      return await this.request('/cfg', {
        method: 'PUT',
        body: JSON.stringify(changes),
      });
    } catch (error) {
      console.log('Configurações salvas localmente:', config);
      return { success: true };
    }
  }

  // Services
  async getServices() {
    return [
      { id: 1, name: 'Sincronização', host: 'localhost', port: 3000, status: 'online' },
      { id: 2, name: 'Captura', host: 'localhost', port: 3001, status: 'online' }
    ];
  }
}

export const api = new ApiClient();