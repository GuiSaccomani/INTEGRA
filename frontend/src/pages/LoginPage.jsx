import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { logSender } from '../services/logSender.js';

export default function LoginPage({ onLogin }) {
  const { isDark, toggleTheme } = useTheme();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validar credenciais
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', credentials.username);
        
        // Registrar login (sem await para não bloquear)
        logSender.logUserAction('fez login no sistema', {
          username: credentials.username,
          timestamp: new Date().toISOString()
        }).catch(() => {});
        
        onLogin(true);
      } else {
        // Registrar tentativa falhada (sem await)
        logSender.logUserAction('tentativa de login falhada', {
          username: credentials.username,
          reason: 'credenciais inválidas'
        }).catch(() => {});
        
        setError('Usuário ou senha incorretos');
      }
      
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro interno do sistema');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
            <img src="/logo-integra.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Log Viewer</h1>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Faça login para acessar o sistema
          </p>
        </div>

        {/* Login Form */}
        <div className={`rounded-2xl shadow-xl p-8 backdrop-blur-sm ${isDark ? 'bg-black border border-gray-600' : 'bg-white border border-gray-200'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className={`p-3 rounded-xl text-sm ${isDark ? 'bg-red-900 text-red-300 border border-red-700' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                Usuário
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
                className={`w-full border-2 rounded-xl px-4 py-3 transition-all ${isDark ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-white' : 'border-gray-300 bg-white text-black placeholder-gray-500 focus:border-black'}`}
                placeholder="Digite seu usuário"
              />
            </div>

            {/* Password */}
            <div>
              <label className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                Senha
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                className={`w-full border-2 rounded-xl px-4 py-3 transition-all ${isDark ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-white' : 'border-gray-300 bg-white text-black placeholder-gray-500 focus:border-black'}`}
                placeholder="Digite sua senha"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                isLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : (isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800')
              }`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Credenciais de demonstração:
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Usuário: <span className="font-mono">admin</span><br/>
              Senha: <span className="font-mono">admin</span>
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="text-center mt-6">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  );
}