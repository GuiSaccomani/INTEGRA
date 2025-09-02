// 🚀 LOG SENDER SERVICE - Envia logs para o backend Python

const API_BASE = 'http://localhost:3001/api';

export const logSender = {
  // Enviar log individual
  async sendLog(logData) {
    try {
      const response = await fetch(`${API_BASE}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          service_id: logData.serviceId,
          level: logData.level,
          message: logData.message,
          timestamp: logData.timestamp || new Date().toISOString(),
          metadata: logData.metadata || {}
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Log enviado com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro ao enviar log:', error);
      throw error;
    }
  },

  // Enviar múltiplos logs em lote
  async sendBatchLogs(logsArray) {
    try {
      const response = await fetch(`${API_BASE}/logs/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          logs: logsArray.map(log => ({
            service_id: log.serviceId,
            level: log.level,
            message: log.message,
            timestamp: log.timestamp || new Date().toISOString(),
            metadata: log.metadata || {}
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`${logsArray.length} logs enviados em lote:`, result);
      return result;
    } catch (error) {
      console.error('Erro ao enviar logs em lote:', error);
      throw error;
    }
  },

  // Registrar evento do sistema
  async logSystemEvent(eventType, message, metadata = {}) {
    return this.sendLog({
      serviceId: 1, // ID do sistema principal
      level: 'INFO',
      message: `[SYSTEM] ${eventType}: ${message}`,
      metadata: {
        event_type: eventType,
        ...metadata
      }
    });
  },

  // Registrar erro
  async logError(error, context = '') {
    return this.sendLog({
      serviceId: 1,
      level: 'ERROR',
      message: `[ERROR] ${context}: ${error.message}`,
      metadata: {
        error_name: error.name,
        error_stack: error.stack,
        context: context
      }
    });
  },

  // Registrar ação do usuário
  async logUserAction(action, details = {}) {
    const username = localStorage.getItem('username') || 'unknown';
    return this.sendLog({
      serviceId: 1,
      level: 'INFO',
      message: `[USER] ${username} ${action}`,
      metadata: {
        user: username,
        action: action,
        ...details
      }
    });
  }
};

// Interceptador global de erros
window.addEventListener('error', (event) => {
  logSender.logError(event.error, 'Global Error Handler');
});

// Interceptador de promessas rejeitadas
window.addEventListener('unhandledrejection', (event) => {
  logSender.logError(new Error(event.reason), 'Unhandled Promise Rejection');
});