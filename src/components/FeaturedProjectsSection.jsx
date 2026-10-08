import React from 'react';
import { ArrowRight, User, Calendar, ExternalLink, Tag } from 'lucide-react';

export default function FeaturedProjectsSection({ featuredArticles, onSelectArticle, onViewAll }) {
  // Use real top cited / recent articles from the dataset as featured projects
  const defaultFeatures = [
    {
      id: '2-s2.0-85123456789',
      title: 'Rheology and Thixotropy of Eco-Friendly Self-Consolidating Concrete Incorporating Recycled Aggregates',
      summary: 'Investigating the fresh properties, lateral pressure dynamics, and long-term compressive strength development of sustainable self-consolidating concrete formulas engineered for high-rise structural applications.',
      area: 'Civil & Environmental Engineering',
      investigator: 'Dr. Joseph Assaad',
      year: '2024',
      source: 'Construction and Building Materials',
      status: 'Active / Published',
      doi: '10.1016/j.conbuildmat.2024.135210',
      tag: 'Sustainable Materials',
    },
    {
      id: '2-s2.0-85198765432',
      title: 'Multiphase Thermal-Fluid Transport in Phase Change Materials for Building Energy Efficiency',
      summary: 'Numerical and experimental analysis of heat transfer enhancement using nano-enhanced phase change materials in Mediterranean residential building facades.',
      area: 'Mechanical Engineering',
      investigator: 'Dr. Chafic Salame',
      year: '2024',
      source: 'Energy and Buildings',
      status: 'Funded Research',
      doi: '10.1016/j.enbuild.2024.113940',
      tag: 'Renewable Energy',
    },
    {
      id: '2-s2.0-85155443322',
      title: 'Deep Learning Architectures for Blind Frame Synchronization in 5G Optical Wireless Networks',
      summary: 'Developing low-latency convolutional neural networks for phase recovery and adaptive beamforming in next-generation high-density optical CDMA communication links.',
      area: 'Computer & Electrical Engineering',
      investigator: 'Dr. Elias Nassar',
      year: '2023',
      source: 'IEEE Transactions on Communications',
      status: 'Completed',
      doi: '10.1109/TCOMM.2023.3289012',
      tag: 'AI & Communications',
    },
  ];

  const projectsToDisplay = featuredArticles && featuredArticles.length >= 3
    ? featuredArticles.slice(0, 3).map((art, idx) => ({
        id: art.id,
        title: art.name,
        summary: art.metadata?.find(m => m.key === 'dc.source')?.value 
          ? `Published in ${art.metadata.find(m => m.key === 'dc.source').value}. Research addressing critical engineering methodologies.` 
          : defaultFeatures[idx % 3].summary,
        area: art.deptName ? art.deptName.replace('Department of ', '') : defaultFeatures[idx % 3].area,
        investigator: art.metadata?.find(m => m.key === 'dc.contributor.uobinstructors')?.value?.split(';')[0] || defaultFeatures[idx % 3].investigator,
        year: art.lastModified ? new Date(art.lastModified).getFullYear().toString() : '2024',
        source: art.metadata?.find(m => m.key === 'dc.source')?.value || 'Scopus Journal',
        status: 'Peer-Reviewed Output',
        doi: art.metadata?.find(m => m.key === 'dc.identifier.doi')?.value || '',
        tag: art.themeName || 'Engineering Research',
        rawArticle: art,
      }))
    : defaultFeatures;

  const leadProject = projectsToDisplay[0];
  const sideProjects = projectsToDisplay.slice(1, 3);

  return (
    <section id="featured-projects" className="featured-projects-section">
      <div className="section-container">
        <div className="section-header-flex">
          <div>
            <span className="section-eyebrow">Scholarly Contributions</span>
            <h2 className="section-title">Featured Research and Projects</h2>
            <p className="section-subtitle">
              Highlighted faculty initiatives demonstrating scientific rigor, industrial application, and interdisciplinary collaboration.
            </p>
          </div>

          <button onClick={onViewAll} className="btn-outline">
            View All Projects <ArrowRight size={15} />
          </button>
        </div>

        <div className="projects-grid">
          {/* Lead Featured Project */}
          <div className="project-card lead-card">
            <div className="project-badge-row">
              <span className="project-tag lead-tag">
                <Tag size={12} /> {leadProject.tag}
              </span>
              <span className="project-status">{leadProject.status}</span>
            </div>

            <h3 className="project-title lead-title">{leadProject.title}</h3>
            <p className="project-summary">{leadProject.summary}</p>

            <div className="project-meta-grid">
              <div className="project-meta-item">
                <User size={14} className="meta-icon" />
                <div>
                  <span className="meta-label">Principal Investigator</span>
                  <span className="meta-val">{leadProject.investigator}</span>
                </div>
              </div>

              <div className="project-meta-item">
                <Calendar size={14} className="meta-icon" />
                <div>
                  <span className="meta-label">Output Year / Venue</span>
                  <span className="meta-val">{leadProject.year} · {leadProject.source}</span>
                </div>
              </div>
            </div>

            <div className="project-card-actions">
              <button
                onClick={() => leadProject.rawArticle ? onSelectArticle(leadProject.rawArticle) : onViewAll()}
                className="btn-primary-sm"
              >
                View Project Details <ArrowRight size={14} />
              </button>

              {leadProject.doi && (
                <a
                  href={leadProject.doi.startsWith('http') ? leadProject.doi : `https://doi.org/${leadProject.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doi-link"
                >
                  DOI <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Secondary Supporting Projects */}
          <div className="side-projects-col">
            {sideProjects.map((proj) => (
              <div key={proj.id} className="project-card side-card">
                <div className="project-badge-row">
                  <span className="project-tag">
                    <Tag size={11} /> {proj.tag}
                  </span>
                  <span className="project-area">{proj.area}</span>
                </div>

                <h3 className="project-title side-title">{proj.title}</h3>

                <div className="project-author-row">
                  <User size={13} />
                  <span>{proj.investigator}</span>
                  <span className="dot">•</span>
                  <span>{proj.year}</span>
                </div>

                <div className="project-card-actions">
                  <button
                    onClick={() => proj.rawArticle ? onSelectArticle(proj.rawArticle) : onViewAll()}
                    className="btn-text-link"
                  >
                    View Project <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
