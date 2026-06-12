import React, { useState, useMemo } from "react";
import { Cpu, Leaf, Building, Layers, Activity, Search, ChevronRight, BarChart2, Users, FileText, ChevronDown } from "lucide-react";
import { facultyMacroThemes, allDepartmentTracks } from "../data/macroThemes";
import paperThemes from "../data/paperThemes";
import { themeMap } from "../data/facultyThemes";

const iconMap = {
  Cpu: <Cpu size={24} />,
  Leaf: <Leaf size={24} />,
  Building: <Building size={24} />,
  Layers: <Layers size={24} />,
  Activity: <Activity size={24} />
};

export default function FacultyThemeDashboard({ articles, onSelectArticle }) {
  const [selectedMacroThemeId, setSelectedMacroThemeId] = useState(null);
  const [expandedTrackId, setExpandedTrackId] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Map each macro theme to its articles
  const macroStats = useMemo(() => {
    const stats = {};
    facultyMacroThemes.forEach(ft => {
      stats[ft.id] = { articles: [], authors: new Set() };
    });

    articles.forEach(a => {
      const themeIds = paperThemes[a.id];
      if (!themeIds) return;

      const themes = Array.isArray(themeIds) ? themeIds : [themeIds];
      themes.forEach(themeId => {
        const themeData = themeMap[themeId];
        const trackId = themeData ? themeData.trackId : null;

        if (!trackId) return;

        const ft = facultyMacroThemes.find(m => m.departmentTracks.includes(trackId));
        if (ft) {
          stats[ft.id].articles.push(a);

          const metaList = Array.isArray(a.metadata) ? a.metadata : [];
          const instructorsVal = metaList.find(m => m.key === 'dc.contributor.uobinstructors')?.value;
          if (instructorsVal) {
            instructorsVal.split(';').map(s => s.trim()).filter(Boolean).forEach(name => {
              stats[ft.id].authors.add(name);
            });
          }
        }
      });
    });

    return stats;
  }, [articles]);

  const selectedFT = facultyMacroThemes.find(ft => ft.id === selectedMacroThemeId);
  const currentArticles = selectedFT ? macroStats[selectedFT.id].articles : [];

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return currentArticles;
    const q = searchQuery.toLowerCase();
    return currentArticles.filter(a => {
      const metaList = Array.isArray(a.metadata) ? a.metadata : [];
      const authorRaw = metaList.find(m => m.key === "dc.contributor.author")?.value || "";
      return (a.name || "").toLowerCase().includes(q) || authorRaw.toLowerCase().includes(q);
    });
  }, [currentArticles, searchQuery]);

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: "2rem" }}>
        <div className="header-title">
          <h1>Faculty Research Themes</h1>
          <p>Cross-Departmental Knowledge Clusters & Strategic Research Areas</p>
        </div>
      </div>

      {/* Top Macro Themes Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        {facultyMacroThemes.map(ft => {
          const stat = macroStats[ft.id];
          const isSelected = selectedMacroThemeId === ft.id;
          
          return (
            <div 
              key={ft.id} 
              onClick={() => { setSelectedMacroThemeId(isSelected ? null : ft.id); setExpandedTrackId(null); setSelectedSubThemeId(null); setSearchQuery(""); }}
              style={{
                background: isSelected ? `${ft.color}15` : "var(--bg-card)",
                border: isSelected ? `2px solid ${ft.color}` : "1px solid var(--border)",
                borderRadius: "16px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: isSelected ? `0 8px 24px ${ft.color}25` : "var(--shadow)",
                transform: isSelected ? "translateY(-4px)" : "none",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ 
                  background: `${ft.color}20`, color: ft.color, 
                  padding: "0.75rem", borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {iconMap[ft.icon]}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)", lineHeight: "1" }}>
                    {stat.articles.length}
                  </div>
                  <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.2rem" }}>
                    Papers
                  </div>
                </div>
              </div>
              
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "0.5rem" }}>
                {ft.name}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "1.25rem", flex: 1 }}>
                {ft.description}
              </p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: "600", color: "var(--text)" }}>
                  <Building size={14} style={{ color: ft.color }} /> 
                  {ft.departmentTracks.length} Dept. Tracks
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: "600", color: "var(--text)" }}>
                  <Users size={14} style={{ color: ft.color }} /> 
                  {stat.authors.size} Authors
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Theme Details */}
      {selectedFT && (
        <div className="fade-in" style={{ 
          background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "20px", 
          padding: "2rem", boxShadow: "var(--shadow-lg)" 
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", borderBottom: "2px solid var(--border)", paddingBottom: "1.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div style={{ background: selectedFT.color, width: "12px", height: "12px", borderRadius: "50%" }} />
                <h2 style={{ fontSize: "1.6rem", fontWeight: "900", color: "var(--text-main)", margin: 0 }}>
                  {selectedFT.name}
                </h2>
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", maxWidth: "600px", margin: 0 }}>
                Explore how different engineering departments contribute to this overarching research theme.
              </p>
            </div>
            
            <div style={{ position: "relative", width: "300px" }}>
              <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search papers within theme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem",
                  background: "var(--bg)", border: "1px solid var(--border)",
                  borderRadius: "10px", color: "var(--text-main)", fontSize: "0.85rem",
                  outline: "none", fontFamily: "inherit",
                  transition: "all 0.2s"
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "2rem", alignItems: "start" }}>
            {/* Left: Department Tracks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                Departmental Breakdown
              </h3>
              
              {selectedFT.departmentTracks.map(trackId => {
                const track = allDepartmentTracks.find(t => t.id === trackId);
                if (!track) return null;
                
                const isExpanded = expandedTrackId === trackId;
                
                // Count papers for this track
                let trackPaperCount = 0;
                currentArticles.forEach(a => {
                  const tIds = paperThemes[a.id];
                  if (tIds) {
                    const themes = Array.isArray(tIds) ? tIds : [tIds];
                    themes.forEach(tId => {
                      if (themeMap[tId] && themeMap[tId].trackId === trackId) {
                        trackPaperCount++;
                      }
                    });
                  }
                });

                const deptStr = track.dept ? track.dept : (trackId.startsWith("CV") ? "Civil Eng" : "Unknown");

                return (
                  <div key={trackId} style={{ 
                    border: `1px solid ${isExpanded ? selectedFT.color : 'var(--border)'}`, 
                    borderRadius: "12px", overflow: "hidden",
                    boxShadow: isExpanded ? `0 4px 12px ${selectedFT.color}15` : "none",
                    transition: "all 0.2s",
                    background: "var(--bg-card)"
                  }}>
                    <div 
                      onClick={() => { setExpandedTrackId(isExpanded ? null : trackId); setSelectedSubThemeId(null); }}
                      style={{ 
                        padding: "1rem 1.25rem", background: isExpanded ? `${selectedFT.color}08` : "transparent",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.7rem", fontWeight: "800", color: selectedFT.color, textTransform: "uppercase", marginBottom: "0.2rem" }}>
                          {deptStr}
                        </div>
                        <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          {track.name}
                        </div>
                      </div>
                      <div style={{ 
                        background: isExpanded ? selectedFT.color : "var(--bg)", 
                        color: isExpanded ? "#fff" : "var(--text-muted)",
                        padding: "0.25rem 0.6rem", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "800" 
                      }}>
                        {trackPaperCount}
                      </div>
                    </div>

                    {/* Sub-themes list */}
                    {isExpanded && track.themes && track.themes.length > 0 && (
                      <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
                        {track.themes.map(subTheme => {
                          const isSubSelected = selectedSubThemeId === subTheme.id;
                          
                          // Count papers for this sub-theme
                          let subThemeCount = 0;
                          currentArticles.forEach(a => {
                            const tIds = paperThemes[a.id];
                            if (tIds) {
                              const themes = Array.isArray(tIds) ? tIds : [tIds];
                              if (themes.includes(subTheme.id)) subThemeCount++;
                            }
                          });

                          return (
                            <div 
                              key={subTheme.id}
                              onClick={() => setSelectedSubThemeId(isSubSelected ? null : subTheme.id)}
                              style={{ 
                                padding: "0.6rem 1rem 0.6rem 2.5rem", 
                                cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                background: isSubSelected ? `${selectedFT.color}15` : "transparent",
                                borderLeft: isSubSelected ? `3px solid ${selectedFT.color}` : "3px solid transparent",
                                opacity: subThemeCount === 0 ? 0.5 : 1
                              }}
                            >
                              <span style={{ fontSize: "0.75rem", color: isSubSelected ? selectedFT.color : "var(--text)", fontWeight: isSubSelected ? "700" : "500", paddingRight: "0.5rem" }}>
                                {subTheme.id} · {subTheme.name}
                              </span>
                              {subThemeCount > 0 && (
                                <span style={{ fontSize: "0.65rem", fontWeight: "800", background: isSubSelected ? selectedFT.color : "var(--border)", color: isSubSelected ? "#fff" : "var(--text-muted)", padding: "0.1rem 0.4rem", borderRadius: "10px" }}>
                                  {subThemeCount}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right: Papers List */}
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                {searchQuery ? `Search Results (${filteredArticles.length})` : 
                 selectedSubThemeId ? `Sub-Theme Publications` : 
                 expandedTrackId ? `Track Publications` : `All Publications in Theme (${filteredArticles.length})`}
              </h3>

              {filteredArticles.length === 0 ? (
                <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "3rem", textAlign: "center", border: "1px dashed #cbd5e1" }}>
                  <FileText size={40} style={{ color: "#94a3b8", margin: "0 auto 1rem" }} />
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>No Publications Found</h4>
                  <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    There are no papers matching your current filters in this faculty theme.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {filteredArticles
                    .filter(a => {
                      const tIds = paperThemes[a.id];
                      if (!tIds) return false;
                      const themes = Array.isArray(tIds) ? tIds : [tIds];
                      if (selectedSubThemeId) {
                        return themes.includes(selectedSubThemeId);
                      }
                      if (!expandedTrackId) return true;
                      return themes.some(tId => themeMap[tId] && themeMap[tId].trackId === expandedTrackId);
                    })
                    .slice(0, 50) // Limit for performance in UI
                    .map(a => {
                    const metaList = Array.isArray(a.metadata) ? a.metadata : [];
                    const authorRaw = metaList.find(m => m.key === "dc.contributor.author")?.value || "";
                    const authorNames = authorRaw.split(";").map(s => s.trim()).filter(Boolean);
                    const authorDisplay = authorNames.length > 3 
                      ? `${authorNames.slice(0, 3).join(", ")} et al.` 
                      : authorNames.join(", ") || "—";
                    const year = a.lastModified ? new Date(a.lastModified).getFullYear() : "";
                    const source = metaList.find(m => m.key === "dc.source")?.value || "";
                    
                    return (
                      <div 
                        key={a.id} 
                        onClick={() => onSelectArticle(a)}
                        style={{ 
                          background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px",
                          padding: "1.25rem", cursor: "pointer", transition: "all 0.2s",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.borderColor = selectedFT.color;
                          e.currentTarget.style.boxShadow = `0 4px 12px ${selectedFT.color}20`;
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.borderColor = "#e2e8f0";
                          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
                          e.currentTarget.style.transform = "none";
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                          <span style={{ fontSize: "0.7rem", fontWeight: "800", color: selectedFT.color, background: `${selectedFT.color}15`, padding: "0.2rem 0.5rem", borderRadius: "6px" }}>
                            {a.type || "Article"}
                          </span>
                          <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>{year}</span>
                        </div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#1e293b", margin: "0 0 0.5rem 0", lineHeight: "1.4" }}>
                          {a.name}
                        </h4>
                        <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 0.4rem 0" }}>
                          {authorDisplay}
                        </p>
                        {source && (
                          <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic", margin: 0 }}>
                            {source}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
