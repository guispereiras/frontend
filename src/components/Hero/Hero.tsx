import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Download, MapPin } from 'lucide-react';
import ContactModal from '../Contacs/Contacs'; // Import the ContactModal
import './Hero.css';

const Hero: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const titles = [
    'Full-Stack Developer',
    'Mechatronics Engineer', 
    'Problem Solver',
    'Tech Enthusiast'
  ];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = titles[currentTitleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < currentTitle.length) {
          setTypedText(currentTitle.substring(0, typedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(currentTitle.substring(0, typedText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentTitleIndex, titles]);

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-particles">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 20}s`,
                  animationDuration: `${20 + Math.random() * 20}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-greeting">
                <span className="wave">👋</span>
                <span>Hello, I'm</span>
              </div>
              
              <h1 className="hero-name">
                Guilherme <span className="highlight">Pereira</span>
              </h1>
              
              <div className="hero-title">
                <span className="typing-text">{typedText}</span>
                <span className="cursor">|</span>
              </div>
              
              <p className="hero-description">
                Junior Software Developer with a background in Mechatronics Engineering. 
                Currently living in the United States, passionate about building real-world 
                solutions through code and expanding my skills in full-stack development.
              </p>

              <div className="hero-location">
                <MapPin size={16} />
                <span>United States</span>
              </div>
              
              <div className="hero-actions">
                <button 
                  onClick={openContactModal}
                  className="btn btn-primary"
                >
                  <Mail size={18} />
                  Get In Touch
                </button>
                
                <a 
                  href="/resume.pdf" 
                  className="btn btn-secondary"
                  download
                >
                  <Download size={18} />
                  Download CV
                </a>
              </div>
              
              <div className="hero-social">
                <a 
                  href="https://github.com/guispereiras" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/guilherme-da-silva-pereira-7b503b19b/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
                <button 
                  onClick={openContactModal}
                  className="social-contact-btn"
                  aria-label="Email"
                >
                  <Mail size={24} />
                </button>
              </div>
            </div>
            
            <div className="hero-image">
              <div className="image-container">
                <img 
                  src="/images/profile.png"  // sem import
                  alt="Guilherme Pereira"
                  className="profile-image"
                  onError={(e) => {
                    // Fallback caso a imagem não carregue
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x400/667eea/white?text=GP";
                  }}
                />
                <div className="image-border"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={closeContactModal} 
      />
    </>
  );
};

export default Hero;