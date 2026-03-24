import { X, BookOpen, User, Tag, Calendar, ExternalLink, BarChart2, GraduationCap } from "lucide-react";

export default function ArticleDetails({ metadata, onClose }) {
  if (!metadata) return null;

  const getMeta = (key) => {
    const entry = metadata.find(m => m && m.key === key);
    return entry ? entry.value : null;
  };

  const title = getMeta("dc.title");
  const authorsRaw = getMeta("dc.contributor.author") || "";
  const authorFullRaw = getMeta("dc.contributor.authorfull") || "";
  const date = getMeta("dc.date.issued");

  // Split authors into individual names; strip Scopus IDs like "(1234567890)"
  const authorList = (authorFullRaw || authorsRaw)
    .split(";")
    .map(a => a.replace(/\(\d+\)/g, "").trim())
    .filter(Boolean);
  const source = getMeta("dc.source");
  const volume = getMeta("dc.relation.volume");
  const issue = getMeta("dc.relation.issue");
  const artNo = getMeta("dc.relation.artno");
  const pageStart = getMeta("dc.relation.pagestart");
  const pageEnd = getMeta("dc.relation.pageend");
  const citedBy = getMeta("dc.relation.citedby");
  const doi = getMeta("dc.identifier.doi");
  const scopusLink = getMeta("dc.identifier.scopus");
  const openAccess = getMeta("dc.rights.openaccess");
  const uobInstructors = getMeta("dc.contributor.uobinstructors");

  const subjects = metadata.filter(m => m && m.key === "dc.subject").map(m => m.value);

  // Build citation location string (volume, issue, art/pages)
  let locationParts = [];
  if (volume) locationParts.push(`Vol. ${volume}`);
  if (issue) locationParts.push(`Issue ${issue}`);
  if (artNo) locationParts.push(`Art. No. ${artNo}`);
  else if (pageStart && pageEnd) locationParts.push(`pp. ${pageStart}–${pageEnd}`);
  const locationStr = locationParts.join(', ');

  const isOpenAccess = openAccess && openAccess.toLowerCase() !== '' && openAccess.toLowerCase() !== 'false';

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X /></button>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <div className="article-type" style={{ fontSize: "0.875rem" }}>Research Insight</div>
            {isOpenAccess && (
              <span style={{
                fontSize: "0.7rem", fontWeight: "800", padding: "0.2rem 0.6rem",
                borderRadius: "20px", background: "#d1fae5", color: "#065f46", letterSpacing: "0.5px"
              }}>
                OPEN ACCESS
              </span>
            )}
          </div>

          <h2 style={{ fontSize: "1.4rem", color: "var(--text-main)", lineHeight: "1.4", fontWeight: "800" }}>
            {title || "Research Publication"}
          </h2>

          {/* Stats cards */}
          <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", marginBottom: "0" }}>
            <div className="stat-card" style={{ padding: "1rem" }}>
              <div className="stat-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User size={14} /> Authors
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.25rem" }}>
                {(authorList.length > 0 ? authorList : ["UOB Researcher"]).map((a, i) => (
                  <span key={i} style={{ fontSize: "0.85rem", fontWeight: "600", lineHeight: "1.4" }}>{a}</span>
                ))}
              </div>
            </div>

            <div className="stat-card" style={{ padding: "1rem" }}>
              <div className="stat-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Calendar size={14} /> Published
              </div>
              <div style={{ fontSize: "1rem", fontWeight: "600" }}>{date || "N/A"}</div>
            </div>

            <div className="stat-card" style={{ padding: "1rem" }}>
              <div className="stat-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BarChart2 size={14} /> Cited By
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--primary)" }}>
                {citedBy || "0"}
              </div>
            </div>

            {uobInstructors && (
              <div className="stat-card" style={{ padding: "1rem" }}>
                <div className="stat-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <GraduationCap size={14} /> UOB Instructor(s)
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>{uobInstructors}</div>
              </div>
            )}
          </div>

          {/* Journal / Source */}
          {source && (
            <div className="stat-card" style={{ padding: "1rem" }}>
              <div className="stat-label" style={{ marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={14} /> Journal / Conference
              </div>
              <div style={{ fontWeight: "700", color: "var(--primary)", fontSize: "0.95rem" }}>{source}</div>
              {locationStr && (
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{locationStr}</div>
              )}
            </div>
          )}

          {/* Links row */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {doi && (
              <a
                href={`https://doi.org/${doi}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.5rem 1rem", borderRadius: "8px",
                  background: "var(--primary)", color: "white",
                  fontSize: "0.8rem", fontWeight: "700", textDecoration: "none"
                }}
              >
                <ExternalLink size={13} /> DOI: {doi}
              </a>
            )}
            {scopusLink && (
              <a
                href={scopusLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.5rem 1rem", borderRadius: "8px",
                  border: "1px solid var(--border)", color: "var(--primary)",
                  fontSize: "0.8rem", fontWeight: "700", textDecoration: "none"
                }}
              >
                <ExternalLink size={13} /> View on Scopus
              </a>
            )}
          </div>

          {subjects.length > 0 && (
            <div>
              <div className="stat-label" style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Tag size={16} /> Keywords
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {subjects.map((s, i) => (
                  <span key={i} style={{
                    padding: "0.35rem 0.8rem",
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.2)",
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
    </div>
  );
}
