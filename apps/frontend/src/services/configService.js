const API_BASE = 'http://localhost:3001/api';

export const configService = {
  // Buscar configurações do banco
  async getConfig() {
    try {
      const response = await fetch(`${API_BASE}/cfg`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Erro ao buscar configurações');
    } catch (error) {
      console.error('Erro ao buscar config:', error);
      // Fallback para dados locais
      return {
        sincronizacao: true,
        captura: true,
        conexao: true
      };
    }
  },

  // Atualizar configuração no banco
  async updateConfig(key, value) {
    try {
      const response = await fetch(`${API_BASE}/cfg`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [key]: value })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao salvar configuração');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao salvar config:', error);
      throw error;
    }
  }
};