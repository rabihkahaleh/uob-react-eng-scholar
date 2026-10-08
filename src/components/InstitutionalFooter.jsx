import React from 'react';
import { Phone, Mail, MapPin, Globe, Shield, ExternalLink } from 'lucide-react';

export default function InstitutionalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="about" className="inst-footer">
      <div className="inst-footer-container">
        <div className="inst-footer-grid">
          {/* Col 1: Brand & Description */}
          <div className="footer-col brand-col">
            <div className="footer-logo-row">
              <img
                src="/FOE_logo.jpg"
                alt="Faculty of Engineering - University of Balamand"
                className="footer-logo"
              />
              <div>
                <span className="footer-uni-name">University of Balamand</span>
                <span className="footer-fac-name">Faculty of Engineering</span>
              </div>
            </div>

            <p className="footer-desc">
              The official research repository and knowledge discovery platform for the Faculty of Engineering at the University of Balamand. Indexing peer-reviewed publications, faculty expertise, and multi-disciplinary engineering projects.
            </p>

            <div className="footer-last-updated">
              <span>Last Repository Sync: <strong>September 2026</strong></span>
            </div>
          </div>

          {/* Col 2: Institutional Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Navigation</h4>
            <ul className="footer-links">
              <li><a href="#hero">Home / Overview</a></li>
              <li><a href="#research-areas">Research Areas & Tracks</a></li>
              <li><a href="#researchers">Faculty Researchers</a></li>
              <li><a href="#featured-projects">Featured Projects</a></li>
              <li><a href="#recent-publications">Recent Publications</a></li>
              <li><a href="#opportunities">Opportunities & Grants</a></li>
              <li><a href="#support-services">Support Services</a></li>
              <li><a href="#news-events">News & Events</a></li>
            </ul>
          </div>

          {/* Col 3: Research Governance & Policies */}
          <div className="footer-col">
            <h4 className="footer-col-title">Governance & Policies</h4>
            <ul className="footer-links">
              <li><a href="#ethics"><Shield size={12} className="inline-icon" /> Research Ethics & Integrity</a></li>
              <li><a href="#policies">Institutional Open-Access Policy</a></li>
              <li><a href="#data-policy">FAIR Data Management Guidelines</a></li>
              <li><a href="#ip">Intellectual Property & Licensing</a></li>
              <li><a href="#privacy">Privacy Notice & Terms</a></li>
              <li><a href="#accessibility">Accessibility Statement</a></li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="footer-col contact-col">
            <h4 className="footer-col-title" id="contact">Research Office Contact</h4>
            <div className="footer-contact-info">
              <div className="contact-item">
                <MapPin size={15} className="contact-icon" />
                <span>
                  Faculty of Engineering, Zakhem Building<br />
                  Main Campus, Kouura, P.O. Box 100, Tripoli, Lebanon
                </span>
              </div>

              <div className="contact-item">
                <Phone size={15} className="contact-icon" />
                <span>+961 6 930 250 / Ext. 3300</span>
              </div>

              <div className="contact-item">
                <Mail size={15} className="contact-icon" />
                <span>research.engineering@balamand.edu.lb</span>
              </div>

              <div className="contact-item">
                <Globe size={15} className="contact-icon" />
                <a
                  href="https://www.balamand.edu.lb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-uni-link"
                >
                  www.balamand.edu.lb <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-footer bottom bar */}
        <div className="inst-subfooter">
          <p>© {currentYear} University of Balamand — Faculty of Engineering. All rights reserved.</p>
          <div className="subfooter-links">
            <a href="#privacy">Privacy Notice</a>
            <span>|</span>
            <a href="#terms">Terms of Service</a>
            <span>|</span>
            <a href="#accessibility">Accessibility</a>
            <span>|</span>
            <a href="#scholarhub">ScholarHub Repository</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
