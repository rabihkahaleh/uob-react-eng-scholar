import React, { useState, useMemo } from "react";
import { Search, FileText, ChevronRight, User } from "lucide-react";

export default function ArticleList({ articles, selectedDept, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articles;
    const term = searchTerm.toLowerCase();
    return articles.filter(a => {
      const nameMatch = a.name?.toLowerCase().includes(term);
      const idMatch = a.id?.toString().includes(term);

      // Author search logic (checking expanded metadata)
      const authors = Array.isArray(a.metadata)
        ? a.metadata.filter(m => m.key === "dc.contributor.author").map(m => m.value?.toLowerCase())
        : [];
      const authorMatch = authors.some(author => author?.includes(term));

      return nameMatch || idMatch || authorMatch;
    });
  }, [articles, searchTerm]);

  if (!articles || articles.length === 0) {
    return (
      <div className="chart-container" style={{ textAlign: "center", padding: "3rem" }}>
        <FileText size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
        <p>No articles found for this department.</p>
      </div>
    );
  }

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

      {searchTerm && filteredArticles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "12px", border: "1px dashed var(--border)" }}>
          <p style={{ color: "var(--text-muted)" }}>No publications match "{searchTerm}"</p>
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
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
              <h3 className="article-title">{a.name}</h3>
              <div className="article-meta">
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <User size={12} /> {Array.isArray(a.metadata) && a.metadata.find(m => m.key === "dc.contributor.author")?.value || "UOB Researcher"}
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