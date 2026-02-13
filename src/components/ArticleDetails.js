import React from "react";
import { X, BookOpen, User, Tag, Calendar } from "lucide-react";

export default function ArticleDetails({ metadata, onClose }) {
  if (!metadata) return null;

  const getMeta = (key) => {
    const entry = metadata.find(m => m && (m.key === key || (m.schema === key.split('.')[0] && m.element === key.split('.')[1])));
    return entry ? entry.value : null;
  };

  const title = getMeta("dc.title");
  const authors = metadata.filter(m => m && m.key === "dc.contributor.author").map(m => m.value).join(", ");
  const date = getMeta("dc.date.issued");
  const subjects = metadata.filter(m => m && m.key === "dc.subject").map(m => m.value);
  const abstract = metadata.find(
    (m) => m && (
      (m["schema"] === "dc" && m["element"] === "description") ||
      (m["key"] && (m["key"] === "dc.description.abstract" || m["key"] === "dc.description"))
    )
  );

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X /></button>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="article-type" style={{ fontSize: "0.875rem" }}>Research Insight</div>
          <h2 style={{ fontSize: "1.75rem", color: "var(--primary)" }}>{title || "Research Publication"}</h2>

          <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: "0" }}>
            <div className="stat-card" style={{ padding: "1rem" }}>
              <div className="stat-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User size={14} /> Authors
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>{authors || "UOB Researcher"}</div>
            </div>
            <div className="stat-card" style={{ padding: "1rem" }}>
              <div className="stat-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Calendar size={14} /> Published
              </div>
              <div style={{ fontSize: "1rem", fontWeight: "600" }}>{date || "N/A"}</div>
            </div>
          </div>

          <div>
            <div className="stat-label" style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BookOpen size={16} /> Abstract
            </div>
            <div className="abstract-text">
              {abstract ? abstract.value : "No abstract available for this publication."}
            </div>
          </div>

          {subjects.length > 0 && (
            <div>
              <div className="stat-label" style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Tag size={16} /> Keywords
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {subjects.map((s, i) => (
                  <span key={i} style={{
                    padding: "0.4rem 0.8rem",
                    background: "var(--bg)",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "var(--primary)"
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}