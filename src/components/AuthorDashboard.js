import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LabelList
} from "recharts";
import { FileText, BarChart2, Award, ChevronLeft, ChevronRight, Search, Tag, Download } from "lucide-react";
import paperThemes from "../data/paperThemes";
import { themeMap } from "../data/facultyThemes";

export default function AuthorDashboard({ authorName, articles, onSelectArticle }) {
  // Papers where this UOB instructor is listed
  const authorPapers = useMemo(() => {
    const uniqueIds = new Set();
    const result = [];
    articles.forEach(a => {
      if (uniqueIds.has(a.id)) return;
      const metaList = Array.isArray(a.metadata) ? a.metadata : [];
      const val = metaList.find(m => m.key === "dc.contributor.uobinstructors")?.value || "";
      if (val.split(";").map(s => s.trim()).includes(authorName)) {
        uniqueIds.add(a.id);
        result.push(a);
      }
    });
    return result;
  }, [articles, authorName]);

  // Stats
  const stats = useMemo(() => {
    const totalCitations = authorPapers.reduce((sum, a) => {
      const metaList = Array.isArray(a.metadata) ? a.metadata : [];
      const cited = parseInt(metaList.find(m => m.key === "dc.relation.citedby")?.value || "0", 10);
      return sum + cited;
    }, 0);

    const mostCited = authorPapers.reduce((best, a) => {
      const metaList = Array.isArray(a.metadata) ? a.metadata : [];
      const cited = parseInt(metaList.find(m => m.key === "dc.relation.citedby")?.value || "0", 10);
      return cited > (best?.citedBy || 0) ? { title: a.name, citedBy: cited } : best;
    }, null);

    return { totalCitations, mostCited, totalPapers: authorPapers.length };
  }, [authorPapers]);

  // Publication timeline
  const timelineData = useMemo(() => {
    const counts = {};
    authorPapers.forEach(a => {
      const year = a.lastModified ? new Date(a.lastModified).getFullYear() : null;
      if (year && year >= 2000) counts[year] = (counts[year] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([year, value]) => ({ name: String(year), value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [authorPapers]);

  // Citations per year
  const citationsTimeline = useMemo(() => {
    const counts = {};
    authorPapers.forEach(a => {
      const year = a.lastModified ? new Date(a.lastModified).getFullYear() : null;
      const metaList = Array.isArray(a.metadata) ? a.metadata : [];
      const cited = parseInt(metaList.find(m => m.key === "dc.relation.citedby")?.value || "0", 10);
      if (year && year >= 2000) counts[year] = (counts[year] || 0) + cited;
    });
    return Object.entries(counts)
      .map(([year, value]) => ({ name: String(year), value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [authorPapers]);


  const deptName = authorPapers[0]?.deptName || "";

  // Search + pagination for papers list
  const [paperSearch, setPaperSearch] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [page, setPage] = useState(1);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const perPage = 12;

  // Group author papers by theme
  const themePapersMap = useMemo(() => {
    const map = {};
    authorPapers.forEach(a => {
      const themeId = paperThemes[a.id];
      if (themeId && themeMap[themeId]) {
        if (!map[themeId]) map[themeId] = [];
        map[themeId].push(a);
      }
    });
    return map;
  }, [authorPapers]);

  const authorThemes = useMemo(() => {
    return Object.keys(themePapersMap).map(themeId => {
      const papers = themePapersMap[themeId];
      const citations = papers.reduce((sum, p) => {
        const metaList = Array.isArray(p.metadata) ? p.metadata : [];
        return sum + parseInt(metaList.find(m => m.key === "dc.relation.citedby")?.value || "0", 10);
      }, 0);
      return {
        themeId,
        name: themeMap[themeId].name,
        trackName: themeMap[themeId].trackName,
        color: themeMap[themeId].color,
        paperCount: papers.length,
        citations
      };
    }).sort((a, b) => b.paperCount - a.paperCount);
  }, [themePapersMap]);

  const filteredPapers = useMemo(() => {
    let basePapers = authorPapers;
    if (selectedThemeId) {
      basePapers = themePapersMap[selectedThemeId] || [];
    }

    const sorted = basePapers
      .slice()
      .sort((a, b) => {
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
  }, [authorPapers, paperSearch, sortOption]);

  const totalPages = Math.ceil(filteredPapers.length / perPage);
  const pagedPapers = useMemo(
    () => filteredPapers.slice((page - 1) * perPage, page * perPage),
    [filteredPapers, page]
  );

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="header-title">
          <h1>{authorName}</h1>
          <p>{deptName}{deptName ? " · " : ""}UOB Researcher Profile</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-label"><FileText size={14} style={{ marginRight: 6, marginBottom: -2 }} />Publications</div>
          <div className="stat-value">{stats.totalPapers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><BarChart2 size={14} style={{ marginRight: 6, marginBottom: -2 }} />Total Citations</div>
          <div className="stat-value">{stats.totalCitations}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><Award size={14} style={{ marginRight: 6, marginBottom: -2 }} />Avg. Citations / Paper</div>
          <div className="stat-value">
            {stats.totalPapers > 0 ? (stats.totalCitations / stats.totalPapers).toFixed(1) : "—"}
          </div>
        </div>
      </div>

      {/* Most cited paper */}
      {stats.mostCited && stats.mostCited.citedBy > 0 && (
        <div className="stat-card" style={{ marginBottom: "1.5rem", padding: "1rem 1.25rem" }}>
          <div className="stat-label" style={{ marginBottom: "0.4rem" }}>
            <Award size={14} style={{ marginRight: 6, marginBottom: -2 }} />Most Cited Paper · {stats.mostCited.citedBy} citations
          </div>
          <div style={{ fontWeight: "700", color: "var(--primary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
            {stats.mostCited.title}
          </div>
        </div>
      )}

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div className="chart-container">
          <h3 className="chart-title">Publications Per Year</h3>
          <div style={{ height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#fff", borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0/0.1)" }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="value" position="top" style={{ fill: "var(--primary)", fontWeight: "bold", fontSize: "11px" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Citations Per Year</h3>
          <div style={{ height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={citationsTimeline} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#fff", borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0/0.1)" }} />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="value" position="top" style={{ fill: "#b45309", fontWeight: "bold", fontSize: "11px" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      {/* Lower Section: Themes Tabs & Papers List */}
      <div style={{ display: "grid", gridTemplateColumns: authorThemes.length > 0 ? "280px 1fr" : "1fr", gap: "2rem", marginTop: "1.5rem" }}>
        
        {/* Left Column: Themes Tabs */}
        {authorThemes.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <h3 style={{ fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--text-main)" }}>
              <Tag size={16} /> Research Themes
            </h3>
            
            <div
              onClick={() => { setSelectedThemeId(null); setPage(1); }}
              style={{
                padding: "0.75rem 1rem",
                background: selectedThemeId === null ? "var(--primary)" : "#ffffff",
                color: selectedThemeId === null ? "#ffffff" : "#475569",
                border: "1px solid",
                borderColor: selectedThemeId === null ? "var(--primary)" : "#e2e8f0",
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s",
                fontWeight: selectedThemeId === null ? "700" : "600",
                fontSize: "0.85rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
              }}
            >
              <span>All Publications</span>
              <span style={{ fontSize: "0.7rem", fontWeight: "800", background: selectedThemeId === null ? "rgba(255,255,255,0.25)" : "#f1f5f9", color: selectedThemeId === null ? "#fff" : "#475569", padding: "0.15rem 0.5rem", borderRadius: "20px" }}>
                {stats.totalPapers}
              </span>
            </div>

            {authorThemes.map(t => (
              <div
                key={t.themeId}
                onClick={() => { setSelectedThemeId(t.themeId); setPage(1); }}
                style={{
                  padding: "0.75rem 1rem",
                  background: selectedThemeId === t.themeId ? `${t.color}10` : "#ffffff",
                  border: "1px solid",
                  borderColor: selectedThemeId === t.themeId ? t.color : "#e2e8f0",
                  borderLeft: selectedThemeId === t.themeId ? `4px solid ${t.color}` : `1px solid #e2e8f0`,
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: selectedThemeId === t.themeId ? "700" : "600", color: selectedThemeId === t.themeId ? "#0f172a" : "#475569", lineHeight: "1.3", paddingRight: "0.5rem" }}>
                    {t.name}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.2rem" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: "800", color: t.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t.trackName} · {t.themeId}
                  </span>
                  <span style={{ fontSize: "0.7rem", fontWeight: "800", background: selectedThemeId === t.themeId ? t.color : "#f1f5f9", color: selectedThemeId === t.themeId ? "#fff" : "#475569", padding: "0.15rem 0.5rem", borderRadius: "20px" }}>
                    {t.paperCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Right Column: Papers List */}
        <div key={selectedThemeId || 'all'} className="fade-in">
          <div className="section-divider" style={{ margin: "0 0 1.5rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
              <h2 style={{ fontSize: "1.2rem", margin: 0 }}>
                {selectedThemeId ? `Publications in ${themeMap[selectedThemeId]?.name}` : "Publications"}
              </h2>
              <button
                onClick={() => {
                  const exportPapers = filteredPapers;
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
                  link.setAttribute("download", `${authorName.replace(/\s+/g, '_')}_Publications.csv`);
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                }}
                style={{
                  padding: "0.45rem 0.8rem", background: "#f8fafc", color: "#334155",
                  border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: "700",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "all 0.2s"
                }}
                onMouseOver={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#94a3b8"; }}
                onMouseOut={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
              >
                <Download size={15} /> Export to Excel
              </button>
            </div>
            <div className="line" style={{ marginTop: "0.5rem" }} />
          </div>

          {/* Paper search and sort */}
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
                  {filteredPapers.length} found
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

          <div className="article-grid">
            {pagedPapers.map(a => {
              const metaList = Array.isArray(a.metadata) ? a.metadata : [];
              const authors = metaList.find(m => m.key === "dc.contributor.author")?.value || "";
              const authorNames = authors.split(";").map(s => s.trim()).filter(Boolean);
              const authorDisplay = authorNames.length > 2
                ? `${authorNames[0]} et al. (${authorNames.length})`
                : authorNames.join("; ") || "—";
              const source = metaList.find(m => m.key === "dc.source")?.value || "";
              const citedBy = metaList.find(m => m.key === "dc.relation.citedby")?.value || "0";
              const year = a.lastModified ? new Date(a.lastModified).getFullYear() : "";

              return (
                <div
                  key={a.id}
                  className="article-card"
                  onClick={() => onSelectArticle(a)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span className="article-type">{a.type || "Article"}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>{year}</span>
                  </div>
                  <h3 className="article-title">{a.name}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{authorDisplay}</span>
                    {source && (
                      <span style={{ fontSize: "0.75rem", color: "var(--primary-light)", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {source}
                      </span>
                    )}
                    <span style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <BarChart2 size={11} /> Cited by {citedBy}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

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
                Page {page} of {totalPages} · {filteredPapers.length} papers
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
      </div>
    </div>
  );
}
