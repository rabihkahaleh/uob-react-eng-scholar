import React from 'react';
import { ArrowRight, Search, Users, Handshake } from 'lucide-react';

export default function HeroSection({ onExploreClick, onSearchClick, onCollaborateClick }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-backdrop">
        <img
          src="/hero_research_lab.png"
          alt="University of Balamand Engineering Research Facility"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-badge">University of Balamand</span>
            <span className="hero-eyebrow-text">Faculty of Engineering Research Hub</span>
          </div>

          <h1 className="hero-heading">
            Advancing Knowledge.<br />
            Creating Meaningful Impact.
          </h1>

          <p className="hero-description">
            Explore the cutting-edge engineering research, scholar expertise, interdisciplinary projects,
            and peer-reviewed contributions from the Faculty of Engineering at the University of Balamand.
          </p>

          <div className="hero-actions">
            <a href="#research-areas" className="btn-primary" onClick={onExploreClick}>
              Explore Our Research <ArrowRight size={16} />
            </a>

            <a href="#researchers" className="btn-secondary-link" onClick={onSearchClick}>
              <Search size={15} /> Find a Researcher
            </a>

            <a href="#opportunities" className="btn-tertiary-link" onClick={onCollaborateClick}>
              <Handshake size={15} /> Collaborate With Us
            </a>
          </div>
        </div>

        <div className="hero-card-badge">
          <div className="hero-badge-header">
            <Users size={18} className="hero-badge-icon" />
            <span>Institutional Research Excellence</span>
          </div>
          <p className="hero-badge-body">
            Empowering innovation across Civil, Electrical, Mechanical, Chemical, Computer, and Sustainability Engineering disciplines.
          </p>
        </div>
      </div>
    </section>
  );
}
