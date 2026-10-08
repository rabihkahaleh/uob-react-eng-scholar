import React from 'react';
import { Cpu, Zap, Settings, Flame, ShieldAlert, Leaf, ArrowRight, Layers } from 'lucide-react';

export default function ResearchAreasSection({ departments, onSelectDept, onSelectTrack }) {
  const departmentDetails = [
    {
      id: 'civil',
      code: 'CV',
      name: 'Civil & Environmental Engineering',
      icon: ShieldAlert,
      description: 'Advancing sustainable materials, geopolymers, structural health monitoring, transportation systems, and hydro-environmental management.',
      themesCount: '7 Macro Tracks',
      color: '#1d5d8f',
    },
    {
      id: 'electrical',
      code: 'EE',
      name: 'Electrical Engineering',
      icon: Zap,
      description: 'Pioneering work in power electronics, smart grids, 5G wireless communications, biomedical signals, and autonomous control systems.',
      themesCount: '4 Macro Tracks',
      color: '#c7a34b',
    },
    {
      id: 'mechanical',
      code: 'ME',
      name: 'Mechanical Engineering',
      icon: Settings,
      description: 'Researching renewable energy conversion, thermal-fluids, phase change materials, vibro-acoustics, and mechatronics design.',
      themesCount: '4 Macro Tracks',
      color: '#12304a',
    },
    {
      id: 'chemical',
      code: 'CH',
      name: 'Chemical Engineering',
      icon: Flame,
      description: 'Leading innovations in advanced catalysis, wastewater treatment, biomass conversion, polymer science, and bioprocess systems.',
      themesCount: '6 Macro Tracks',
      color: '#0d9488',
    },
    {
      id: 'computer',
      code: 'CP',
      name: 'Computer Engineering',
      icon: Cpu,
      description: 'Focusing on artificial intelligence, computer vision, optical communication networks, FPGA parallel architectures, and IoT security.',
      themesCount: '3 Macro Tracks',
      color: '#6b21a8',
    },
    {
      id: 'sustainability',
      code: 'ST',
      name: 'Sustainability for Engineering',
      icon: Leaf,
      description: 'Interdisciplinary research in circular economy, green building systems, engineering education for sustainable development, and nexus planning.',
      themesCount: '2 Macro Tracks',
      color: '#15803d',
    },
  ];

  return (
    <section id="research-areas" className="research-areas-section">
      <div className="section-container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Academic Disciplines</span>
          <h2 className="section-title">Explore Our Research Areas</h2>
          <p className="section-subtitle">
            The Faculty of Engineering conducts multi-disciplinary research across six specialized departments, 
            tackling global engineering challenges and advancing industrial standards.
          </p>
        </div>

        <div className="research-areas-grid">
          {departmentDetails.map((area) => {
            const Icon = area.icon;
            const deptObj = departments?.find((d) => d.id === area.id);
            const pubCount = deptObj?.numberItems || 0;

            return (
              <div key={area.id} className="area-card" style={{ borderTopColor: area.color }}>
                <div className="area-card-top">
                  <div className="area-icon-wrapper" style={{ backgroundColor: `${area.color}15`, color: area.color }}>
                    <Icon size={24} />
                  </div>
                  <span className="area-tracks-badge">
                    <Layers size={11} /> {area.themesCount}
                  </span>
                </div>

                <h3 className="area-title">{area.name}</h3>
                <p className="area-description">{area.description}</p>

                <div className="area-card-footer">
                  <div className="area-stat">
                    <span className="area-stat-val">{pubCount}</span>
                    <span className="area-stat-lbl">Publications</span>
                  </div>

                  <button
                    onClick={() => onSelectDept && onSelectDept(area.id)}
                    className="area-link-btn"
                    aria-label={`Explore ${area.name}`}
                  >
                    <span>Explore area</span>
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
