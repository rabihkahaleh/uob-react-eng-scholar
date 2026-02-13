import React, { useState, useMemo } from "react";
import { Search, FileText, ChevronRight, User } from "lucide-react";

export default function ArticleList({ articles, currentDeptId, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = useMemo(() => {
    // Determine the base set: if searching, use all; otherwise, filter by dept
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

      const authors = metadataList
        .filter(m => m.key === "dc.contributor.author")
        .map(m => m.value?.toLowerCase() || "");

      const authorMatch = authors.some(author => author.includes(term));
      return nameMatch || idMatch || authorMatch;
    });
  }, [articles, searchTerm, currentDeptId]);

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
        <div className="article-grid">
          {filteredArticles.map((a) => (
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
      )}
    </div>
  );
}