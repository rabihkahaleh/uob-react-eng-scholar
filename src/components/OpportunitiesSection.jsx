import React from 'react';
import { Briefcase, GraduationCap, Building, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function OpportunitiesSection({ onSelectOption }) {
  const paths = [
    {
      id: 'researchers',
      category: 'For Faculty & Researchers',
      title: 'Funding & Proposal Development',
      icon: Briefcase,
      description: 'Support mechanisms, seed grants, and funding resources designed to advance academic research projects.',
      bullets: [
        'Internal UOB research grant applications',
        'National (CNRS-L) & international funding calls',
        'Proposal development & peer review support',
        'Research integrity & ethics clearance',
      ],
      actionLabel: 'View Research Grants',
      actionKey: 'grants',
    },
    {
      id: 'students',
      category: 'For Students & Scholars',
      title: 'Postgraduate & Assistantships',
      icon: GraduationCap,
      description: 'Opportunities for Master and PhD candidates, graduate research assistantships, and final-year capstone projects.',
      bullets: [
        'Graduate Research Assistant (GRA) positions',
        'Master of Science thesis topic directory',
        'Final-year capstone engineering projects',
        'Methodological & paper writing workshops',
      ],
      actionLabel: 'Explore Postgraduate Projects',
      actionKey: 'postgrad',
    },
    {
      id: 'partners',
      category: 'For External Partners & Industry',
      title: 'Industry & Community Partnerships',
      icon: Building,
      description: 'Collaborative R&D agreements, specialized consultancy, material testing, and technology transfer services.',
      bullets: [
        'Contract research & tailored R&D consultancy',
        'Specialized laboratory testing & diagnostics',
        'Technology transfer & IP commercialization',
        'Joint industry-academic consortiums',
      ],
      actionLabel: 'Propose Industry Collaboration',
      actionKey: 'industry',
    },
  ];

  return (
    <section id="opportunities" className="opportunities-section">
      <div className="section-container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Engagement & Grants</span>
          <h2 className="section-title">Opportunities and Collaboration</h2>
          <p className="section-subtitle">
            Connecting academics, postgraduate students, and industry partners to drive engineering solutions and joint innovation.
          </p>
        </div>

        <div className="opportunities-grid">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <div key={path.id} className="opportunity-card">
                <div className="opp-header">
                  <div className="opp-icon-wrapper">
                    <Icon size={22} />
                  </div>
                  <span className="opp-category">{path.category}</span>
                </div>

                <h3 className="opp-title">{path.title}</h3>
                <p className="opp-description">{path.description}</p>

                <ul className="opp-bullet-list">
                  {path.bullets.map((b, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={14} className="bullet-icon" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="opp-footer">
                  <button
                    onClick={() => onSelectOption && onSelectOption(path.actionKey)}
                    className="btn-opportunity-action"
                  >
                    <span>{path.actionLabel}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
