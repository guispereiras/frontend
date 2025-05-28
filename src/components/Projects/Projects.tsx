import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Calendar, Award } from 'lucide-react';
import axios from 'axios';
import './Projects.css';

interface Project {
  _id: string;
  title: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl: string;
  category: string;
  startDate: string;
  endDate?: string;
  featured: boolean;
  achievements?: string[];
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Static projects data (fallback)
  const staticProjects: Project[] = [
    {
      _id: '1',
      title: 'FPUT Paradox Physical Simulator',
      technologies: ['Python', 'NumPy', 'Matplotlib', 'SciPy'],
      githubUrl: 'https://github.com/guispereiras',
      imageUrl: '/images/FPTU.jpeg',
      category: 'simulation',
      startDate: '2025-04-01',
      featured: true,
      achievements: ['Published in FATEC-SP Technical Bulletin', 'Honorable Mention Award']
    },
    {
      _id: '2',
      title: 'WhatsApp Auto-Reply Bot',
      technologies: ['Python', 'Selenium', 'AI APIs', 'Web Automation'],
      githubUrl: 'https://github.com/guispereiras',
      imageUrl: '/images/wppBotReply.png',
      category: 'automation',
      startDate: '2025-04-01',
      featured: true
    },
    {
      _id: '3',
      title: 'LissToDo - Task Manager',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Python', 'Flask'],
      githubUrl: 'https://github.com/guispereiras',
      imageUrl: '/images/lissToDo.png',
      category: 'web',
      startDate: '2023-11-01',
      featured: false
    },
    {
      _id: '4',
      title: 'Industrial Autonomous Car',
      technologies: ['PLC Programming', 'Mechanical Engineering', 'Industrial Automation'],
      imageUrl: '/images/industrialAutonomousCar.png',
      category: 'engineering',
      startDate: '2022-08-01',
      endDate: '2023-06-01',
      featured: false
    },
    {
      _id: '6',
      title: 'Data Pipeline Integration',
      technologies: ['JSON', 'Database Integration', 'Data Engineering'],
      imageUrl: '/images/dataPipeline.png',
      category: 'data',
      startDate: '2024-03-01',
      featured: false
    }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.log('Using static data - API not available');
      setProjects(staticProjects);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'all', label: 'All Projects' },
    { key: 'simulation', label: 'Simulation' },
    { key: 'web', label: 'Web Apps' },
    { key: 'automation', label: 'Automation' },
    { key: 'iot', label: 'IoT' },
    { key: 'engineering', label: 'Engineering' },
    { key: 'data', label: 'Data' }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  const featuredProjects = projects.filter(project => project.featured);

  if (loading) {
    return (
      <section id="projects" className="section projects-section">
        <div className="container">
          <div className="loading">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="section-subtitle">
            Here are some of my recent projects that demonstrate my skills in various technologies
          </p>
        </div>

        {/* Featured Projects */}
        <div className="featured-projects">
          <h3 className="subsection-title">Featured Work</h3>
          <div className="grid grid-cols-2">
            {featuredProjects.slice(0, 4).map((project) => (
              <ProjectCard key={project._id} project={project} featured />
            ))}
          </div>
        </div>

        {/* All Projects with Filter */}
        <div className="all-projects">
          <div className="projects-header">
            <h3 className="subsection-title">All Projects</h3>
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category.key}
                  className={`filter-btn ${filter === category.key ? 'active' : ''}`}
                  onClick={() => setFilter(category.key)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`project-card ${featured ? 'featured' : ''}`}>
      <div className="project-image">
        <img src={project.imageUrl} alt={project.title} />
        <div className="project-overlay">
          <div className="project-links">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
                aria-label="View on GitHub"
              >
                <Github size={20} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
                aria-label="View live demo"
              >
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="project-content">
          <h4 className="project-title">{project.title}</h4>
      
        {project.achievements && project.achievements.length > 0 && (
          <div className="project-achievements">
            <Award size={16} />
            <div className="achievements-list">
              {project.achievements.map((achievement, index) => (
                <span key={index} className="achievement-badge">
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="project-technologies">
          {project.technologies.map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;