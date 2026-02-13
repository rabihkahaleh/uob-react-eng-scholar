import React, { useState, useMemo, useEffect } from "react";
import { Search, FileText, ChevronRight, ChevronLeft, User } from "lucide-react";

export default function ArticleList({ articles, currentDeptId, onSelect, searchTerm, setSearchTerm }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, currentDeptId, articles]);

  const filteredArticles = useMemo(() => {
    // Determine the base set: if searching, use all; otherwise, filter by dept
    let baseSet = articles;
    if (!searchTerm && currentDeptId) {
      baseSet = articles.filter(a => a.deptId === currentDeptId);
    }

    if (!searchTerm) return baseSet;

    const term = searchTerm.toLowerCase();

    // When searching, look across the whole set provided (App.js ensures this is Faculty-wide if needed)
    return articles.filter(a => {
      const nameMatch = a.name?.toLowerCase().includes(term);
      const idMatch = a.id?.toString().includes(term);

      const rawMeta = a.metadata;
      const metadataList = Array.isArray(rawMeta) ? rawMeta : (rawMeta ? [rawMeta] : []);

      const authors = metadataList
        .filter(m => m.key === "dc.contributor.author")
        .map(m => m.value?.toLowerCase() || "");

      const authorMatch = authors.some(author => author.includes(term));
      return nameMatch || idMatch || authorMatch;
    });
  }, [articles, searchTerm, currentDeptId]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Removed auto-scroll as requested
    }
  };

  return (
    <div className="fade-in">
      <div className="search-container">
        <Search className="search-icon" size={24} />
        <input
          type="text"
          className="search-input"
          placeholder="DISCOVER RESEARCH BY TITLE, AUTHOR, OR ID..."
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
        <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "12px", border: "1px dashed var(--border)" }}>
          <FileText size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
          <p style={{ color: "var(--text-muted)" }}>{searchTerm ? `No publications match "${searchTerm}"` : "No articles found in this department."}</p>
        </div>
      ) : (
        <>
          <div className="article-grid">
            {currentItems.map((a) => (
              <div
                key={a.id}
                className="article-card"
                onClick={() => onSelect(a)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span className="article-type">{a.type || "Research Paper"}</span>
                  {a.deptName && (
                    <span style={{
                      fontSize: '0.6rem',
                      background: 'var(--bg)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: '800',
                      color: 'var(--primary)',
                      textTransform: 'uppercase'
                    }}>
                      {a.deptName}
                    </span>
                  )}
                </div>
                <h3 className="article-title">{a.name}</h3>
                <div className="article-meta">
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <User size={12} /> {
                      (Array.isArray(a.metadata) ? a.metadata : (a.metadata ? [a.metadata] : []))
                        .find(m => m.key === "dc.contributor.author")?.value || "UOB Researcher"
                    }
                  </span>
                  <span style={{ color: "var(--text-muted)", marginLeft: "auto" }}>ID: {a.id}</span>
                  {a.lastModified && <span style={{ color: "var(--text-muted)" }}>{new Date(a.lastModified).getFullYear()}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "2rem",
            padding: "1rem",
            background: "white",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>
                Showing {filteredArticles.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredArticles.length)} of {filteredArticles.length}
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
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.5rem 1rem",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: currentPage === 1 ? "var(--bg)" : "white",
                  color: currentPage === 1 ? "var(--text-muted)" : "var(--primary)",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  transition: "all 0.2s"
                }}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <span style={{ color: "var(--text)", fontWeight: "600", fontSize: "0.9rem" }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.5rem 1rem",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: currentPage === totalPages ? "var(--bg)" : "white",
                  color: currentPage === totalPages ? "var(--text-muted)" : "var(--primary)",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  transition: "all 0.2s"
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