import { useMemo, useState } from "react";
import { BarChart2, BookOpen, Search, ChevronLeft, X } from "lucide-react";

export default function JournalsDashboard({ articles, onSelectArticle }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("count"); // "count" | "alpha"
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [paperSearch, setPaperSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 12;

  // Build journal → {count, citations, papers[]} map
  const journalsMap = useMemo(() => {
    const map = {};
    const seen = new Set();
    articles.forEach(a => {
      if (seen.has(a.id)) return;
      seen.add(a.id);
      const metaList = Array.isArray(a.metadata) ? a.metadata : [];
      const source = (metaList.find(m => m.key === "dc.source")?.value || "").trim();
      const name = source || "Unknown Journal";
      const cited = parseInt(metaList.find(m => m.key === "dc.relation.citedby")?.value || "0", 10);
      if (!map[name]) map[name] = { name, count: 0, citations: 0, papers: [] };
      map[name].count++;
      map[name].citations += cited;
      map[name].papers.push(a);
    });
    return map;
  }, [articles]);

  const journalsList = useMemo(() => {
    let list = Object.values(journalsMap);
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(j => j.name.toLowerCase().includes(term));
    }
    if (sortBy === "alpha") return list.sort((a, b) => a.name.localeCompare(b.name));
    return list.sort((a, b) => b.count - a.count);
  }, [journalsMap, search, sortBy]);

  const totalJournals = Object.keys(journalsMap).length;
  const totalPapers = articles.length;

  // Papers for selected journal
  const journalPapers = useMemo(() => {
    if (!selectedJournal) return [];
    const base = journalsMap[selectedJournal]?.papers || [];
    if (!paperSearch.trim()) return base;
    const term = paperSearch.toLowerCase();
    return base.filter(a => {
      const metaList = Array.isArray(a.metadata) ? a.metadata : [];
      const authors = metaList.find(m => m.key === "dc.contributor.author")?.value || "";
      return a.name?.toLowerCase().includes(term) || authors.toLowerCase().includes(term);
    });
  }, [selectedJournal, journalsMap, paperSearch]);

  const totalPages = Math.ceil(journalPapers.length / perPage);
  const pagedPapers = journalPapers.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="header-title">
          <h1>Journals</h1>
          <p>Faculty of Engineering · Publication Venues</p>
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600",
          background: "#fff", border: "1px solid var(--border)", borderRadius: "10px",
          padding: "0.5rem 1rem", display: "flex", gap: "1rem" }}>
          <span><strong style={{ color: "var(--text-main)" }}>{totalJournals}</strong> journals</span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span><strong style={{ color: "var(--text-main)" }}>{totalPapers}</strong> publications</span>
        </div>
      </div>

      {selectedJournal ? (
        /* ── Journal drill-down view ── */
        <div className="fade-in">
          {/* Back button + header */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px",
            padding: "1.25rem 1.5rem", marginBottom: "1.25rem", boxShadow: "var(--shadow)",
            borderLeft: "5px solid var(--primary)" }}>
            <button
              onClick={() => { setSelectedJournal(null); setPaperSearch(""); setPage(1); }}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none",
                border: "none", cursor: "pointer", color: "var(--primary)", fontWeight: "700",
                fontSize: "0.82rem", marginBottom: "0.75rem", padding: 0 }}
            >
              <ChevronLeft size={15} /> Back to all journals
            </button>
            <div style={{ fontWeight: "800", fontSize: "1.05rem", color: "var(--text-main)", marginBottom: "0.35rem" }}>
              {selectedJournal}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "600", display: "flex", gap: "0.75rem" }}>
              <span>{journalsMap[selectedJournal]?.count} paper{journalsMap[selectedJournal]?.count !== 1 ? "s" : ""}</span>
              <span style={{ color: "var(--border)" }}>|</span>
              <span>{journalsMap[selectedJournal]?.citations} total citations</span>
            </div>
          </div>

          {/* Paper search */}
          <div style={{ position: "relative", maxWidth: "480px", marginBottom: "1.25rem" }}>
            <Search size={15} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
            <input
              type="text"
              placeholder="Search papers in this journal..."
              value={paperSearch}
              onChange={e => { setPaperSearch(e.target.value); setPage(1); }}
              style={{
                width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem",
                border: "1px solid #e2e8f0", borderRadius: "10px",
                background: "#fff", color: "#0f172a", fontSize: "0.85rem",
                outline: "none", fontFamily: "inherit"
              }}
            />
            {paperSearch && (
              <button onClick={() => setPaperSearch("")}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="article-grid">
            {pagedPapers.map(a => {
              const metaList = Array.isArray(a.metadata) ? a.metadata : [];
              const authorRaw = metaList.find(m => m.key === "dc.contributor.author")?.value || "";
              const authorNames = authorRaw.split(";").map(s => s.trim()).filter(Boolean);
              const authorDisplay = authorNames.length > 2
                ? `${authorNames[0]} et al. (${authorNames.length})`
                : authorNames.join("; ") || "—";
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
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      <BarChart2 size={11} /> Cited by {citedBy}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center",
              gap: "1rem", marginTop: "1.5rem", padding: "0.75rem 1.25rem",
              background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                style={{ padding: "0.4rem 0.9rem", borderRadius: "8px", border: "1px solid #e2e8f0",
                  background: page === 1 ? "transparent" : "rgba(59,130,246,0.1)",
                  color: page === 1 ? "#94a3b8" : "#1e3a8a", cursor: page === 1 ? "not-allowed" : "pointer",
                  fontWeight: "600", fontSize: "0.85rem" }}>
                ← Prev
              </button>
              <span style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "600" }}>
                Page {page} of {totalPages} · {journalPapers.length} papers
              </span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                style={{ padding: "0.4rem 0.9rem", borderRadius: "8px", border: "1px solid #e2e8f0",
                  background: page === totalPages ? "transparent" : "rgba(59,130,246,0.1)",
                  color: page === totalPages ? "#94a3b8" : "#1e3a8a", cursor: page === totalPages ? "not-allowed" : "pointer",
                  fontWeight: "600", fontSize: "0.85rem" }}>
                Next →
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── All journals list view ── */
        <div>
          {/* Search + sort controls */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "280px", maxWidth: "520px" }}>
              <Search size={15} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
              <input
                type="text"
                placeholder="Search journals by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "0.65rem 1rem 0.65rem 2.5rem",
                  border: "1px solid #e2e8f0", borderRadius: "10px",
                  background: "#fff", color: "#0f172a", fontSize: "0.85rem",
                  outline: "none", fontFamily: "inherit"
                }}
              />
              {search && (
                <button onClick={() => setSearch("")}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{ display: "flex", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
              {[{ value: "count", label: "Most Papers" }, { value: "alpha", label: "A–Z" }].map(opt => (
                <button key={opt.value} onClick={() => setSortBy(opt.value)}
                  style={{
                    padding: "0.6rem 1.1rem", border: "none", cursor: "pointer",
                    background: sortBy === opt.value ? "var(--primary)" : "transparent",
                    color: sortBy === opt.value ? "#fff" : "#475569",
                    fontWeight: "600", fontSize: "0.82rem", transition: "all 0.2s"
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>

            {search && (
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "600" }}>
                {journalsList.length} result{journalsList.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Journals grid */}
          {journalsList.length === 0 ? (
            <div style={{ background: "#fff", border: "1px dashed var(--border)", borderRadius: "16px",
              padding: "4rem 2rem", textAlign: "center" }}>
              <BookOpen size={40} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
              <p style={{ color: "var(--text-muted)", fontWeight: "600" }}>No journals found matching "{search}"</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1rem" }}>
              {journalsList.map((j, idx) => {
                const barWidth = Math.max(6, Math.round((j.count / journalsList[0].count) * 100));
                return (
                  <div
                    key={j.name}
                    onClick={() => { setSelectedJournal(j.name); setPage(1); setPaperSearch(""); }}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      padding: "1rem 1.25rem",
                      cursor: "pointer",
                      boxShadow: "var(--shadow)",
                      transition: "all 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem"
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(30,58,138,0.1)"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)", lineHeight: "1.4", flex: 1 }}>
                        {j.name}
                      </span>
                      <span style={{
                        background: "var(--primary)", color: "#fff",
                        fontWeight: "800", fontSize: "0.8rem",
                        padding: "0.2rem 0.6rem", borderRadius: "20px", flexShrink: 0
                      }}>
                        {j.count}
                      </span>
                    </div>

                    {/* Mini bar */}
                    <div style={{ height: "4px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${barWidth}%`, background: "var(--primary)", borderRadius: "4px", transition: "width 0.4s ease" }} />
                    </div>

                    <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                      <span>{j.count} paper{j.count !== 1 ? "s" : ""}</span>
                      <span>{j.citations} citation{j.citations !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
