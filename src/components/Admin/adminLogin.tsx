import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import './AdminLogin.css';

interface AdminLoginProps {
  onLogin: (token: string, user: any) => void;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        username,
        password
      });

      if (response.data.token) {
        // Salvar token no localStorage
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        
        // Chamar callback de sucesso
        onLogin(response.data.token, response.data.user);
        
        // Mostrar mensagem de sucesso
        setError('');
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: any) {
      setAttempts(prev => prev + 1);
      
      if (err.response?.status === 401) {
        setError('Credenciais inválidas. Acesso negado.');
      } else if (err.response?.status === 429) {
        setError('Muitas tentativas. Tente novamente em alguns minutos.');
      } else {
        setError('Erro de conexão. Verifique se o servidor está ativo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="admin-logo">
            <Lock size={32} />
          </div>
          <h2>Acesso Administrativo</h2>
          <p>Área restrita - Apenas administradores autorizados</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">
              <User size={16} />
              Usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={16} />
              Senha
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {attempts > 0 && !error && (
            <div className="warning-message">
              <AlertCircle size={16} />
              <span>Tentativa {attempts}/5</span>
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading || attempts >= 5}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Autenticando...
              </>
            ) : (
              <>
                <Lock size={16} />
                Acessar Painel
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <div className="security-notice">
            <AlertCircle size={14} />
            <span>Todas as tentativas de acesso são registradas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;