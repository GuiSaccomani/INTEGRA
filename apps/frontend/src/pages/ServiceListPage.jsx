import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { logSender } from '../services/logSender.js';
import { SunIcon, MoonIcon } from '../components/Icons.jsx';
import { api } from '../services/api.js';

export default function ServiceListPage() {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [services, setServices] = useState([
    { id: 1, name: 'Sincronização', host: 'localhost', port: 3001, status: 'online' },
    { id: 2, name: 'Captura', host: 'localhost', port: 3002, status: 'online' }
  ]);

  // 🔗 PYTHON BACKEND: Buscar lista de serviços
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Registrar ação do usuário
      await logSender.logUserAction('atualizou lista de serviços');
      
      // Conectando com a API
      const data = await api.getServices();
      setServices(data);
      
      console.log('Lista de serviços atualizada');
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      await logSender.logError(error, 'fetchServices');
    }
  };

  const openLogViewer = (service) => {
    // Registrar acesso aos logs (sem await para não bloquear)
    logSender.logUserAction('acessou logs do serviço', {
      service_id: service.id,
      service_name: service.name
    }).catch(error => console.error('Erro ao registrar log:', error));
    
    const url = `/logs?service=${service.id}&name=${service.name}&host=${service.host}&port=${service.port}`;
    window.open(url, '_blank');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`min-h-screen p-3 sm:p-6 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-10 mb-4 sm:mb-8 backdrop-blur-sm ${isDark ? 'bg-black border border-gray-600' : 'bg-white/90 border border-white/20'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-4 lg:mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Logo */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 flex items-center justify-center">
                <img src="/logo-integra.png" alt="Integra Logo" className={`w-full h-full object-contain ${!isDark ? 'filter invert' : ''}`} />
              </div>
              <div className="text-center sm:text-left">
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Log Viewer</h1>
                <p className={`text-sm sm:text-base lg:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Selecione um serviço para visualizar os logs em tempo real</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                >
                  {isDark ? <SunIcon /> : <MoonIcon />}
                </button>
                <button
                  onClick={logout}
                  className={`px-3 py-2 rounded-xl transition-colors text-sm ${isDark ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                >
                  Sair
                </button>
              </div>
              <div className="text-center lg:text-right">
                <div className={`text-xs sm:text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Serviços Ativos</div>
                <div className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{services.filter(s => s.status === 'online').length}/{services.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className={`rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm ${isDark ? 'bg-black border border-gray-600' : 'bg-white/90 border border-white/20'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Serviços Disponíveis</h2>
            <div className="flex gap-3">
              <button 
                onClick={() => window.open('/settings', '_blank')}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm sm:text-base ${isDark ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
              >
                Configurações
              </button>
              <button 
                onClick={fetchServices}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm sm:text-base ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                Atualizar
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:gap-6">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className={`group border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] ${isDark ? 'border-gray-600 hover:border-white bg-black' : 'border-gray-200 hover:border-black bg-white'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="relative flex-shrink-0">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-lg ${
                        service.status === 'online' ? (isDark ? 'bg-white' : 'bg-black') :
                        service.status === 'offline' ? 'bg-gray-400' :
                        'bg-gray-600'
                      }`}></div>
                      {service.status === 'online' && (
                        <div className={`absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full animate-ping opacity-40 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg sm:text-xl font-bold mb-1 truncate ${isDark ? 'text-white' : 'text-black'}`}>{service.name}</h3>
                      <p className={`font-mono text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg inline-block break-all ${isDark ? 'text-gray-300 bg-gray-600' : 'text-gray-600 bg-gray-100'}`}>
                        {service.host}:{service.port}
                      </p>
                      <div className="mt-2">
                        <span className={`text-xs px-2 sm:px-3 py-1 rounded-full font-medium ${
                          service.status === 'online' ? (isDark ? 'bg-white text-black' : 'bg-black text-white') :
                          service.status === 'offline' ? (isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600') :
                          (isDark ? 'bg-gray-500 text-gray-200' : 'bg-gray-300 text-gray-700')
                        }`}>
                          {service.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openLogViewer(service)}
                    className={`w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    Ver Logs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}