import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Eye,
  Heart,
  Award,
  Lightbulb,
  Wrench,
} from "lucide-react";
import axios from "axios";
import "./ProjectDetail.css";

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl: string;
  images?: string[];
  category: string;
  status: string;
  startDate: string;
  endDate?: string;
  featured: boolean;
  achievements?: string[];
  challenges?: string[];
  learnings?: string[];
  views: number;
  likes: number;
  tags: string[];
}

interface ProjectDetailProps {
  projectId?: string;
  onBack?: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, onBack }) => {
  // Simulando useParams - você pode passar o ID como prop ou usar context
  const id = projectId || "1"; // ID padrão para exemplo
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProject(id);
      trackProjectView(id);
    }
  }, [id]);

  const fetchProject = async (projectId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/projects/${projectId}`
      );
      setProject(response.data);
    } catch (err) {
      setError("Project not found");
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  const trackProjectView = async (projectId: string) => {
    try {
      await axios.post("http://localhost:5000/api/analytics/project", {
        projectId,
        action: "view",
      });
    } catch (err) {
      console.log("Analytics tracking failed:", err);
    }
  };

  const handleLike = async () => {
    if (!project || liked) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/projects/${project._id}/like`
      );
      setProject((prev) =>
        prev ? { ...prev, likes: response.data.likes } : null
      );
      setLiked(true);

      // Track like in analytics
      await axios.post("http://localhost:5000/api/analytics/project", {
        projectId: project._id,
        action: "like",
      });
    } catch (err) {
      console.error("Error liking project:", err);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Fallback para navegação manual ou history.back()
      window.history.back();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getDuration = () => {
    if (!project) return "";

    const start = new Date(project.startDate);
    const end = project.endDate ? new Date(project.endDate) : new Date();
    const months = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    if (months < 1) return "< 1 month";
    return months === 1 ? "1 month" : `${months} months`;
  };

  if (loading) {
    return (
      <div className="project-detail-container">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-container">
        <div className="container">
          <div className="error-state">
            <h2>Project Not Found</h2>
            <p>
              The project you're looking for doesn't exist or has been removed.
            </p>
            <button onClick={handleBack} className="btn btn-primary">
              <ArrowLeft size={18} />
              Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images =
    project.images && project.images.length > 0
      ? project.images
      : [project.imageUrl];

  return (
    <div className="project-detail-container">
      <div className="container">
        {/* Header */}
        <div className="project-header">
          <button onClick={handleBack} className="back-link">
            <ArrowLeft size={20} />
            Back to Portfolio
          </button>

          <div className="project-meta">
            <span className={`status-badge ${project.status}`}>
              {project.status.replace("-", " ")}
            </span>
            {project.featured && (
              <span className="featured-badge">
                <Award size={16} />
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="project-content">
          <div className="project-info">
            <h1 className="project-title">{project.title}</h1>

            <div className="project-stats">
              <div className="stat">
                <Eye size={16} />
                <span>{project.views} views</span>
              </div>
              <div className="stat">
                <Heart size={16} />
                <span>{project.likes} likes</span>
              </div>
              <div className="stat">
                <Calendar size={16} />
                <span>{getDuration()}</span>
              </div>
            </div>

            <p className="project-description">{project.description}</p>

            {project.longDescription && (
              <div className="project-long-description">
                <h3>About This Project</h3>
                <p>{project.longDescription}</p>
              </div>
            )}

            <div className="project-actions">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <Github size={18} />
                  View Code
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <ExternalLink size={18} />
                  Live Demo
                </a>
              )}

              <button
                onClick={handleLike}
                className={`btn btn-like ${liked ? "liked" : ""}`}
                disabled={liked}
              >
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
                {liked ? "Liked!" : "Like"}
              </button>
            </div>
          </div>

          <div className="project-gallery">
            <div className="image-container">
              <img
                src={images[currentImageIndex]}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className="project-image"
              />

              {images.length > 1 && (
                <div className="image-navigation">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`image-dot ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="project-section">
            <h3>
              <Wrench size={20} />
              Technologies Used
            </h3>
            <div className="tech-tags">
              {project.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.achievements && project.achievements.length > 0 && (
          <div className="project-section">
            <h3>
              <Award size={20} />
              Key Achievements
            </h3>
            <ul className="achievement-list">
              {project.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}

        {project.challenges && project.challenges.length > 0 && (
          <div className="project-section">
            <h3>
              <Lightbulb size={20} />
              Challenges & Solutions
            </h3>
            <ul className="challenge-list">
              {project.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
        )}

        {project.learnings && project.learnings.length > 0 && (
          <div className="project-section">
            <h3>
              <Lightbulb size={20} />
              Key Learnings
            </h3>
            <ul className="learning-list">
              {project.learnings.map((learning, index) => (
                <li key={index}>{learning}</li>
              ))}
            </ul>
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="project-section">
            <h3>Tags</h3>
            <div className="project-tags">
              {project.tags.map((tag, index) => (
                <span key={index} className="project-tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
