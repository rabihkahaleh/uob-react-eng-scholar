import React from 'react';
import { BookOpen, Building2, Layers, Users, Award, Clock } from 'lucide-react';

export default function ImpactStatsBand({ totalPublications, totalDepartments, totalTracks, totalResearchers, totalCitations }) {
  const stats = [
    {
      id: 'pubs',
      value: totalPublications || 1397,
      label: 'Scopus Publications',
      sublabel: 'Peer-reviewed outputs',
      icon: BookOpen,
    },
    {
      id: 'depts',
      value: totalDepartments || 6,
      label: 'Academic Departments',
      sublabel: 'Engineering fields',
      icon: Building2,
    },
    {
      id: 'tracks',
      value: totalTracks || 25,
      label: 'Research Tracks',
      sublabel: 'Macro thematic domains',
      icon: Layers,
    },
    {
      id: 'researchers',
      value: totalResearchers || 84,
      label: 'Faculty Researchers',
      sublabel: 'Active scholar profiles',
      icon: Users,
    },
    {
      id: 'citations',
      value: totalCitations ? `${totalCitations.toLocaleString()}+` : '5,400+',
      label: 'Scholarly Citations',
      sublabel: 'Global academic impact',
      icon: Award,
    },
  ];

  return (
    <section className="stats-band-section">
      <div className="stats-band-container">
        <div className="stats-band-header">
          <div className="stats-band-period">
            <Clock size={13} />
            <span>Reporting Period: <strong>2021–2026</strong></span>
          </div>
          <span className="stats-band-source">Data Source: Scopus Institutional Repository & UOB ScholarHub</span>
        </div>

        <div className="stats-band-grid">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="stats-band-card">
                <div className="stats-band-card-icon">
                  <Icon size={20} />
                </div>
                <div className="stats-band-card-content">
                  <div className="stats-band-card-value">{item.value}</div>
                  <div className="stats-band-card-label">{item.label}</div>
                  <div className="stats-band-card-sublabel">{item.sublabel}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
