import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import AdminLogin from '../Admin/adminLogin';
import AdminDashboard from '../Admin/AdminDashboard';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Estados para o admin
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  
  // Estados para o menu secreto
  const [secretPressTimer, setSecretPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [secretPressCount, setSecretPressCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Verificar se já existe token salvo
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    
    if (savedToken && savedUser) {
      setAdminToken(savedToken);
      setAdminUser(JSON.parse(savedUser));
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Função para detectar pressão longa no nome
  const handleNameMouseDown = () => {
    const timer = setTimeout(() => {
      // Após 5 segundos de pressão
      setSecretPressCount(prev => prev + 1);
      
      if (secretPressCount >= 0) { // Primeira tentativa já abre
        setShowAdminLogin(true);
        setSecretPressCount(0);
        
        // Efeito visual sutil
        const nameElement = document.querySelector('.logo-text');
        if (nameElement) {
          nameElement.classList.add('secret-activated');
          setTimeout(() => {
            nameElement.classList.remove('secret-activated');
          }, 1000);
        }
      }
    }, 5000); // 5 segundos

    setSecretPressTimer(timer);
  };

  const handleNameMouseUp = () => {
    if (secretPressTimer) {
      clearTimeout(secretPressTimer);
      setSecretPressTimer(null);
    }
  };

  const handleNameMouseLeave = () => {
    if (secretPressTimer) {
      clearTimeout(secretPressTimer);
      setSecretPressTimer(null);
    }
  };

  // Funções admin
  const handleAdminLogin = (token: string, user: any) => {
    setAdminToken(token);
    setAdminUser(user);
    setShowAdminLogin(false);
    setShowAdminDashboard(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken(null);
    setAdminUser(null);
    setShowAdminDashboard(false);
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <a href="/" onClick={closeMenu}>
                <span 
                  className="logo-text"
                  onMouseDown={handleNameMouseDown}
                  onMouseUp={handleNameMouseUp}
                  onMouseLeave={handleNameMouseLeave}
                  onTouchStart={handleNameMouseDown}
                  onTouchEnd={handleNameMouseUp}
                  style={{ 
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Guilherme Pereira
                </span>
              </a>
            </div>

            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <a href="#about" onClick={closeMenu}>About</a>
              <a href="#projects" onClick={closeMenu}>Projects</a>
              <a href="#contact" onClick={closeMenu}>Contact</a>
              <a 
                href="https://github.com/guispereiras" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                GitHub
              </a>
            </nav>

            <button 
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin 
          onLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {/* Admin Dashboard */}
      {showAdminDashboard && adminToken && (
        <AdminDashboard 
          token={adminToken}
          user={adminUser}
          onLogout={handleAdminLogout}
        />
      )}
    </>
  );
};

export default Header;