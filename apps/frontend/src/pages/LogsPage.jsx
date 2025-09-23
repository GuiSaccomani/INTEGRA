import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { api } from '../services/api.js';
import LogTabs from '../components/LogTabs.jsx';
import LogViewer from '../components/LogViewer.jsx';
import { SunIcon, MoonIcon, ChartIcon } from '../components/Icons.jsx';

export default function LogsPage() {
  const { isDark, toggleTheme } = useTheme();
  const [logs, setLogs] = useState([
    { level: 'INFO', timestamp: '2024-01-15 10:30:15', message: 'Aplicação iniciada com sucesso' },
    { level: 'DEBUG', timestamp: '2024-01-15 10:30:16', message: 'Carregando configurações do sistema' },
    { level: 'INFO', timestamp: '2024-01-15 10:30:17', message: 'Conectado ao banco de dados' },
    { level: 'DEBUG', timestamp: '2024-01-15 10:30:18', message: 'Query executada: SELECT * FROM users' },
    { level: 'WARN', timestamp: '2024-01-15 10:30:20', message: 'Conexão lenta detectada - 2.5s' },
    { level: 'ERROR', timestamp: '2024-01-15 10:30:25', message: 'Falha na autenticação do usuário admin' },
    { level: 'DEBUG', timestamp: '2024-01-15 10:30:28', message: 'Limpando cache temporário' },
    { level: 'INFO', timestamp: '2024-01-15 10:30:30', message: 'Cache limpo automaticamente' }
  ]);
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [isConnected, setIsConnected] = useState(false);
  
  const serviceId = searchParams.get('service');
  const serviceName = searchParams.get('name') || 'Serviço';
  const host = searchParams.get('host') || 'localhost';
  const port = searchParams.get('port') || '3000';
  const [level, setLevel] = useState('info');

  // 🔗 PYTHON BACKEND: Preparado para receber logs do backend quando estiver pronto
  useEffect(() => {
    // Simular conexão ativa para demonstração
    setIsConnected(true);
    
    // Descomente quando backend estiver pronto:
    /*
    if (serviceId) {
      try {
        const eventSource = new EventSource(`http://localhost:3001/api/logs/${serviceId}/stream`);
        
        eventSource.onopen = () => {
          setIsConnected(true);
          console.log('Conectado ao stream de logs do Python');
        };
        
        eventSource.onmessage = (event) => {
          const logEntry = JSON.parse(event.data);
          setLogs(prev => [...prev, logEntry]);
        };
        
        eventSource.onerror = () => {
          setIsConnected(false);
          console.error('Erro na conexão com stream de logs');
        };
        
        return () => {
          eventSource.close();
          setIsConnected(false);
        };
      } catch (error) {
        console.error('Erro ao conectar stream:', error);
        setIsConnected(false);
      }
    }
    */
  }, [serviceId]);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level.toLowerCase() === filter;
    return matchesFilter;
  });

  const getLevelColor = (level) => {
    switch(level) {
      case 'ERROR': return 'text-red-400';
      case 'WARN': return 'text-yellow-400';
      case 'INFO': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <div className={`shadow-2xl border-b-2 backdrop-blur-sm ${isDark ? 'bg-black border-gray-600' : 'bg-white/95 border-gray-200'}`}>
        <div className="px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center flex-shrink-0">
                <img src="/logo-integra.png" alt="Logo" className={`w-full h-full object-contain ${!isDark ? 'filter invert' : ''}`} />
              </div>
              <div className="min-w-0">
                <h1 className={`text-xl sm:text-2xl font-bold truncate ${isDark ? 'text-white' : 'text-black'}`}>{serviceName}</h1>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? (isDark ? 'bg-white' : 'bg-black') : 'bg-gray-400'}`}></span>
                  <span className="break-all">{host}:{port}</span> • Nível: {level.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={`border-2 rounded-xl px-3 sm:px-4 py-2 text-sm sm:text-base ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'}`}
              >
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
              </select>
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
        {/* Tabs Interativas */}
        <LogTabs logs={filteredLogs} onFilterChange={setFilter} />

        {/* Visualizador de Logs */}
        <LogViewer logs={filteredLogs} filter={filter} />

        {/* Dashboard de Métricas */}
        <div className="flex justify-between items-center mb-4 mt-6">
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>Métricas por Nível - Clique para filtrar</h3>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === 'all' ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-black hover:bg-gray-300')}`}
          >
            Mostrar Todos
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { level: 'INFO', label: 'Informações' },
            { level: 'WARN', label: 'Avisos' },
            { level: 'ERROR', label: 'Erros' },
            { level: 'DEBUG', label: 'Debug' }
          ].map(({ level, label }) => {
            const count = logs.filter(log => log.level === level).length;
            const percentage = logs.length > 0 ? ((count / logs.length) * 100).toFixed(1) : 0;
            const isActive = filter === level.toLowerCase();
            return (
              <button 
                key={level} 
                onClick={() => setFilter(level.toLowerCase())}
                className={`w-full text-left rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 border backdrop-blur-sm cursor-pointer ${isDark ? 'bg-black border-gray-600 hover:border-white' : 'bg-white/90 border-gray-100 hover:border-black'} ${isActive ? (isDark ? 'ring-2 ring-white' : 'ring-2 ring-black') : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${isDark ? 'bg-white' : 'bg-black'}`}>
                    <span className={`text-xs font-bold ${isDark ? 'text-black' : 'text-white'}`}>{level.charAt(0)}</span>
                  </div>
                  <div className={`text-xs px-3 py-1 rounded-full font-medium ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    {percentage}%
                  </div>
                </div>
                <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>{count}</div>
                <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{label}</div>
                <div className={`mt-4 rounded-full h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-3 rounded-full transition-all duration-700 ${isDark ? 'bg-white' : 'bg-black'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>
        {filter !== 'all' && (
          <div className={`mt-4 p-3 rounded-lg text-center ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
            Filtrando por: <span className="font-bold">{filter.toUpperCase()}</span>
          </div>
        )}

        {/* Relatório Avançado */}
        <div className={`mt-6 rounded-2xl shadow-xl p-6 sm:p-8 border backdrop-blur-sm ${isDark ? 'bg-black border-gray-600' : 'bg-white/90 border-gray-100'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ChartIcon className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Relatório Detalhado</h3>
            </div>
            <div className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              Atualizado: {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          {/* Estatísticas Principais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`text-center p-4 rounded-xl transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
              <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{logs.length}</div>
              <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total de Logs</div>
            </div>
            <div className={`text-center p-4 rounded-xl transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
              <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
                {logs.length > 0 ? Math.round((logs.filter(l => l.level === 'INFO').length / logs.length) * 100) : 0}%
              </div>
              <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Taxa de Sucesso</div>
            </div>
            <div className={`text-center p-4 rounded-xl transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
              <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
                {logs.filter(l => l.level === 'ERROR').length}
              </div>
              <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Erros Críticos</div>
            </div>
            <div className={`text-center p-4 rounded-xl transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
              <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
                {logs.filter(l => l.level === 'WARN').length}
              </div>
              <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avisos</div>
            </div>
          </div>

          {/* Análise Detalhada */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <h4 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>Distribuição por Tipo</h4>
              <div className="space-y-2">
                {['INFO', 'WARN', 'ERROR', 'DEBUG'].map(level => {
                  const count = logs.filter(l => l.level === level).length;
                  const percentage = logs.length > 0 ? (count / logs.length) * 100 : 0;
                  return (
                    <div key={level} className="flex items-center justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{level}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-20 h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${isDark ? 'bg-white' : 'bg-black'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <h4 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>Status do Sistema</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Saúde Geral</span>
                  <span className={`text-sm font-bold ${
                    logs.filter(l => l.level === 'ERROR').length === 0 ? 'text-green-500' :
                    logs.filter(l => l.level === 'ERROR').length < 3 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {logs.filter(l => l.level === 'ERROR').length === 0 ? 'Excelente' :
                     logs.filter(l => l.level === 'ERROR').length < 3 ? 'Atenção' : 'Crítico'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Último Log</span>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {logs.length > 0 ? logs[logs.length - 1].timestamp : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Conexão</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {isConnected ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}