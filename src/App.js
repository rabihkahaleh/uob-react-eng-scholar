import React, { useState, useEffect } from "react";
import { getDepartments, getArticles, getArticleMetadata } from "./api";
import Dashboard from "./components/Dashboard";
import ArticleList from "./components/ArticleList";
import ArticleDetails from "./components/ArticleDetails";
import { GraduationCap, Home } from "lucide-react";

function App() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const deps = await getDepartments();
        setDepartments(Array.isArray(deps) ? deps : [deps]);
      } catch (err) {
        console.error("Failed to load departments", err);
      }
    }
    load();
  }, []);

  async function handleSelectDepartment(dept) {
    setSelectedDept(dept);
    setSelectedArticle(null);
    try {
      const items = await getArticles(dept.id);
      setArticles(Array.isArray(items) ? items : [items]);
    } catch (err) {
      console.error("Failed to load articles", err);
      setArticles([]);
    }
  }

  async function handleSelectArticle(article) {
    try {
      const meta = await getArticleMetadata(article.id);
      setMetadata(Array.isArray(meta) ? meta : [meta]);
      setSelectedArticle(article);
    } catch (err) {
      console.error("Failed to load article metadata", err);
    }
  }

  const goHome = () => {
    setSelectedDept(null);
    setArticles([]);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ textAlign: "center", borderBottom: "none" }}>
          <div style={{
            background: "white",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            margin: "0 auto 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--primary)",
            fontSize: "1.5rem",
            fontWeight: "900",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}>
            UOB
          </div>
          <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>RESEARCH PORTAL</div>
          <div style={{ fontSize: "0.6rem", color: "var(--secondary)", marginTop: "0.2rem", letterSpacing: "1px", fontWeight: "700" }}>
            FACULTY OF ENGINEERING
          </div>
        </div>

        <nav style={{ overflowY: "auto", flex: 1, marginRight: "-1rem", paddingRight: "1rem" }}>
          <ul className="nav-list">
            <li className={`nav-item ${!selectedDept ? "active" : ""}`} onClick={goHome}>
              <Home size={18} /> Overview
            </li>
            <div style={{ margin: "1rem 0 0.5rem 0", color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontWeight: "800", textTransform: "uppercase" }}>
              Departments
            </div>
            {departments.map((dept) => (
              <li
                key={dept.id}
                className={`nav-item ${selectedDept?.id === dept.id ? "active" : ""}`}
                onClick={() => handleSelectDepartment(dept)}
                style={{ justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <GraduationCap size={18} /> {dept.name.replace("Department of ", "")}
                </div>
                <span style={{
                  fontSize: "0.7rem",
                  background: selectedDept?.id === dept.id ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "10px",
                  fontWeight: "700"
                }}>
                  {dept.numberItems}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Dashboard
          departments={departments}
          selectedDept={selectedDept}
          articles={articles}
        />

        {selectedDept && (
          <div className="fade-in" style={{ marginTop: "3rem" }}>
            <div className="section-divider">
              <h2>Research Publications</h2>
              <div className="line"></div>
            </div>
            <ArticleList
              articles={articles}
              selectedDept={selectedDept}
              onSelect={handleSelectArticle}
            />
          </div>
        )}

        {selectedArticle && (
          <ArticleDetails
            metadata={metadata}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;