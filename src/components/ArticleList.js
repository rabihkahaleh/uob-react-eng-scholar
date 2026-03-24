import { useState, useMemo, useEffect } from "react";
import { Search, FileText, ChevronRight, ChevronLeft, User, BarChart2 } from "lucide-react";

export default function ArticleList({ articles, currentDeptId, onSelect, searchTerm, setSearchTerm }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, currentDeptId, articles]);

  const filteredArticles = useMemo(() => {
    let baseSet = articles;
    if (!searchTerm && currentDeptId) {
      baseSet = articles.filter(a => a.deptId === currentDeptId);
    }

    if (!searchTerm) return baseSet;

    const term = searchTerm.toLowerCase();

    return articles.filter(a => {
      const nameMatch = a.name?.toLowerCase().includes(term);
      const idMatch = a.id?.toString().includes(term);

      const rawMeta = a.metadata;
      const metadataList = Array.isArray(rawMeta) ? rawMeta : (rawMeta ? [rawMeta] : []);

      const authorMatch = metadataList
        .filter(m => m.key === "dc.contributor.author")
        .some(m => m.value?.toLowerCase().includes(term));

      const sourceMatch = metadataList
        .find(m => m.key === "dc.source")?.value?.toLowerCase().includes(term);

      return nameMatch || idMatch || authorMatch || sourceMatch;
    });
  }, [articles, searchTerm, currentDeptId]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="fade-in">
      <div className="search-container">
        <Search className="search-icon" size={24} />
        <input
          type="text"
          className="search-input"
          placeholder="DISCOVER RESEARCH BY TITLE, AUTHOR, JOURNAL, OR ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <div className="search-badge">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'MATCH' : 'MATCHES'}
          </div>
        )}
      </div>

      {searchTerm && (
        <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>
          Searching across ALL engineering departments...
        </div>
      )}

      {filteredArticles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#ffffff", borderRadius: "12px", border: "1px dashed #e2e8f0" }}>
          <FileText size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
          <p style={{ color: "var(--text-muted)" }}>{searchTerm ? `No publications match "${searchTerm}"` : "No articles found in this department."}</p>
        </div>
      ) : (
        <>
          <div className="article-grid">
            {currentItems.map((a) => {
              const metaList = Array.isArray(a.metadata) ? a.metadata : (a.metadata ? [a.metadata] : []);
              const authorRaw = metaList.find(m => m.key === "dc.contributor.author")?.value || "";
              const authorNames = authorRaw.split(";").map(a => a.trim()).filter(Boolean);
              const authorDisplay = authorNames.length > 2
                ? `${authorNames[0]} et al. (${authorNames.length})`
                : authorNames.join("; ") || "Scopus Author";
              const source = metaList.find(m => m.key === "dc.source")?.value || "";
              const citedBy = metaList.find(m => m.key === "dc.relation.citedby")?.value || "0";
              const year = a.lastModified ? new Date(a.lastModified).getFullYear() : "";

              return (
                <div
                  key={a.id}
                  className="article-card"
                  onClick={() => onSelect(a)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span className="article-type">{a.type || "Article"}</span>
                    {a.deptName && (
                      <span style={{
                        fontSize: '0.6rem',
                        background: 'rgba(59,130,246,0.1)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: '800',
                        color: '#1e3a8a',
                        textTransform: 'uppercase'
                      }}>
                        {a.deptName}
                      </span>
                    )}
                  </div>

                  <h3 className="article-title">{a.name}</h3>

                  <div className="article-meta">
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem" }}>
                          <User size={12} /> {authorDisplay}
                        </span>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{year}</span>
                      </div>

                      {source && (
                        <span style={{
                          fontSize: "0.75rem", color: "var(--primary)",
                          fontStyle: "italic", overflow: "hidden",
                          textOverflow: "ellipsis", whiteSpace: "nowrap"
                        }}>
                          {source}
                        </span>
                      )}

                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        <BarChart2 size={11} />
                        <span>Cited by {citedBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "2rem",
            padding: "1rem 1.25rem",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>
                Showing {filteredArticles.length > 0 ? indexOfFirstItem + 1 : 0}–{Math.min(indexOfLastItem, filteredArticles.length)} of {filteredArticles.length}
              </span>
              <div style={{ width: "1px", height: "15px", background: "var(--border)" }}></div>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                style={{
                  padding: "0.3rem 0.5rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.3rem",
                  padding: "0.5rem 1rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  background: currentPage === 1 ? "transparent" : "rgba(59,130,246,0.1)",
                  color: currentPage === 1 ? "#94a3b8" : "#1e3a8a",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontWeight: "600", transition: "all 0.2s", fontSize: "0.85rem"
                }}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <span style={{ color: "#64748b", fontWeight: "600", fontSize: "0.85rem" }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.3rem",
                  padding: "0.5rem 1rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  background: currentPage === totalPages ? "transparent" : "rgba(59,130,246,0.1)",
                  color: currentPage === totalPages ? "#94a3b8" : "#1e3a8a",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontWeight: "600", transition: "all 0.2s", fontSize: "0.85rem"
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
