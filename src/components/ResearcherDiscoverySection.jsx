import React, { useState, useMemo } from 'react';
import { Search, User, ExternalLink, ArrowRight, Award, BookOpen } from 'lucide-react';

export default function ResearcherDiscoverySection({ authorsList, departments, onSelectAuthor }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('publications'); // 'publications' | 'citations'

  const filteredAuthors = useMemo(() => {
    if (!authorsList || !authorsList.length) return [];
    
    return authorsList
      .filter((author) => {
        const matchesSearch = !searchTerm || 
          author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (author.deptName && author.deptName.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesDept = selectedDeptFilter === 'ALL' || author.deptId === selectedDeptFilter;
        
        return matchesSearch && matchesDept;
      })
      .sort((a, b) => {
        if (sortBy === 'citations') return (b.citations || 0) - (a.citations || 0);
        return (b.count || 0) - (a.count || 0);
      });
  }, [authorsList, searchTerm, selectedDeptFilter, sortBy]);

  // Display top 6 matching researchers on the landing section
  const displayedResearchers = filteredAuthors.slice(0, 6);

  return (
    <section id="researchers" className="researcher-discovery-section">
      <div className="section-container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Faculty Talent & Expertise</span>
          <h2 className="section-title">Find Research Expertise</h2>
          <p className="section-subtitle">
            Connect with leading academics, professors, and researchers across all engineering disciplines at the University of Balamand.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="discovery-filter-card">
          <div className="discovery-search-wrapper">
            <Search size={18} className="discovery-search-icon" />
            <input
              type="text"
              placeholder="Search by researcher name, expertise, research area, department or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="discovery-search-input"
            />
          </div>

          <div className="discovery-controls">
            <div className="discovery-select-group">
              <label htmlFor="dept-filter" className="sr-only">Filter by Department</label>
              <select
                id="dept-filter"
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="discovery-select"
              >
                <option value="ALL">All Departments</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name.replace('Department of ', '')}
                  </option>
                ))}
              </select>
            </div>

            <div className="discovery-sort-group">
              <button
                className={`sort-btn ${sortBy === 'publications' ? 'active' : ''}`}
                onClick={() => setSortBy('publications')}
              >
                Top Publications
              </button>
              <button
                className={`sort-btn ${sortBy === 'citations' ? 'active' : ''}`}
                onClick={() => setSortBy('citations')}
              >
                Top Citations
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="discovery-results-meta">
          <span>Showing <strong>{displayedResearchers.length}</strong> of <strong>{filteredAuthors.length}</strong> faculty researchers</span>
        </div>

        {/* Researcher Profile Grid */}
        <div className="researcher-grid">
          {displayedResearchers.map((researcher) => {
            const initials = researcher.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div key={researcher.name} className="researcher-card">
                <div className="researcher-card-header">
                  <div className="researcher-avatar">
                    <span>{initials}</span>
                  </div>

                  <div className="researcher-info">
                    <h3 className="researcher-name">{researcher.name}</h3>
                    <span className="researcher-title">Faculty Researcher / Professor</span>
                    <span className="researcher-dept">
                      {researcher.deptName ? researcher.deptName.replace('Department of ', '') : 'Department of Engineering'}
                    </span>
                  </div>
                </div>



                <div className="researcher-metrics">
                  <div className="metric-item">
                    <BookOpen size={14} />
                    <span><strong>{researcher.count}</strong> Publications</span>
                  </div>
                  <div className="metric-item">
                    <Award size={14} />
                    <span><strong>{researcher.citations || 0}</strong> Citations</span>
                  </div>
                </div>

                <div className="researcher-card-footer">
                  <div className="external-profile-links">
                    <a
                      href={`https://orcid.org`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ext-link"
                      title="ORCID iD"
                    >
                      ORCID <ExternalLink size={11} />
                    </a>
                    <a
                      href={`https://scholar.google.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ext-link"
                      title="Google Scholar"
                    >
                      Scholar <ExternalLink size={11} />
                    </a>
                  </div>

                  <button
                    onClick={() => onSelectAuthor && onSelectAuthor(researcher.name)}
                    className="btn-profile-action"
                  >
                    View Profile <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAuthors.length === 0 && (
          <div className="no-results-box">
            <User size={32} />
            <p>No faculty researchers found matching "{searchTerm}".</p>
            <button onClick={() => { setSearchTerm(''); setSelectedDeptFilter('ALL'); }} className="btn-outline">
              Clear Search Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
