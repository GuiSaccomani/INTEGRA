import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('today');
  const [reportType, setReportType] = useState('summary');

  const mockData = {
    summary: {
      totalLogs: 15847,
      errors: 234,
      warnings: 1205,
      info: 14408,
      uptime: 99.2,
      avgResponseTime: 145
    },
    trends: [
      { time: '00:00', logs: 120, errors: 2 },
      { time: '04:00', logs: 89, errors: 0 },
      { time: '08:00', logs: 456, errors: 12 },
      { time: '12:00', logs: 789, errors: 8 },
      { time: '16:00', logs: 654, errors: 5 },
      { time: '20:00', logs: 321, errors: 3 }
    ]
  };

  const generateReport = () => {
    // 🔗 BACKEND: GET /api/reports?type=${reportType}&range=${dateRange}
    console.log('Gerando relatório:', { reportType, dateRange });
    alert('Relatório gerado com sucesso!');
  };

  const exportReport = (format) => {
    // 🔗 BACKEND: GET /api/reports/export?format=${format}
    console.log('Exportando relatório em:', format);
    alert(`Relatório exportado em ${format.toUpperCase()}!`);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-2 border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📈</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Relatórios</h1>
                <p className="text-gray-600">Análise detalhada dos logs</p>
              </div>
            </div>
            <Link to="/monitoring" className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800">
              ← Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-black mb-4">Filtros do Relatório</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Período</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-black"
              >
                <option value="today">Hoje</option>
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="quarter">Último Trimestre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Tipo de Relatório</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-black"
              >
                <option value="summary">Resumo Executivo</option>
                <option value="detailed">Análise Detalhada</option>
                <option value="errors">Relatório de Erros</option>
                <option value="performance">Performance</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={generateReport}
                className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 font-medium"
              >
                🔄 Gerar Relatório
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-black">Total de Logs</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-black">{mockData.summary.totalLogs.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2">↗️ +12% vs período anterior</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-black">Taxa de Erro</h3>
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-3xl font-bold text-black">
              {((mockData.summary.errors / mockData.summary.totalLogs) * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-red-600 mt-2">↗️ +0.3% vs período anterior</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-black">Uptime</h3>
              <span className="text-2xl">⏱️</span>
            </div>
            <p className="text-3xl font-bold text-black">{mockData.summary.uptime}%</p>
            <p className="text-sm text-green-600 mt-2">↗️ +0.1% vs período anterior</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Log Trends */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-black mb-4">Tendência de Logs (24h)</h3>
            <div className="space-y-3">
              {mockData.trends.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.time}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full transition-all"
                        style={{ width: `${(item.logs / 800) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-black">{item.logs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Distribution */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-black mb-4">Distribuição por Nível</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">INFO</span>
                </div>
                <span className="font-bold">{mockData.summary.info.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">WARN</span>
                </div>
                <span className="font-bold">{mockData.summary.warnings.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">ERROR</span>
                </div>
                <span className="font-bold">{mockData.summary.errors.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-black mb-4">Exportar Relatório</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => exportReport('pdf')}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              📄 PDF
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
            >
              📊 Excel
            </button>
            <button
              onClick={() => exportReport('csv')}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              📋 CSV
            </button>
            <button
              onClick={() => exportReport('json')}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
            >
              🔧 JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}