import React, { useState } from 'react';
import InstitutionalTopBar from './InstitutionalTopBar';
import MainNavigation from './MainNavigation';
import HeroSection from './HeroSection';
import ImpactStatsBand from './ImpactStatsBand';
import ResearchAreasSection from './ResearchAreasSection';
import FeaturedProjectsSection from './FeaturedProjectsSection';
import ResearcherDiscoverySection from './ResearcherDiscoverySection';
import RecentPublicationsSection from './RecentPublicationsSection';
import OpportunitiesSection from './OpportunitiesSection';
import SupportServicesSection from './SupportServicesSection';
import NewsEventsSection from './NewsEventsSection';
import CollaborationCTASection from './CollaborationCTASection';
import InstitutionalFooter from './InstitutionalFooter';
import LoginModal from './LoginModal';

export default function LandingPage({
  allArticles,
  departments,
  authorsList,
  tracks,
  onSelectDepartment,
  onSelectAuthor,
  onSelectArticle,
  onSelectView,
  currentView,
}) {
  const [activeTab, setActiveTab] = useState('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Compute stats dynamically from dataset
  const totalPublications = allArticles?.length || 1397;
  const totalDepartments = departments?.length || 6;
  const totalTracks = tracks?.length || 25;
  const totalResearchers = authorsList?.length || 84;
  
  const totalCitations = React.useMemo(() => {
    if (!allArticles || !allArticles.length) return 5400;
    return allArticles.reduce((sum, art) => {
      const citeStr = art.metadata?.find(m => m.key === 'dc.relation.citedby')?.value || '0';
      return sum + (parseInt(citeStr, 10) || 0);
    }, 0);
  }, [allArticles]);

  const handleGlobalSearch = (query) => {
    // Scroll to researcher or publication section and set search query
    const target = document.getElementById('recent-publications');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="institutional-landing-wrapper">
      {/* 1. Institutional top bar */}
      <InstitutionalTopBar />

      {/* 2. Main navigation */}
      <MainNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setLoginModalOpen(true)}
        onSearchSubmit={handleGlobalSearch}
        currentView={currentView}
        onSelectView={onSelectView}
      />

      {/* 3. Research-focused hero section */}
      <HeroSection
        onExploreClick={() => setActiveTab('areas')}
        onSearchClick={() => setActiveTab('researchers')}
        onCollaborateClick={() => setActiveTab('opportunities')}
      />

      {/* 4. Research impact statistics */}
      <ImpactStatsBand
        totalPublications={totalPublications}
        totalDepartments={totalDepartments}
        totalTracks={totalTracks}
        totalResearchers={totalResearchers}
        totalCitations={totalCitations}
      />

      {/* 5. Research areas */}
      <ResearchAreasSection
        departments={departments}
        onSelectDept={(deptId) => {
          const dept = departments.find(d => d.id === deptId);
          if (dept) onSelectDepartment(dept);
        }}
      />

      {/* 6. Featured research and projects */}
      <FeaturedProjectsSection
        featuredArticles={allArticles}
        onSelectArticle={onSelectArticle}
        onViewAll={() => onSelectView('analytics')}
      />

      {/* 7. Researcher and expertise discovery */}
      <ResearcherDiscoverySection
        authorsList={authorsList}
        departments={departments}
        onSelectAuthor={(authorName) => {
          const authorObj = authorsList.find(a => a.name === authorName);
          if (authorObj) onSelectAuthor(authorObj);
        }}
      />

      {/* 8. Recent publications */}
      <RecentPublicationsSection
        allArticles={allArticles}
        onSelectArticle={onSelectArticle}
        onViewAllPublications={() => onSelectView('analytics')}
      />

      {/* 9. Funding, collaboration and opportunities */}
      <OpportunitiesSection
        onSelectOption={(key) => {
          if (key === 'grants') onSelectView('analytics');
          else setLoginModalOpen(true);
        }}
      />

      {/* 10. Research support services */}
      <SupportServicesSection />

      {/* 11. Latest news and events */}
      <NewsEventsSection
        onSelectNews={() => alert('Faculty News Archive: CNRS-L Grant & Scopus publication milestones.')}
        onSelectEvent={() => alert('Mediterranean Engineering Research Symposium 2026 Registration Open.')}
      />

      {/* 12. Final collaboration call to action */}
      <CollaborationCTASection
        onExploreClick={() => {
          const target = document.getElementById('opportunities');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }}
        onContactClick={() => {
          const target = document.getElementById('contact');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 13. Institutional footer */}
      <InstitutionalFooter />

      {/* Researcher Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
