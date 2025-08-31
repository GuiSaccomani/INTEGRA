import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MonitoringPage() {
  const [services, setServices] = useState([
    { id: 1, name: 'API Gateway', host: 'localhost', port: 3001, status: 'online', logs: 1247, errors: 3 },
    { id: 2, name: 'Database Service', host: 'localhost', port: 5432, status: 'online', logs: 892, errors: 0 },
    { id: 3, name: 'Auth Service', host: 'localhost', port: 8080, status: 'offline', logs: 0, errors: 12 },
    { id: 4, name: 'File Storage', host: 'localhost', port: 9000, status: 'warning', logs: 456, errors: 1 }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const openLogViewer = (service) => {
    const url = `/logs?host=${service.host}&port=${service.port}&service=${service.name}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-2 border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📊</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Monitoramento de Serviços</h1>
                <p className="text-gray-600">Dashboard em tempo real</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/settings" className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700">
                ⚙️ Configurações
              </Link>
              <Link to="/reports" className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800">
                📈 Relatórios
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Serviços Online</p>
                <p className="text-3xl font-bold text-black">{services.filter(s => s.status === 'online').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Logs</p>
                <p className="text-3xl font-bold text-black">{services.reduce((acc, s) => acc + s.logs, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Erros Totais</p>
                <p className="text-3xl font-bold text-black">{services.reduce((acc, s) => acc + s.errors, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-red-600 text-xl">❌</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Uptime</p>
                <p className="text-3xl font-bold text-black">99.2%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-purple-600 text-xl">⏱️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-black mb-6">Serviços Monitorados</h2>
          <div className="grid gap-4">
            {services.map(service => (
              <div key={service.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(service.status)}`}></div>
                    <div>
                      <h3 className="font-bold text-black text-lg">{service.name}</h3>
                      <p className="text-gray-600 text-sm">{service.host}:{service.port}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-black">{service.logs}</p>
                      <p className="text-xs text-gray-600">Logs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{service.errors}</p>
                      <p className="text-xs text-gray-600">Erros</p>
                    </div>
                    <button
                      onClick={() => openLogViewer(service)}
                      className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
                    >
                      🔍 Ver Logs
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}