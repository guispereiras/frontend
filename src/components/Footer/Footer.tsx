import React, { useState } from "react";
import { Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";
import "./Footer.css";
import ContactModal from "../Contacs/Contacs";

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };
  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  const socialLinks = [
    {
      icon: <Github size={20} />,
      href: "https://github.com/guispereiras",
      label: "GitHub",
      color: "#333",
    },
    {
      icon: <Linkedin size={20} />,
      href: "https://www.linkedin.com/in/guilherme-da-silva-pereira-7b503b19b/",
      label: "LinkedIn",
      color: "#0077b5",
    },
    {
      icon: <Mail size={20} />,
      href: "mailto:guilherme.pereira@example.com",
      label: "Email",
      color: "#ea4335",
    },
  ];

  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-main">
            <div className="footer-section footer-brand">
              <h3 className="footer-logo">Guilherme Pereira</h3>
              <p className="footer-description">
                Full-Stack Developer & Mechatronics Engineer passionate about
                creating innovative solutions that bridge hardware and software.
              </p>
              <div className="footer-social">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={social.label}
                    style={
                      { "--hover-color": social.color } as React.CSSProperties
                    }
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Quick Links</h4>
              <nav className="footer-nav">
                {quickLinks.map((link, index) => (
                  <a key={index} href={link.href} className="footer-link">
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Skills & Expertise</h4>
              <div className="footer-skills">
                <span className="skill-tag">React</span>
                <span className="skill-tag">TypeScript</span>
                <span className="skill-tag">Python</span>
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">AWS</span>
                <span className="skill-tag">IoT</span>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Get In Touch</h4>
              <div className="footer-contact">
                <p>Currently based in the United States</p>
                <p>Available for new opportunities</p>
                <div className="hero-actions">
                  <button
                    onClick={openContactModal}
                    className="btn btn-primary"
                  >
                    <Mail size={18} />
                    Get In Touch
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <div className="footer-copyright">
                <p>
                  © {currentYear} Guilherme Pereira. Made with{" "}
                  <Heart size={16} className="heart-icon" /> using React &
                  TypeScript
                </p>
              </div>

              <div className="footer-meta">
                <span className="status-indicator">
                  <span className="status-dot"></span>
                  Available for hire
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="scroll-to-top"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
      {/* Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </footer>
  );
};

export default Footer;
