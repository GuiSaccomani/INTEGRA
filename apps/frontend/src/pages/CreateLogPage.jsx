import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { api } from '../services/api.js';
import { SunIcon, MoonIcon } from '../components/Icons.jsx';

export default function CreateLogPage() {
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    service_id: '',
    level: 'INFO',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [services, setServices] = useState([
    { id: 1, name: 'Sincronização' },
    { id: 2, name: 'Captura' }
  ]);

  // Carregar serviços do backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Criar log via API
      await api.createLog({
        service_id: parseInt(formData.service_id),
        level: formData.level,
        message: formData.message
      });
      
      setSuccess(true);
      setFormData({ service_id: '', level: 'INFO', message: '' });
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      console.error('Erro ao criar log:', error);
      alert('Erro ao criar log.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <div className={`shadow-2xl border-b-2 backdrop-blur-sm ${isDark ? 'bg-black border-gray-600' : 'bg-white/95 border-gray-200'}`}>
        <div className="px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-white' : 'bg-black'}`}>
                <img src="/logo-integra.png" alt="Logo" className={`w-6 h-6 sm:w-8 sm:h-8 object-contain ${isDark ? '' : 'filter invert'}`} />
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Criar Log</h1>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Adicione novos logs ao sistema
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
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
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
              ✅ Log criado com sucesso!
            </div>
          )}

          {/* Form */}
          <div className={`rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-sm ${isDark ? 'bg-black border border-gray-600' : 'bg-white/90 border border-gray-100'}`}>
            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Novo Log</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  Serviço
                </label>
                <select
                  value={formData.service_id}
                  onChange={(e) => setFormData({...formData, service_id: e.target.value})}
                  required
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm sm:text-base ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'}`}
                >
                  <option value="">Selecione um serviço</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  Nível
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['INFO', 'WARN', 'ERROR', 'DEBUG'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({...formData, level})}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        formData.level === level
                          ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                          : (isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-black hover:bg-gray-200')
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  Mensagem
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  rows={4}
                  placeholder="Digite a mensagem do log..."
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm sm:text-base resize-none ${isDark ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-black placeholder-gray-500'}`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : (isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800')
                }`}
              >
                {isSubmitting ? 'Criando...' : 'Criar Log'}
              </button>
            </form>
          </div>

          {/* Preview */}
          {formData.message && (
            <div className={`mt-6 rounded-2xl shadow-xl p-6 backdrop-blur-sm ${isDark ? 'bg-black border border-gray-600' : 'bg-white/90 border border-gray-100'}`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Preview</h3>
              <div className={`p-4 rounded-lg font-mono text-sm ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date().toLocaleString()}
                </span>
                <span className={`ml-3 font-bold ${
                  formData.level === 'ERROR' ? 'text-red-500' :
                  formData.level === 'WARN' ? 'text-yellow-500' :
                  formData.level === 'INFO' ? 'text-blue-500' : 'text-purple-500'
                }`}>
                  [{formData.level}]
                </span>
                <span className={`ml-3 ${isDark ? 'text-white' : 'text-black'}`}>
                  {formData.message}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}