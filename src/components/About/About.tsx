import React, { useState, useEffect } from 'react';
import { Code, Zap, Users, Award, BookOpen, Plane } from 'lucide-react';
import axios from 'axios';
import './About.css';

interface Skill {
  name: string;
  level: number;
  category: string;
}

const About: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  const fetchSkills = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/skills');
    setSkills(response.data);
  } catch (error) {
    console.error('Error fetching skills:', error);
    // Opcional: manter alguns dados de fallback ou mostrar mensagem de erro
    setSkills([]);
  }
};

  useEffect(() => {
    fetchSkills();
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="section-subtitle">
            Passionate developer with a unique background combining software engineering and mechatronics
          </p>
        </div>

        <div className="about-content">
          <div className="about-story">
            <div className="story-card">
              <div className="story-header">
                <BookOpen className="story-icon" />
                <h3>My Journey</h3>
              </div>
              <p>
                I'm a Junior Software Developer with a strong foundation in Mechatronics Engineering from FATEC-SP, 
                where I received an Honorable Mention for outstanding research in data acquisition and energy transmission systems.
              </p>
              <p>
                Currently working as a trainee in Systems Analysis and Development, I focus on frontend technologies 
                while actively expanding my backend skills with Node.js and AWS services. My unique engineering background 
                gives me a problem-solving approach that bridges hardware and software solutions.
              </p>
            </div>

            <div className="story-card">
              <div className="story-header">
                <Plane className="story-icon" />
                <h3>Living the Dream</h3>
              </div>
              <p>
                Currently living in the United States and preparing to start a Computer Science degree. 
                This international experience is broadening my perspective and preparing me for global opportunities 
                in the tech industry.
              </p>
              <p>
                My goal is to grow as a full-stack developer and contribute to international projects that 
                combine software engineering, data analysis, and automation solutions.
              </p>
            </div>
          </div>

          <div className="about-highlights">
            <div className="highlight-card">
              <div className="highlight-icon">
                <Code size={32} />
              </div>
              <h4>Full-Stack Development</h4>
              <p>Building complete solutions from frontend interfaces to backend APIs and databases</p>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon">
                <Zap size={32} />
              </div>
              <h4>Automation & IoT</h4>
              <p>Creating smart systems that bridge the physical and digital worlds</p>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon">
                <Users size={32} />
              </div>
              <h4>Collaborative Mindset</h4>
              <p>Experience in agile teams, code reviews, and cross-functional collaboration</p>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon">
                <Award size={32} />
              </div>
              <h4>Research Excellence</h4>
              <p>Published research in physics simulation and nonlinear systems analysis</p>
            </div>
          </div>
        </div>

        <div className="skills-section">
          <h3 className="skills-title">Technical Skills</h3>
          <div className="skills-grid">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="skill-category">
                <h4 className="category-title">{category}</h4>
                <div className="skills-list">
                  {categorySkills.map((skill) => (
                    <div key={skill.name} className="skill-item">
                      <div className="skill-header">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div 
                          className="skill-progress"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="achievements-section">
          <h3 className="achievements-title">Key Achievements</h3>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-number">2022</div>
              <div className="achievement-content">
                <h4>Honorable Mention Award</h4>
                <p>Received recognition for outstanding research presentation at FATEC-SP's 24th Scientific Congress</p>
              </div>
            </div>
            
            <div className="achievement-card">
              <div className="achievement-number">2023</div>
              <div className="achievement-content">
                <h4>Published Research</h4>
                <p>Published research papers on FPUT Paradox and KdV Solitons in FATEC-SP Technical Bulletin</p>
              </div>
            </div>
            
            <div className="achievement-card">
              <div className="achievement-number">2022</div>
              <div className="achievement-content">
                <h4>Private Pilot License</h4>
                <p>Obtained Private Pilot License, demonstrating precision, safety awareness, and technical skills</p>
              </div>
            </div>
            
            <div className="achievement-card">
              <div className="achievement-number">2025</div>
              <div className="achievement-content">
                <h4>International Experience</h4>
                <p>Currently living and studying in the United States, expanding global perspective</p>
              </div>
            </div>
          </div>
        </div>

        <div className="languages-section">
          <h3 className="languages-title">Languages</h3>
          <div className="languages-grid">
            <div className="language-item">
              <div className="language-header">
                <span className="language-name">Portuguese</span>
                <span className="language-level">Native</span>
              </div>
              <div className="language-bar">
                <div className="language-progress" style={{ width: '100%' }} />
              </div>
            </div>
            
            <div className="language-item">
              <div className="language-header">
                <span className="language-name">English</span>
                <span className="language-level">Advanced</span>
              </div>
              <div className="language-bar">
                <div className="language-progress" style={{ width: '90%' }} />
              </div>
            </div>
            
            <div className="language-item">
              <div className="language-header">
                <span className="language-name">Spanish</span>
                <span className="language-level">Intermediate</span>
              </div>
              <div className="language-bar">
                <div className="language-progress" style={{ width: '65%' }} />
              </div>
            </div>
            
            <div className="language-item">
              <div className="language-header">
                <span className="language-name">Japanese</span>
                <span className="language-level">Basic</span>
              </div>
              <div className="language-bar">
                <div className="language-progress" style={{ width: '30%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;