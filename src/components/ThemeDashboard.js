import { useMemo, useState, useEffect } from "react";
import { tracks, themeMap } from "../data/facultyThemes";
import paperThemes from "../data/paperThemes";
import { BarChart2, ChevronDown, ChevronRight, ChevronLeft, FileText, Tag, Download, Search } from "lucide-react";

export default function ThemeDashboard({ articles, onSelectArticle, initialThemeId }) {
  const [expandedTrack, setExpandedTrack] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(initialThemeId || null);
  const [paperSearch, setPaperSearch] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [page, setPage] = useState(1);
  const perPage = 12;

  // Build themeId → articles mapping
  const themeArticles = useMemo(() => {
    const map = {};
    const processedIds = new Set();
    articles.forEach(a => {
      if (processedIds.has(a.id)) return;
      processedIds.add(a.id);
      
      const themeId = paperThemes[a.id];
      if (!themeId) return;
      if (!map[themeId]) map[themeId] = [];
      map[themeId].push(a);
    });
    return map;
  }, [articles]);

  useEffect(() => {
    if (initialThemeId) {
      // First, check if the ID is actually a parent track ID
      const explicitTrack = tracks.find(t => t.id === initialThemeId);
      
      if (explicitTrack) {
        setExpandedTrack(explicitTrack.id);
        // Pre-select the first populated theme of this track if exists
        const firstTheme = explicitTrack.themes?.[0]?.id || null;
        setSelectedThemeId(firstTheme);
      } else {
        // Otherwise, it represents a specific sub-theme
        setSelectedThemeId(initialThemeId);
        const parentTrack = tracks.find(t => t.themes.some(th => th.id === initialThemeId));
        if (parentTrack) setExpandedTrack(parentTrack.id);
      }
      setPage(1);
    }
  }, [initialThemeId]);

  // Count papers per track
  const trackCounts = useMemo(() => {
    const counts = {};
    tracks.forEach(t => {
      counts[t.id] = t.themes.reduce((sum, th) => sum + (themeArticles[th.id]?.length || 0), 0);
    });
    return counts;
  }, [themeArticles]);

  const totalClassified = useMemo(() =>
    Object.values(themeArticles).reduce((s, arr) => s + arr.length, 0),
  [themeArticles]);

  const baseSelectedArticles = selectedThemeId ? (themeArticles[selectedThemeId] || []) : [];
  
  const selectedArticles = useMemo(() => {
    const sorted = baseSelectedArticles.slice().sort((a, b) => {
      if (sortOption === "citations") {
        const getCitations = (item) => {
          const metaList = Array.isArray(item.metadata) ? item.metadata : [];
          return parseInt(metaList.find(m => m.key === "dc.relation.citedby")?.value || "0", 10);
        };
        return getCitations(b) - getCitations(a);
      } else {
        return (b.lastModified || "").localeCompare(a.lastModified || "");
      }
    });

    if (!paperSearch.trim()) return sorted;
    const term = paperSearch.toLowerCase();
    return sorted.filter(a => {
      const metaList = Array.isArray(a.metadata) ? a.metadata : [];
      const source = metaList.find(m => m.key === "dc.source")?.value || "";
      const authors = metaList.find(m => m.key === "dc.contributor.author")?.value || "";
      return (
        a.name?.toLowerCase().includes(term) ||
        source.toLowerCase().includes(term) ||
        authors.toLowerCase().includes(term)
      );
    });
  }, [baseSelectedArticles, paperSearch, sortOption]);

  const totalPages = Math.ceil(selectedArticles.length / perPage);
  const pagedPapers = useMemo(
    () => selectedArticles.slice((page - 1) * perPage, page * perPage),
    [selectedArticles, page]
  );
  
  const selectedTheme = selectedThemeId ? themeMap[selectedThemeId] : null;

  const hasData = totalClassified > 0;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="header-title">
          <h1>Research Themes</h1>
          <p>Faculty of Engineering · Knowledge Clusters</p>
        </div>
        {hasData && (
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600",
            background: "#fff", border: "1px solid var(--border)", borderRadius: "10px",
            padding: "0.5rem 1rem" }}>
            {totalClassified} papers classified across {tracks.length} tracks
          </div>
        )}
      </div>

      {!hasData ? (
        /* ── No data yet ── */
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "16px",
          padding: "3rem", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
          <Tag size={48} style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }} />
          <h3 style={{ color: "var(--text-main)", fontWeight: "800", marginBottom: "0.75rem", fontSize: "1.2rem" }}>
            Themes Not Yet Classified
          </h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", lineHeight: "1.7" }}>
            Run the Gemini AI classification script to assign each paper to a research theme:
          </p>
          <div style={{ background: "#f8fafc", border: "1px solid var(--border)", borderRadius: "10px",
            padding: "1rem 1.25rem", textAlign: "left", fontFamily: "monospace", fontSize: "0.82rem",
            color: "#334155", marginBottom: "0.75rem" }}>
            npm install @google/generative-ai<br />
            node scripts/classifyWithGemini.mjs YOUR_API_KEY
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            After running, refresh the app to see classified papers.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "1.5rem", alignItems: "start" }}>

          {/* ── Left: track/theme tree ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {tracks.map(track => {
              const isExpanded = expandedTrack === track.id;
              const count = trackCounts[track.id];
              return (
                <div key={track.id} style={{ background: "#fff", border: "1px solid var(--border)",
                  borderRadius: "12px", overflow: "hidden", boxShadow: "var(--shadow)" }}>

                  {/* Track header */}
                  <div
                    onClick={() => setExpandedTrack(isExpanded ? null : track.id)}
                    style={{ padding: "0.85rem 1rem", cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "space-between",
                      borderLeft: `4px solid ${track.color}`,
                      background: isExpanded ? `${track.color}10` : "transparent",
                      transition: "background 0.2s" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      {isExpanded
                        ? <ChevronDown size={15} style={{ color: track.color }} />
                        : <ChevronRight size={15} style={{ color: "var(--text-muted)" }} />}
                      <span style={{ fontWeight: "700", fontSize: "0.85rem", color: "var(--text-main)" }}>
                        {track.name}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: "800",
                      background: isExpanded ? track.color : "var(--bg)",
                      color: isExpanded ? "#fff" : "var(--text-muted)",
                      padding: "0.15rem 0.5rem", borderRadius: "20px", minWidth: "28px", textAlign: "center" }}>
                      {count}
                    </span>
                  </div>

                  {/* Themes */}
                  {isExpanded && (
                    <div style={{ borderTop: "1px solid var(--border)" }}>
                      {track.themes.map(theme => {
                        const tCount = themeArticles[theme.id]?.length || 0;
                        const isSelected = selectedThemeId === theme.id;
                        return (
                          <div
                            key={theme.id}
                            onClick={() => { setSelectedThemeId(isSelected ? null : theme.id); setPage(1); }}
                            style={{ padding: "0.65rem 1rem 0.65rem 2rem",
                              cursor: tCount > 0 ? "pointer" : "default",
                              background: isSelected ? `${track.color}15` : "transparent",
                              borderLeft: isSelected ? `3px solid ${track.color}` : "3px solid transparent",
                              display: "flex", justifyContent: "space-between", alignItems: "center",
                              transition: "background 0.15s", opacity: tCount === 0 ? 0.45 : 1 }}
                          >
                            <span style={{ fontSize: "0.78rem", color: isSelected ? track.color : "var(--text)",
                              fontWeight: isSelected ? "700" : "500", lineHeight: "1.4", paddingRight: "0.5rem" }}>
                              {theme.id} · {theme.name}
                            </span>
                            {tCount > 0 && (
                              <span style={{ fontSize: "0.68rem", fontWeight: "800", flexShrink: 0,
                                background: isSelected ? track.color : "var(--bg)",
                                color: isSelected ? "#fff" : "var(--text-muted)",
                                padding: "0.1rem 0.4rem", borderRadius: "10px" }}>
                                {tCount}
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

          {/* ── Right: paper list ── */}
          <div>
            {!selectedThemeId ? (
              <div style={{ background: "#f8fafc", border: "2px dashed rgba(59, 130, 246, 0.3)", borderRadius: "16px",
                padding: "5rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Search size={48} style={{ color: "#3b82f6", marginBottom: "1.25rem", opacity: 0.8 }} />
                <h3 style={{ color: "#1e293b", fontWeight: "900", marginBottom: "0.75rem", fontSize: "1.4rem", letterSpacing: "-0.02em" }}>
                  Waiting for Your Command...
                </h3>
                <p style={{ color: "#64748b", fontWeight: "500", maxWidth: "360px", lineHeight: "1.6", fontSize: "0.95rem" }}>
                  Don't just stand there! Poke a research theme from the left sidebar to forcefully extract all its hidden academic secrets and prestigious publications right into this empty void. It's perfectly safe... mostly! 🛡️
                </p>
              </div>
            ) : (
              <div key={selectedThemeId} className="fade-in">
                {/* Theme header */}
                <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px",
                  padding: "1.25rem 1.5rem", marginBottom: "1.25rem", boxShadow: "var(--shadow)",
                  borderLeft: `5px solid ${selectedTheme?.color}` }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: "800", color: selectedTheme?.color,
                    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>
                    {selectedTheme?.trackName} · {selectedThemeId}
                  </div>
                  <div style={{ fontWeight: "800", fontSize: "1.05rem", color: "var(--text-main)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{selectedTheme?.name}</span>
                    <button
                      onClick={() => {
                        const exportPapers = selectedArticles;
                        if (!exportPapers || !exportPapers.length) return;
                        const headers = ["Theme ID", "Theme Name", "Title", "Type", "Year", "Authors", "Source", "DOI", "Scopus Link", "Citations"];
                        const rows = exportPapers.map(a => {
                          const metaList = Array.isArray(a.metadata) ? a.metadata : [];
                          const getMeta = (key) => metaList.find(m => m.key === key)?.value || "";
                          const year = a.lastModified ? new Date(a.lastModified).getFullYear() : "";
                          const themeId = paperThemes[a.id] || "Uncategorized";
                          const themeName = themeMap[themeId]?.name || "N/A";
                          return [
                            `"${themeId}"`,
                            `"${themeName.replace(/"/g, '""')}"`,
                            `"${(a.name || '').replace(/"/g, '""')}"`,
                            `"${(a.type || 'Article').replace(/"/g, '""')}"`,
                            year,
                            `"${getMeta('dc.contributor.author').replace(/"/g, '""')}"`,
                            `"${getMeta('dc.source').replace(/"/g, '""')}"`,
                            `"${getMeta('dc.identifier.doi')}"`,
                            `"${getMeta('dc.identifier.scopus')}"`,
                            getMeta('dc.relation.citedby') || "0"
                          ].join(",");
                        });
                        const csvString = [headers.join(","), ...rows].join("\n");
                        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.setAttribute("href", url);
                        link.setAttribute("download", `${selectedThemeId}_Theme_Publications.csv`);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                      }}
                      style={{
                        padding: "0.45rem 0.8rem", background: "rgba(255,255,255,0.8)", color: "#334155",
                        border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", fontWeight: "700",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "all 0.2s"
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#94a3b8"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                    >
                      <Download size={14} /> Export to Excel
                    </button>
                  </div>
                  <div style={{ marginTop: "0.4rem", fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "600", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <span>{baseSelectedArticles.length} publication{baseSelectedArticles.length !== 1 ? "s" : ""}</span>
                    <span style={{ color: "var(--border)" }}>|</span>
                    <span>
                      {
                        new Set(
                          baseSelectedArticles.flatMap(a => {
                            const metaList = Array.isArray(a.metadata) ? a.metadata : [];
                            const val = metaList.find(m => m.key === "dc.contributor.uobinstructors")?.value || "";
                            return val.split(";").map(s => s.trim()).filter(Boolean);
                          })
                        ).size
                      } UOB author{new Set(baseSelectedArticles.flatMap(a => (Array.isArray(a.metadata) ? a.metadata : []).find(m => m.key === "dc.contributor.uobinstructors")?.value.split(";").map(s => s.trim()).filter(Boolean) || [])).size !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Search and sort filters */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ position: "relative", flex: 1, minWidth: "250px", maxWidth: "480px" }}>
                    <Search size={15} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
                    <input
                      type="text"
                      placeholder="Search by title, journal, or author..."
                      value={paperSearch}
                      onChange={e => { setPaperSearch(e.target.value); setPage(1); }}
                      style={{
                        width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem",
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px", color: "#0f172a",
                        fontSize: "0.85rem", outline: "none", fontFamily: "inherit"
                      }}
                    />
                    {paperSearch && (
                      <span style={{
                        position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)",
                        fontSize: "0.7rem", fontWeight: "800", color: "#b45309",
                        background: "rgba(217,119,6,0.12)", padding: "0.15rem 0.5rem", borderRadius: "20px"
                      }}>
                        {selectedArticles.length} found
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "#475569", fontWeight: "600" }}>Sort by:</span>
                    <select
                      value={sortOption}
                      onChange={e => { setSortOption(e.target.value); setPage(1); }}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px", color: "#0f172a",
                        fontSize: "0.85rem", outline: "none", fontFamily: "inherit",
                        cursor: "pointer"
                      }}
                    >
                      <option value="date">Newest First</option>
                      <option value="citations">Most Cited</option>
                    </select>
                  </div>
                </div>

                {selectedArticles.length === 0 ? (
                  <div style={{ background: "#fff", border: "1px dashed var(--border)", borderRadius: "12px",
                    padding: "2rem", textAlign: "center" }}>
                    <p style={{ color: "var(--text-muted)" }}>No papers classified in this theme yet.</p>
                  </div>
                ) : (
                  <div className="article-grid">
                    {pagedPapers.map(a => {
                      const metaList = Array.isArray(a.metadata) ? a.metadata : [];
                      const authorRaw = metaList.find(m => m.key === "dc.contributor.author")?.value || "";
                      const authorNames = authorRaw.split(";").map(s => s.trim()).filter(Boolean);
                      const authorDisplay = authorNames.length > 2
                        ? `${authorNames[0]} et al. (${authorNames.length})`
                        : authorNames.join("; ") || "—";
                      const source = metaList.find(m => m.key === "dc.source")?.value || "";
                      const citedBy = metaList.find(m => m.key === "dc.relation.citedby")?.value || "0";
                      const year = a.lastModified ? new Date(a.lastModified).getFullYear() : "";

                      return (
                        <div key={a.id} className="article-card" onClick={() => onSelectArticle(a)}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <span className="article-type">{a.type || "Article"}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>{year}</span>
                          </div>
                          <h3 className="article-title">{a.name}</h3>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{authorDisplay}</span>
                            {source && (
                              <span style={{ fontSize: "0.75rem", color: "var(--primary-light)", fontStyle: "italic",
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {source}
                              </span>
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem",
                              fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              <BarChart2 size={11} /> Cited by {citedBy}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: "flex", justifyContent: "center", alignItems: "center",
                    gap: "1rem", marginTop: "1.5rem",
                    padding: "0.75rem 1.25rem",
                    background: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0"
                  }}>
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.3rem",
                        padding: "0.4rem 0.9rem", borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        background: page === 1 ? "transparent" : "rgba(59,130,246,0.1)",
                        color: page === 1 ? "#94a3b8" : "#1e3a8a",
                        cursor: page === 1 ? "not-allowed" : "pointer",
                        fontWeight: "600", fontSize: "0.85rem"
                      }}
                    >
                      <ChevronLeft size={15} /> Prev
                    </button>
                    <span style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "600" }}>
                      Page {page} of {totalPages} · {selectedArticles.length} papers
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.3rem",
                        padding: "0.4rem 0.9rem", borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        background: page === totalPages ? "transparent" : "rgba(59,130,246,0.1)",
                        color: page === totalPages ? "#94a3b8" : "#1e3a8a",
                        cursor: page === totalPages ? "not-allowed" : "pointer",
                        fontWeight: "600", fontSize: "0.85rem"
                      }}
                    >
                      Next <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
