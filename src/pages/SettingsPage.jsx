import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    refreshInterval: 5000,
    maxLogs: 1000,
    autoScroll: true,
    darkMode: false,
    notifications: true,
    apiEndpoint: 'http://localhost:3001/api'
  });

  const handleSave = () => {
    // 🔗 BACKEND: POST /api/settings
    console.log('Salvando configurações:', settings);
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-2 border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⚙️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Configurações</h1>
                <p className="text-gray-600">Personalize sua experiência</p>
              </div>
            </div>
            <Link to="/monitoring" className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800">
              ← Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* API Configuration */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
            🔗 Configuração da API
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Endpoint da API</label>
              <input
                type="text"
                value={settings.apiEndpoint}
                onChange={(e) => setSettings({...settings, apiEndpoint: e.target.value})}
                className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-black"
                placeholder="http://localhost:3001/api"
              />
              <p className="text-xs text-gray-600 mt-1">URL base para comunicação com o backend</p>
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
            ⚡ Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Intervalo de Atualização (ms)</label>
              <select
                value={settings.refreshInterval}
                onChange={(e) => setSettings({...settings, refreshInterval: parseInt(e.target.value)})}
                className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-black"
              >
                <option value={1000}>1 segundo</option>
                <option value={5000}>5 segundos</option>
                <option value={10000}>10 segundos</option>
                <option value={30000}>30 segundos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Máximo de Logs</label>
              <select
                value={settings.maxLogs}
                onChange={(e) => setSettings({...settings, maxLogs: parseInt(e.target.value)})}
                className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-black"
              >
                <option value={500}>500 logs</option>
                <option value={1000}>1000 logs</option>
                <option value={5000}>5000 logs</option>
                <option value={10000}>10000 logs</option>
              </select>
            </div>
          </div>
        </div>

        {/* UI Preferences */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
            🎨 Interface
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-black">Auto-scroll nos logs</h3>
                <p className="text-sm text-gray-600">Rolar automaticamente para novos logs</p>
              </div>
              <button
                onClick={() => setSettings({...settings, autoScroll: !settings.autoScroll})}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.autoScroll ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.autoScroll ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-black">Notificações</h3>
                <p className="text-sm text-gray-600">Alertas para erros críticos</p>
              </div>
              <button
                onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSave}
            className="bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors font-medium text-lg"
          >
            💾 Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}