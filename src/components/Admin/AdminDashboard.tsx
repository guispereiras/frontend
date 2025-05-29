import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  Mail,
  BarChart3,
  Code,
  Folder,
  User,
  Save,
  X,
  Database
} from 'lucide-react';
import axios from 'axios';
import './AdminDashboard.css';

interface Project {
  startDate: any;
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl: string;
  category: string;
  featured: boolean;
  views: number;
  likes: number;
}

interface Skill {
  _id: string;
  name: string;
  level: number;
  category: string;
}

interface AdminDashboardProps {
  token: string;
  user: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showDatabaseViewer, setShowDatabaseViewer] = useState(false);

  // Configurar axios com token
  const api = axios.create({
    baseURL: 'http://localhost:5000/api/admin',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardRes, projectsRes, skillsRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/projects'),
        api.get('/skills')
      ]);

      setStats(dashboardRes.data.stats);
      setProjects(projectsRes.data.projects || projectsRes.data);
      setSkills(skillsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este projeto?')) return;
    
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      window.alert('Erro ao deletar projeto');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta skill?')) return;
    
    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter(s => s._id !== id));
    } catch (error) {
      console.error('Erro ao deletar skill:', error);
      window.alert('Erro ao deletar skill');
    }
  };

  const handleSaveProject = async (project: Partial<Project>) => {
    try {
      console.log('Dados que serão enviados:', project);
      
      if (editingProject && editingProject._id) {
        // Atualizar projeto existente
        const response = await api.put(`/projects/${editingProject._id}`, project);
        setProjects(projects.map(p => p._id === editingProject._id ? response.data : p));
        console.log('Projeto atualizado:', response.data);
      } else {
        // Criar novo projeto
        const response = await api.post('/projects', project);
        setProjects([...projects, response.data]);
        console.log('Projeto criado:', response.data);
      }
      setEditingProject(null);
      await loadDashboardData(); // Recarregar dados
    } catch (error: any) {
      console.error('Erro detalhado ao salvar projeto:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      if (error.response?.data?.error) {
        window.alert(`Erro ao salvar projeto: ${error.response.data.error}`);
      } else if (error.response?.status === 400) {
        window.alert('Dados inválidos. Verifique se todos os campos obrigatórios estão preenchidos.');
      } else {
        window.alert('Erro ao salvar projeto. Verifique a conexão com o servidor.');
      }
    }
  };

  const handleSaveSkill = async (skill: Partial<Skill>) => {
    try {
      if (editingSkill) {
        // Atualizar
        const response = await api.put(`/skills/${editingSkill._id}`, skill);
        setSkills(skills.map(s => s._id === editingSkill._id ? response.data : s));
      } else {
        // Criar nova
        const response = await api.post('/skills', skill);
        setSkills([...skills, response.data]);
      }
      setEditingSkill(null);
    } catch (error) {
      console.error('Erro ao salvar skill:', error);
      window.alert('Erro ao salvar skill');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-admin">
          <div className="spinner-large"></div>
          <p>Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-title">
          <Settings size={24} />
          <h1>Painel Administrativo</h1>
        </div>
        <div className="admin-user">
          <User size={20} />
          <span>Olá, {user.username}</span>
          <button onClick={onLogout} className="logout-btn">
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="admin-nav">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} />
          Visão Geral
        </button>
        <button 
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          <Folder size={16} />
          Projetos ({projects.length})
        </button>
        <button 
          className={activeTab === 'skills' ? 'active' : ''}
          onClick={() => setActiveTab('skills')}
        >
          <Code size={16} />
          Skills ({skills.length})
        </button>
        <button 
          className={activeTab === 'database' ? 'active' : ''}
          onClick={() => setActiveTab('database')}
        >
          <Database size={16} />
          Banco de Dados
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Folder size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.projects || 0}</h3>
                  <p>Projetos</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Code size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.skills || 0}</h3>
                  <p>Skills</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Eye size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalViews || 0}</h3>
                  <p>Visualizações</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Heart size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalLikes || 0}</h3>
                  <p>Likes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-tab">
            <div className="tab-header">
              <h2>Gerenciar Projetos</h2>
              <button 
                className="add-btn"
                onClick={() => setEditingProject({} as Project)}
              >
                <Plus size={16} />
                Novo Projeto
              </button>
            </div>
            
            <div className="projects-list">
              {projects.map(project => (
                <div key={project._id} className="project-item">
                  <div className="project-info">
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                    <div className="project-meta">
                      <span className="category">{project.category}</span>
                      {project.featured && <span className="featured">Featured</span>}
                    </div>
                  </div>
                  <div className="project-actions">
                    <button onClick={() => setEditingProject(project)}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteProject(project._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-tab">
            <div className="tab-header">
              <h2>Gerenciar Skills</h2>
              <button 
                className="add-btn"
                onClick={() => setEditingSkill({} as Skill)}
              >
                <Plus size={16} />
                Nova Skill
              </button>
            </div>
            
            <div className="skills-list">
              {skills.map(skill => (
                <div key={skill._id} className="skill-item">
                  <div className="skill-info">
                    <h4>{skill.name}</h4>
                    <div className="skill-level">
                      <div className="level-bar">
                        <div 
                          className="level-fill" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                      <span>{skill.level}%</span>
                    </div>
                    <span className="skill-category">{skill.category}</span>
                  </div>
                  <div className="skill-actions">
                    <button onClick={() => setEditingSkill(skill)}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteSkill(skill._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="database-tab">
            <div className="tab-header">
              <h2>Visualizador do Banco de Dados</h2>
              <button 
                className="add-btn"
                onClick={() => setShowDatabaseViewer(true)}
              >
                <Database size={16} />
                Abrir Visualizador
              </button>
            </div>
            
            <div className="database-info">
              <div className="info-card">
                <Database size={32} />
                <h3>MongoDB Portfolio</h3>
                <p>Visualize e explore todos os dados do seu portfólio de forma interativa.</p>
                
                <div className="database-features">
                  <div className="feature-item">
                    <Eye size={16} />
                    <span>Visualizar todas as collections</span>
                  </div>
                  <div className="feature-item">
                    <Database size={16} />
                    <span>Exportar dados em JSON</span>
                  </div>
                  <div className="feature-item">
                    <BarChart3 size={16} />
                    <span>Estatísticas em tempo real</span>
                  </div>
                </div>
                
                <button 
                  className="open-viewer-btn"
                  onClick={() => setShowDatabaseViewer(true)}
                >
                  <Database size={20} />
                  Abrir Visualizador Completo
                </button>
              </div>
              
              <div className="quick-stats">
                <h4>Estatísticas Rápidas</h4>
                <div className="stats-grid-mini">
                  <div className="mini-stat">
                    <span className="stat-number">{stats.projects || 0}</span>
                    <span className="stat-label">Projetos</span>
                  </div>
                  <div className="mini-stat">
                    <span className="stat-number">{stats.skills || 0}</span>
                    <span className="stat-label">Skills</span>
                  </div>
                  <div className="mini-stat">
                    <span className="stat-number">{stats.contacts || 0}</span>
                    <span className="stat-label">Contatos</span>
                  </div>
                  <div className="mini-stat">
                    <span className="stat-number">{stats.totalViews || 0}</span>
                    <span className="stat-label">Views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals de edição */}
      {editingProject !== null && (
        <ProjectModal 
          project={editingProject}
          onSave={handleSaveProject}
          onClose={() => setEditingProject(null)}
        />
      )}

      {editingSkill !== null && (
        <SkillModal 
          skill={editingSkill}
          onSave={handleSaveSkill}
          onClose={() => setEditingSkill(null)}
        />
      )}

    </div>
  );
};

// Modal para editar projetos
const ProjectModal: React.FC<{
  project: Project;
  onSave: (project: Partial<Project>) => void;
  onClose: () => void;
}> = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: project.title || '',
    description: project.description || '',
    technologies: project.technologies?.join(', ') || '',
    githubUrl: project.githubUrl || '',
    liveUrl: project.liveUrl || '',
    imageUrl: project.imageUrl || '',
    category: project.category || 'web',
    featured: project.featured || false,
    startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.title.trim()) {
      window.alert('Título é obrigatório');
      return;
    }
    
    if (!formData.description.trim()) {
      window.alert('Descrição é obrigatória');
      return;
    }
    
    if (!formData.imageUrl.trim()) {
      window.alert('URL da imagem é obrigatória');
      return;
    }
    
    const projectData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      githubUrl: formData.githubUrl.trim() || undefined,
      liveUrl: formData.liveUrl.trim() || undefined,
      imageUrl: formData.imageUrl.trim(),
      category: formData.category,
      featured: formData.featured,
      startDate: formData.startDate
    };
    
    console.log('Enviando dados do projeto:', projectData);
    onSave(projectData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{project._id ? 'Editar Projeto' : 'Novo Projeto'}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Título do projeto"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          
          <textarea
            placeholder="Descrição"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
          
          <input
            type="text"
            placeholder="Tecnologias (separadas por vírgula)"
            value={formData.technologies}
            onChange={(e) => setFormData({...formData, technologies: e.target.value})}
          />
          
          <input
            type="url"
            placeholder="URL da imagem"
            value={formData.imageUrl}
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            required
          />
          
          <input
            type="url"
            placeholder="URL do GitHub (opcional)"
            value={formData.githubUrl}
            onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
          />
          
          <input
            type="url"
            placeholder="URL do projeto online (opcional)"
            value={formData.liveUrl}
            onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
          />
          
          <input
            type="date"
            placeholder="Data de início"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            required
          />
          
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="web">Web Apps</option>
            <option value="simulation">Simulação</option>
            <option value="automation">Automação</option>
            <option value="iot">IoT</option>
            <option value="engineering">Engenharia</option>
            <option value="data">Dados</option>
          </select>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({...formData, featured: e.target.checked})}
            />
            Projeto em destaque
          </label>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">
              <Save size={16} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para editar skills
const SkillModal: React.FC<{
  skill: Skill;
  onSave: (skill: Partial<Skill>) => void;
  onClose: () => void;
}> = ({ skill, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: skill.name || '',
    level: skill.level || 50,
    category: skill.category || 'Frontend'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{skill._id ? 'Editar Skill' : 'Nova Skill'}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Nome da skill"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          
          <div className="level-input">
            <label>Nível: {formData.level}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
            />
          </div>
          
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="Cloud">Cloud</option>
            <option value="Tools">Tools</option>
            <option value="AI/Data">AI/Data</option>
            <option value="Systems">Systems</option>
            <option value="Hardware">Hardware</option>
          </select>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">
              <Save size={16} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;