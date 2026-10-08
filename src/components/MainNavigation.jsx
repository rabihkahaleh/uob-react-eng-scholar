import React, { useState } from 'react';
import { Menu, X, BarChart2, ChevronDown, Building2, BookOpen, Users, Layers } from 'lucide-react';

export default function MainNavigation({
  activeTab,
  setActiveTab,
  currentView,
  onSelectView,
  departments,
  onSelectDepartment,
  onSelectAuthor
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const deptItems = [
    { id: 'civil', name: 'Civil & Environmental Engineering' },
    { id: 'electrical', name: 'Electrical Engineering' },
    { id: 'mechanical', name: 'Mechanical Engineering' },
    { id: 'chemical', name: 'Chemical Engineering' },
    { id: 'computer', name: 'Computer Engineering' },
    { id: 'sustainability', name: 'Sustainability for Engineering' },
  ];

  return (
    <header className="main-nav-header">
      <div className="main-nav-container">
        {/* Left branding */}
        <div className="main-nav-brand" onClick={() => onSelectView('landing')}>
          <img
            src="/FOE_logo.jpg"
            alt="Faculty of Engineering - University of Balamand"
            className="main-nav-logo"
          />
          <div className="main-nav-titles">
            <span className="main-nav-uni">Faculty of Engineering</span>
            <span className="main-nav-title">Research Hub</span>
          </div>
        </div>

        {/* Desktop Navigation links with Mouseover Submenus */}
        <nav className="main-nav-links" aria-label="Main Navigation">
          {/* Home Link */}
          <a
            href="#hero"
            className={`main-nav-link ${activeTab === 'home' && currentView === 'landing' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('home');
              if (currentView !== 'landing') onSelectView('landing');
              const el = document.getElementById('hero');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Home
          </a>

          {/* 1. Research Areas Dropdown */}
          <div className="nav-dropdown-wrapper">
            <a
              href="#research-areas"
              className={`main-nav-link dropdown-trigger ${activeTab === 'areas' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('areas');
                if (currentView !== 'landing') onSelectView('landing');
                const el = document.getElementById('research-areas');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Research Areas <ChevronDown size={13} className="dropdown-arrow" />
            </a>

            <div className="nav-dropdown-menu">
              <div className="dropdown-header">Engineering Departments</div>
              {deptItems.map((d) => (
                <a
                  key={d.id}
                  href={`#dept-${d.id}`}
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSelectDepartment) onSelectDepartment(d.id);
                  }}
                >
                  <Building2 size={14} className="dropdown-icon" />
                  <span>{d.name}</span>
                </a>
              ))}
              <div className="dropdown-divider"></div>
              <a
                href="#tracks"
                className="dropdown-item highlight"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectView('analytics');
                }}
              >
                <Layers size={14} className="dropdown-icon" />
                <span>View All 25+ Macro Research Tracks</span>
              </a>
            </div>
          </div>

          {/* 2. Researchers Dropdown */}
          <div className="nav-dropdown-wrapper">
            <a
              href="#researchers"
              className={`main-nav-link dropdown-trigger ${activeTab === 'researchers' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('researchers');
                if (currentView !== 'landing') onSelectView('landing');
                const el = document.getElementById('researchers');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Researchers <ChevronDown size={13} className="dropdown-arrow" />
            </a>

            <div className="nav-dropdown-menu">
              <div className="dropdown-header">Faculty Scholars Directory</div>
              <a
                href="#researchers"
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('researchers');
                  if (currentView !== 'landing') onSelectView('landing');
                  const el = document.getElementById('researchers');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Users size={14} className="dropdown-icon" />
                <span>Search Scholar Directory</span>
              </a>
              <a
                href="#top-scholars"
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectView('analytics');
                }}
              >
                <BarChart2 size={14} className="dropdown-icon" />
                <span>Top Cited Instructors & Analytics</span>
              </a>
            </div>
          </div>

          {/* 3. Publications Dropdown */}
          <div className="nav-dropdown-wrapper">
            <a
              href="#recent-publications"
              className={`main-nav-link dropdown-trigger ${activeTab === 'publications' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('publications');
                if (currentView !== 'landing') onSelectView('landing');
                const el = document.getElementById('recent-publications');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Publications <ChevronDown size={13} className="dropdown-arrow" />
            </a>

            <div className="nav-dropdown-menu">
              <div className="dropdown-header">Scholarly Outputs</div>
              <a
                href="#recent-publications"
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('publications');
                  if (currentView !== 'landing') onSelectView('landing');
                  const el = document.getElementById('recent-publications');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <BookOpen size={14} className="dropdown-icon" />
                <span>Recent Peer-Reviewed Papers</span>
              </a>
              <a
                href="#journals"
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectView('analytics');
                }}
              >
                <BarChart2 size={14} className="dropdown-icon" />
                <span>Journals & Sources Analytics</span>
              </a>
            </div>
          </div>

        </nav>

        {/* Right side controls */}
        <div className="main-nav-actions">
          <button
            className={`main-nav-analytics-btn ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => onSelectView('analytics')}
            title="Open Deep Analytics Dashboard"
          >
            <BarChart2 size={14} />
            <span>Analytics Dashboard</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="main-nav-mobile-toggle"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="main-nav-mobile-menu fade-in">
          <a
            href="#hero"
            className="main-nav-mobile-link"
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
              if (currentView !== 'landing') onSelectView('landing');
            }}
          >
            Home Overview
          </a>
          <a
            href="#research-areas"
            className="main-nav-mobile-link"
            onClick={() => {
              setActiveTab('areas');
              setMobileMenuOpen(false);
              if (currentView !== 'landing') onSelectView('landing');
            }}
          >
            Research Areas & Departments
          </a>
          <a
            href="#researchers"
            className="main-nav-mobile-link"
            onClick={() => {
              setActiveTab('researchers');
              setMobileMenuOpen(false);
              if (currentView !== 'landing') onSelectView('landing');
            }}
          >
            Faculty Researchers
          </a>
          <a
            href="#recent-publications"
            className="main-nav-mobile-link"
            onClick={() => {
              setActiveTab('publications');
              setMobileMenuOpen(false);
              if (currentView !== 'landing') onSelectView('landing');
            }}
          >
            Recent Publications
          </a>
          <button
            className="main-nav-mobile-link analytics-mobile"
            onClick={() => {
              onSelectView('analytics');
              setMobileMenuOpen(false);
            }}
          >
            <BarChart2 size={16} /> Deep Analytics Dashboard
          </button>
        </div>
      )}
    </header>
  );
}
