import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConfig } from "../hooks/useConfig.js";

export default function ConfigForm() {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [level, setLevel] = useState("info");
  const navigate = useNavigate();
  const { config, loading, toggleConfig } = useConfig();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Salvar configurações básicas localmente
      console.log('Configurações salvas:', { host, port, level });
      navigate('/monitoring');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full border border-gray-200">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">📈</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Log Viewer</h1>
          <p className="text-gray-500">Configure a conexão com seu serviço de logs</p>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">🔗 Backend: <code className="bg-gray-200 px-2 py-1 rounded">localhost:3001</code></p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">🏠 Host do Servidor</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all bg-gray-50"
              placeholder="localhost ou IP do servidor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">🔌 Porta</label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all bg-gray-50"
              placeholder="3000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">📈 Nível de Log</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all bg-gray-50"
            >
              <option value="debug">Debug - Todos os logs</option>
              <option value="info">Info - Informações gerais</option>
              <option value="warn">Warning - Avisos</option>
              <option value="error">Error - Apenas erros</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium shadow-lg text-lg"
          >
            🚀 Conectar e Visualizar Logs
          </button>
        </form>
        
        {/* Configurações do Sistema */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-bold text-black mb-4">Configurações do Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-black">Sincronização</span>
              <button
                onClick={() => toggleConfig('sincronizacao')}
                disabled={loading}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  config.sincronizacao 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}
              >
                {config.sincronizacao ? 'Ativa' : 'Inativa'}
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-black">Captura</span>
              <button
                onClick={() => toggleConfig('captura')}
                disabled={loading}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  config.captura 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}
              >
                {config.captura ? 'Ativa' : 'Inativa'}
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-black">Conexão</span>
              <button
                onClick={() => toggleConfig('conexao')}
                disabled={loading}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  config.conexao 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}
              >
                {config.conexao ? 'Funcionando' : 'Não funcionando'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
