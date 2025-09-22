import { useState, useEffect } from 'react';
import { configService } from '../services/configService.js';

export const useConfig = () => {
  const [config, setConfig] = useState({
    sincronizacao: true,
    captura: true,
    conexao: true
  });
  const [loading, setLoading] = useState(false);

  // Carregar configurações do banco
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = await configService.getConfig();
      setConfig(data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Alterar configuração e salvar no banco
  const toggleConfig = async (key) => {
    const newValue = !config[key];
    
    try {
      // Atualizar localmente primeiro (UX)
      setConfig(prev => ({ ...prev, [key]: newValue }));
      
      // Salvar no banco
      await configService.updateConfig(key, newValue);
      
      console.log(`Configuração ${key} alterada para ${newValue} no banco`);
    } catch (error) {
      // Reverter se deu erro
      setConfig(prev => ({ ...prev, [key]: !newValue }));
      console.error('Erro ao salvar configuração:', error);
    }
  };

  return {
    config,
    loading,
    toggleConfig,
    loadConfig
  };
};