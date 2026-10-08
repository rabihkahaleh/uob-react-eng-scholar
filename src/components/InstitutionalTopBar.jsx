import React from 'react';
import { Globe, Accessibility, PhoneCall, ExternalLink } from 'lucide-react';

export default function InstitutionalTopBar() {
  return (
    <div className="inst-topbar">
      <div className="inst-topbar-container">
        <div className="inst-topbar-left">
          <span className="inst-topbar-uni">University of Balamand</span>
          <span className="inst-topbar-divider">|</span>
          <a
            href="https://www.balamand.edu.lb"
            target="_blank"
            rel="noopener noreferrer"
            className="inst-topbar-link"
          >
            Main University Website <ExternalLink size={11} className="inline-icon" />
          </a>
          <span className="inst-topbar-divider">|</span>
          <a href="#faculty" className="inst-topbar-link">
            Faculty of Engineering
          </a>
        </div>
        
        <div className="inst-topbar-right">
          <a href="#contact" className="inst-topbar-link">
            <PhoneCall size={12} /> Contact Research Office
          </a>
          <span className="inst-topbar-divider">|</span>
          <button className="inst-topbar-btn" title="Accessibility Options" aria-label="Accessibility Options">
            <Accessibility size={13} /> Accessibility
          </button>
          <span className="inst-topbar-divider">|</span>
          <div className="inst-topbar-lang">
            <Globe size={13} />
            <span>EN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
