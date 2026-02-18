import React, { useState, useEffect, useCallback } from "react";
import { getDepartments, getArticles, getArticleMetadata } from "./api";
import Dashboard from "./components/Dashboard";
import ArticleList from "./components/ArticleList";
import ArticleDetails from "./components/ArticleDetails";
import { GraduationCap, Home, Loader2 } from "lucide-react";

function App() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState({ percent: 0, message: "Connecting to ScholarHub..." });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function init() {
      setLoading(true);
      setLoadingProgress({ percent: 5, message: "Connecting to ScholarHub..." });
      try {
        const deps = await getDepartments();
        const depArray = Array.isArray(deps) ? deps : [deps];
        setDepartments(depArray);
        setLoadingProgress({ percent: 10, message: `Found ${depArray.length} departments. Loading publications...` });

        const allFetched = [];
        for (let i = 0; i < depArray.length; i++) {
          const d = depArray[i];
          const deptName = d.name.replace("Department of ", "");
          setLoadingProgress({
            percent: 10 + Math.round(((i) / depArray.length) * 85),
            message: `Loading ${deptName}... (${i + 1}/${depArray.length})`
          });
          try {
            const items = await getArticles(d.id, d.numberItems || 1000);
            const itemsArray = Array.isArray(items) ? items : [items];
            allFetched.push(
              ...itemsArray.map(item => ({
                ...item,
                deptId: d.id,
                deptName: deptName
              }))
            );
          } catch (e) {
            console.error(`Failed for dept ${d.id}`, e);
          }
        }

        setLoadingProgress({ percent: 98, message: "Finalizing data..." });
        setAllArticles(allFetched.filter(Boolean));
        setLoadingProgress({ percent: 100, message: "Complete!" });
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSelectDepartment = useCallback((dept) => {
    setSelectedDept(dept);
    setSelectedArticle(null);
    setSearchTerm("");
  }, []);

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
    setSelectedArticle(null);
    setSearchTerm("");
  };

  const currentArticles = selectedDept
    ? allArticles.filter(a => a.parentCollection?.id === selectedDept.id || a.collectionId === selectedDept.id)
    : allArticles;

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", gap: "2rem" }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "var(--primary)", fontWeight: "800", marginBottom: "0.5rem" }}>Synchronizing Research Data</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>{loadingProgress.message}</p>
        </div>
        <div style={{ width: "320px" }}>
          <div style={{
            height: "8px",
            background: "#e5e7eb",
            borderRadius: "4px",
            overflow: "hidden"
          }}>
            <div style={{
              height: "100%",
              width: `${loadingProgress.percent}%`,
              background: "var(--primary)",
              borderRadius: "4px",
              transition: "width 0.4s ease"
            }} />
          </div>
          <p style={{
            textAlign: "center",
            marginTop: "0.5rem",
            fontSize: "0.85rem",
            fontWeight: "700",
            color: "var(--primary)"
          }}>
            {loadingProgress.percent}%
          </p>
        </div>
      </div>
    );
  }

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
              <Home size={18} /> Faculty Overview
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
          articles={currentArticles}
          totalFacultyArticles={allArticles}
        />

        <div className="fade-in" style={{ marginTop: "3rem" }}>
          <div className="section-divider">
            <h2>{selectedDept ? `${selectedDept.name} Publications` : "Faculty-Wide Research Disovery"}</h2>
            <div className="line"></div>
          </div>
          <ArticleList
            articles={allArticles}
            currentDeptId={selectedDept?.id}
            onSelect={handleSelectArticle}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

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