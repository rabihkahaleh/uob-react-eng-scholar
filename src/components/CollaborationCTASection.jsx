import React from 'react';
import { ArrowRight, Mail, Handshake } from 'lucide-react';

export default function CollaborationCTASection({ onExploreClick, onContactClick }) {
  return (
    <section className="collaboration-cta-section">
      <div className="section-container">
        <div className="cta-box">
          <div className="cta-icon-wrapper">
            <Handshake size={32} />
          </div>

          <h2 className="cta-heading">Let’s Advance Research Together</h2>

          <p className="cta-text">
            Connect with our researchers, explore industry partnership opportunities, or discover how the Faculty of Engineering at the University of Balamand can support your research journey.
          </p>

          <div className="cta-actions">
            <a href="#opportunities" className="btn-cta-primary" onClick={onExploreClick}>
              Explore Collaboration Opportunities <ArrowRight size={16} />
            </a>

            <a href="#contact" className="btn-cta-secondary" onClick={onContactClick}>
              <Mail size={16} /> Contact the Research Office
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
