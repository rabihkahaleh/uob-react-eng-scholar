import React, { useState, useMemo } from 'react';
import { BookOpen, ExternalLink, Unlock, ArrowRight, Search } from 'lucide-react';

export default function RecentPublicationsSection({ allArticles, onSelectArticle, onViewAllPublications }) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPublications = useMemo(() => {
    if (!allArticles || !allArticles.length) return [];

    return allArticles
      .filter((article) => {
        // Tab filter
        let matchesTab = true;
        const type = (article.type || '').toLowerCase();
        const isOpenAccess = article.metadata?.find(m => m.key === 'dc.rights.openaccess')?.value === '1';

        if (activeTab === 'JOURNAL') matchesTab = type.includes('article') || type.includes('journal');
        else if (activeTab === 'CONFERENCE') matchesTab = type.includes('conference') || type.includes('proceeding');
        else if (activeTab === 'CHAPTER') matchesTab = type.includes('book') || type.includes('chapter');
        else if (activeTab === 'OPEN_ACCESS') matchesTab = isOpenAccess;

        // Search query
        const matchesQuery = !searchQuery ||
          article.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (article.metadata?.find(m => m.key === 'dc.contributor.author')?.value || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (article.metadata?.find(m => m.key === 'dc.source')?.value || '').toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesQuery;
      })
      .slice(0, 8); // Display top 8 in landing section
  }, [allArticles, activeTab, searchQuery]);

  return (
    <section id="recent-publications" className="recent-publications-section">
      <div className="section-container">
        <div className="section-header-flex">
          <div>
            <span className="section-eyebrow">Scholarly Outputs</span>
            <h2 className="section-title">Recent Publications</h2>
            <p className="section-subtitle">
              Verified peer-reviewed journal papers, conference proceedings, and open-access research from the Faculty of Engineering.
            </p>
          </div>

          <button onClick={onViewAllPublications} className="btn-outline">
            Browse All Publications <ArrowRight size={15} />
          </button>
        </div>

        {/* Tabs & Quick Search */}
        <div className="publications-filter-bar">
          <div className="publications-tabs" role="tablist">
            {[
              { id: 'ALL', label: 'All Outputs' },
              { id: 'JOURNAL', label: 'Journal Articles' },
              { id: 'CONFERENCE', label: 'Conference Papers' },
              { id: 'CHAPTER', label: 'Books & Chapters' },
              { id: 'OPEN_ACCESS', label: 'Open Access' },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`pub-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pub-search-input-wrapper">
            <Search size={14} className="pub-search-icon" />
            <input
              type="text"
              placeholder="Filter by title, author, journal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pub-search-input"
            />
          </div>
        </div>

        {/* Academic Publication List */}
        <div className="publications-list">
          {filteredPublications.map((pub) => {
            const authorsVal = pub.metadata?.find(m => m.key === 'dc.contributor.author')?.value || 'Faculty Scholars';
            const sourceVal = pub.metadata?.find(m => m.key === 'dc.source')?.value || 'Engineering Journal';
            const doiVal = pub.metadata?.find(m => m.key === 'dc.identifier.doi')?.value || '';
            const isOpenAccess = pub.metadata?.find(m => m.key === 'dc.rights.openaccess')?.value === '1';
            const yearVal = pub.lastModified ? new Date(pub.lastModified).getFullYear() : '2024';
            const citationsVal = pub.metadata?.find(m => m.key === 'dc.relation.citedby')?.value || '0';

            return (
              <div key={pub.id} className="pub-row-card">
                <div className="pub-row-main">
                  <div className="pub-badges">
                    <span className="pub-type-badge">{pub.type || 'Article'}</span>
                    <span className="pub-dept-badge">{pub.deptName ? pub.deptName.replace('Department of ', '') : 'Engineering'}</span>
                    {isOpenAccess && (
                      <span className="pub-oa-badge" title="Open Access Publication">
                        <Unlock size={11} /> Open Access
                      </span>
                    )}
                    {pub.themeName && (
                      <span className="pub-theme-badge">{pub.themeName}</span>
                    )}
                  </div>

                  <h3
                    className="pub-row-title"
                    onClick={() => onSelectArticle && onSelectArticle(pub)}
                  >
                    {pub.name}
                  </h3>

                  <div className="pub-row-authors">
                    {authorsVal}
                  </div>

                  <div className="pub-row-venue">
                    <span className="venue-name">{sourceVal}</span>
                    <span className="dot">•</span>
                    <span className="venue-year">{yearVal}</span>
                    {citationsVal !== '0' && (
                      <>
                        <span className="dot">•</span>
                        <span className="venue-citations">Cited by {citationsVal}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pub-row-actions">
                  {doiVal && (
                    <a
                      href={doiVal.startsWith('http') ? doiVal : `https://doi.org/${doiVal}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-doi"
                      title="View Article via DOI"
                    >
                      DOI <ExternalLink size={12} />
                    </a>
                  )}

                  <button
                    onClick={() => onSelectArticle && onSelectArticle(pub)}
                    className="btn-details"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}

          {filteredPublications.length === 0 && (
            <div className="no-pub-box">
              <BookOpen size={28} />
              <p>No publications found matching the current filters.</p>
              <button onClick={() => { setActiveTab('ALL'); setSearchQuery(''); }} className="btn-outline-sm">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
