import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Send, CheckCircle, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import './Contact.css';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitStatus('idle');
      setStatusMessage('');
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await axios.post('/api/contact', formData);
      setSubmitStatus('success');
      setStatusMessage('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Auto-close modal after successful submission (optional)
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage('Sorry, there was an error sending your message. Please try again or use the direct contact information below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const contactInfo = [
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'guilherme.pereira@example.com',
      link: 'mailto:guilherme.pereira@example.com'
    },
    {
      icon: <Phone size={20} />,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <MapPin size={20} />,
      label: 'Location',
      value: 'United States',
      link: null
    }
  ];

  const socialLinks = [
    {
      icon: <Github size={20} />,
      label: 'GitHub',
      value: '@guispereiras',
      link: 'https://github.com/guispereiras'
    },
    {
      icon: <Linkedin size={20} />,
      label: 'LinkedIn',
      value: 'Guilherme Pereira',
      link: 'https://www.linkedin.com/in/guilherme-da-silva-pereira-7b503b19b/'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="contact-info-compact">
            <div className="contact-intro">
              <p>
                Ready to discuss opportunities or collaborate on exciting projects? Let's connect!
              </p>
            </div>

            <div className="contact-details-compact">
              <div className="contact-list-compact">
                {contactInfo.map((item, index) => (
                  <div key={index} className="contact-item-compact">
                    <div className="contact-icon-compact">
                      {item.icon}
                    </div>
                    {item.link ? (
                      <a href={item.link} className="contact-value-compact">
                        {item.value}
                      </a>
                    ) : (
                      <span className="contact-value-compact">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="social-links-compact">
              <div className="social-list-compact">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-compact"
                    title={`${social.label}: ${social.value}`}
                  >
                    <div className="social-icon-compact">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="availability-compact">
              <div className="availability-status-compact">
                <div className="status-indicator available"></div>
                <span>Available for new opportunities</span>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Send Me a Message</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="What's this about?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              {submitStatus !== 'idle' && (
                <div className={`status-message ${submitStatus}`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}
                  <span>{statusMessage}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;