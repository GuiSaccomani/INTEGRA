import { useState, useEffect, useRef } from 'react';

export default function LogViewer({ logs, filter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef(null);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level.toLowerCase() === filter;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      setTimeout(() => {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [filteredLogs, autoScroll]);

  // Auto-scroll quando novos logs chegam
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs.length]);

  const getLevelIcon = (level) => {
    switch(level) {
      case 'ERROR': return '🔴';
      case 'WARN': return '🟡';
      case 'INFO': return '🔵';
      case 'DEBUG': return '🟣';
      default: return '⚪';
    }
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'ERROR': return 'text-red-400 bg-red-900/20';
      case 'WARN': return 'text-yellow-400 bg-yellow-900/20';
      case 'INFO': return 'text-blue-400 bg-blue-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200">
      {/* Header do Console */}
      <div className="bg-black px-6 py-4 border-b border-gray-300">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-white font-mono text-sm font-bold">Terminal</span>
          </div>
          
          <div className="flex flex-1 items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="🔍 Buscar nos logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-gray-400 text-sm"
              />
            </div>
            
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                autoScroll 
                  ? 'bg-black text-white' 
                  : 'bg-gray-300 text-black hover:bg-gray-400'
              }`}
            >
              {autoScroll ? '⏸️' : '▶️'} Auto-scroll
            </button>
          </div>
        </div>
      </div>

      {/* Logs Container */}
      <div 
        ref={logContainerRef}
        className="h-96 overflow-y-auto p-4 font-mono text-sm bg-gray-50"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="font-medium">Nenhum log encontrado</p>
          </div>
        ) : (
          filteredLogs.map((log, i) => (
            <div 
              key={i} 
              className={`mb-2 p-3 rounded-lg hover:bg-white transition-colors border-l-4 ${
                log.level === 'ERROR' ? 'border-black bg-gray-100' :
                log.level === 'WARN' ? 'border-gray-600 bg-gray-100' :
                log.level === 'INFO' ? 'border-gray-400 bg-white' :
                log.level === 'DEBUG' ? 'border-gray-500 bg-gray-50' : 'border-gray-300 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-600">{log.timestamp}</span>
                  <span className={`px-2 py-1 rounded-full font-bold text-xs bg-black text-white`}>
                    {getLevelIcon(log.level)} {log.level}
                  </span>
                </div>
                <div className="text-black flex-1 font-medium">
                  {searchTerm ? (
                    <span dangerouslySetInnerHTML={{
                      __html: log.message.replace(
                        new RegExp(searchTerm, 'gi'),
                        `<mark class="bg-yellow-400 text-black px-1 rounded">$&</mark>`
                      )
                    }} />
                  ) : (
                    log.message
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer com estatísticas */}
      <div className="bg-black px-6 py-3 border-t border-gray-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-white font-medium">
          <div>
            Mostrando {filteredLogs.length} de {logs.length} logs
          </div>
          <div className="flex gap-4">
            <span>🔴 {logs.filter(l => l.level === 'ERROR').length}</span>
            <span>🟡 {logs.filter(l => l.level === 'WARN').length}</span>
            <span>🔵 {logs.filter(l => l.level === 'INFO').length}</span>
            <span>🟣 {logs.filter(l => l.level === 'DEBUG').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}