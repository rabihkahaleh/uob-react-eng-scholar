import { useMemo, useState } from "react";
import { tracks, themeMap } from "../data/facultyThemes";
import paperThemes from "../data/paperThemes";
import { BarChart2, ChevronDown, ChevronRight, FileText, Tag } from "lucide-react";

export default function ThemeDashboard({ articles, onSelectArticle }) {
  const [expandedTrack, setExpandedTrack] = useState(tracks[0]?.id || null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);

  // Build themeId → articles mapping
  const themeArticles = useMemo(() => {
    const map = {};
    articles.forEach(a => {
      const themeId = paperThemes[a.id];
      if (!themeId) return;
      if (!map[themeId]) map[themeId] = [];
      map[themeId].push(a);
    });
    return map;
  }, [articles]);

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

  const selectedArticles = selectedThemeId ? (themeArticles[selectedThemeId] || []) : [];
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
                            onClick={() => setSelectedThemeId(isSelected ? null : theme.id)}
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
              <div style={{ background: "#fff", border: "1px dashed var(--border)", borderRadius: "16px",
                padding: "3rem", textAlign: "center" }}>
                <Tag size={36} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
                <p style={{ color: "var(--text-muted)", fontWeight: "600" }}>
                  Select a theme to view its publications
                </p>
              </div>
            ) : (
              <div>
                {/* Theme header */}
                <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px",
                  padding: "1.25rem 1.5rem", marginBottom: "1.25rem", boxShadow: "var(--shadow)",
                  borderLeft: `5px solid ${selectedTheme?.color}` }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: "800", color: selectedTheme?.color,
                    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>
                    {selectedTheme?.trackName} · {selectedThemeId}
                  </div>
                  <div style={{ fontWeight: "800", fontSize: "1.05rem", color: "var(--text-main)" }}>
                    {selectedTheme?.name}
                  </div>
                  <div style={{ marginTop: "0.4rem", fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "600" }}>
                    {selectedArticles.length} publication{selectedArticles.length !== 1 ? "s" : ""}
                  </div>
                </div>

                {selectedArticles.length === 0 ? (
                  <div style={{ background: "#fff", border: "1px dashed var(--border)", borderRadius: "12px",
                    padding: "2rem", textAlign: "center" }}>
                    <p style={{ color: "var(--text-muted)" }}>No papers classified in this theme yet.</p>
                  </div>
                ) : (
                  <div className="article-grid">
                    {selectedArticles.map(a => {
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
