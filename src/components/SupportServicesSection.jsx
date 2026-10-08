import React from 'react';
import { FileText, Shield, BookOpen, Unlock, Database, Library, BarChart, Key, Award, ArrowUpRight } from 'lucide-react';

export default function SupportServicesSection() {
  const services = [
    { id: 'grants', name: 'Grant & Proposal Support', icon: FileText, desc: 'Assistance with funding applications, budgeting, and sponsor compliance.' },
    { id: 'ethics', name: 'Research Ethics & Integrity', icon: Shield, desc: 'Institutional review, human/animal subject guidelines, and safety protocol clearances.' },
    { id: 'publishing', name: 'Publication & Editorial Support', icon: BookOpen, desc: 'Guidance on journal selection, manuscript preparation, and peer-review workflows.' },
    { id: 'openaccess', name: 'Open-Access Guidance', icon: Unlock, desc: 'Information on APC discounts, gold/green open-access policies, and funder mandates.' },
    { id: 'datamgmt', name: 'Research Data Management', icon: Database, desc: 'Data management plans (DMPs), FAIR data principles, and secure storage solutions.' },
    { id: 'repository', name: 'Institutional Repository (ScholarHub)', icon: Library, desc: 'Archiving scholarly outputs and preserving faculty research publications.' },
    { id: 'metrics', name: 'Research Metrics & Impact', icon: BarChart, desc: 'Tracking h-index, citation benchmarks, Scopus metrics, and altmetric scores.' },
    { id: 'ip', name: 'Intellectual Property & Patents', icon: Key, desc: 'Patenting advice, technology transfer office (TTO) filing, and licensing agreements.' },
    { id: 'training', name: 'Research Training & Workshops', icon: Award, desc: 'Methodological seminars, software tools, and career development for scholars.' },
  ];

  return (
    <section id="support-services" className="support-services-section">
      <div className="section-container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Institutional Resources</span>
          <h2 className="section-title">Support for Researchers</h2>
          <p className="section-subtitle">
            Comprehensive institutional services, guidelines, and administrative support for faculty, postdocs, and research assistants.
          </p>
        </div>

        <div className="support-services-grid">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <a
                key={svc.id}
                href={`#${svc.id}`}
                className="service-compact-item"
                onClick={(e) => e.preventDefault()}
              >
                <div className="service-icon">
                  <Icon size={18} />
                </div>
                <div className="service-text">
                  <h3 className="service-name">
                    {svc.name} <ArrowUpRight size={12} className="svc-arrow" />
                  </h3>
                  <p className="service-desc">{svc.desc}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
