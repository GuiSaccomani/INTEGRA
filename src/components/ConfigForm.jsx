import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

export default function ConfigForm() {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [level, setLevel] = useState("info");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.saveConfig({ host, port, level });
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
      </div>
    </div>
  );
}
