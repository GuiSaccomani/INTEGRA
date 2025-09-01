import { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    syncEnabled: true,
    syncInterval: 5000,
    apiKey: ''
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // 🔗 PYTHON BACKEND: Salvar configurações
      console.log('Salvando configurações:', settings);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Descomente quando backend estiver pronto:
      /*
      const response = await fetch('http://localhost:3001/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) throw new Error('Erro ao salvar configurações');
      */
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <div className={`shadow-2xl border-b-2 backdrop-blur-sm ${isDark ? 'bg-black border-gray-600' : 'bg-white/95 border-gray-200'}`}>
        <div className="px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                <img src="/logo-integra.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Configurações</h1>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Gerencie as configurações do sistema
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => window.close()}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm sm:text-base ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          {success && (
            <div className={`mb-6 p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-green-50 border-green-200 text-green-800'}`}>
              Configurações salvas com sucesso!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-6">
              {/* Sincronização */}
              <div className={`rounded-2xl shadow-xl p-6 backdrop-blur-sm ${isDark ? 'bg-black border border-gray-600' : 'bg-white border border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Sincronização</h2>
                
                <div className="space-y-6">
                  {/* Toggle Sincronização */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Estado</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {settings.syncEnabled ? 'Sincronização ativa' : 'Sincronização pausada'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSettings({...settings, syncEnabled: !settings.syncEnabled})}
                      className={`w-16 h-8 rounded-full transition-all duration-300 relative shadow-lg ${
                        settings.syncEnabled ? 'bg-black' : 'bg-gray-400'
                      }`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 absolute top-1 shadow-md ${
                        settings.syncEnabled ? 'translate-x-9' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>

                  {/* Intervalo */}
                  <div>
                    <label className={`block font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
                      Intervalo de Atualização
                    </label>
                    <select
                      value={settings.syncInterval}
                      onChange={(e) => setSettings({...settings, syncInterval: parseInt(e.target.value)})}
                      disabled={!settings.syncEnabled}
                      className={`w-full border-2 rounded-xl px-4 py-3 text-base transition-all ${
                        settings.syncEnabled 
                          ? (isDark ? 'border-gray-600 bg-gray-800 text-white hover:border-gray-500' : 'border-gray-300 bg-white text-black hover:border-gray-400')
                          : 'border-gray-400 bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <option value={1000}>1 segundo</option>
                      <option value={5000}>5 segundos</option>
                      <option value={10000}>10 segundos</option>
                      <option value={30000}>30 segundos</option>
                      <option value={60000}>1 minuto</option>
                      <option value={300000}>5 minutos</option>
                    </select>
                    <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Frequência de busca por novos logs
                    </p>
                  </div>
                </div>
              </div>

              {/* API Key */}
              <div className={`rounded-2xl shadow-xl p-6 backdrop-blur-sm ${isDark ? 'bg-black border border-gray-600' : 'bg-white border border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Autenticação</h2>
                
                <div>
                  <label className={`block font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
                    Chave da API
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.apiKey}
                      onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                      placeholder="Insira sua chave de API..."
                      className={`w-full border-2 rounded-xl px-4 py-3 pr-20 text-base font-mono transition-all ${isDark ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 hover:border-gray-500' : 'border-gray-300 bg-white text-black placeholder-gray-500 hover:border-gray-400'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs rounded transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                    >
                      {showApiKey ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Chave necessária para autenticação com o backend
                  </p>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-6">
              {/* Status Detalhado */}
              <div className={`rounded-2xl shadow-xl p-6 backdrop-blur-sm ${isDark ? 'bg-black border border-gray-600' : 'bg-white border border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Status do Sistema</h2>
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Sincronização</span>
                      <div className={`w-3 h-3 rounded-full ${settings.syncEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {settings.syncEnabled ? 'Sistema ativo e monitorando' : 'Sistema pausado'}
                    </p>
                    {settings.syncEnabled && (
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Próxima atualização em {settings.syncInterval/1000}s
                      </p>
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Autenticação</span>
                      <div className={`w-3 h-3 rounded-full ${settings.apiKey ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {settings.apiKey ? 'API Key configurada' : 'API Key não definida'}
                    </p>
                    {settings.apiKey && (
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Chave: ****{settings.apiKey.slice(-4)}
                      </p>
                    )}
                  </div>

                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Conexão</span>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Frontend operacional</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Última atualização: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className={`rounded-2xl shadow-xl p-6 backdrop-blur-sm ${isDark ? 'bg-black border border-gray-600' : 'bg-white border border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Informações</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Versão:</span>
                    <span className={isDark ? 'text-white' : 'text-black'}>1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Ambiente:</span>
                    <span className={isDark ? 'text-white' : 'text-black'}>Desenvolvimento</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Backend:</span>
                    <span className={isDark ? 'text-white' : 'text-black'}>Python FastAPI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
                isSaving
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : (isDark ? 'bg-white text-black hover:bg-gray-200 hover:shadow-xl' : 'bg-black text-white hover:bg-gray-800 hover:shadow-xl')
              }`}
            >
              {isSaving ? 'Salvando configurações...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}