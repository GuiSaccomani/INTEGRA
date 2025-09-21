import { useState } from 'react';

export default function LogTabs({ logs, onFilterChange }) {
  const [activeTab, setActiveTab] = useState('all');
  
  const tabs = [
    { id: 'all', label: 'Todos', count: logs.length, color: 'bg-gray-500' },
    { id: 'info', label: 'Info', count: logs.filter(l => l.level === 'INFO').length, color: 'bg-blue-500' },
    { id: 'warn', label: 'Avisos', count: logs.filter(l => l.level === 'WARN').length, color: 'bg-yellow-500' },
    { id: 'error', label: 'Erros', count: logs.filter(l => l.level === 'ERROR').length, color: 'bg-red-500' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onFilterChange(tabId);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-white shadow-xl text-black scale-105 border-2 border-gray-200'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          <div className={`w-4 h-4 rounded-full ${
            activeTab === tab.id ? 'bg-black' : 'bg-white'
          }`}></div>
          <span className="font-semibold">{tab.label}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            activeTab === tab.id 
              ? 'bg-black text-white' 
              : 'bg-white text-black'
          }`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}