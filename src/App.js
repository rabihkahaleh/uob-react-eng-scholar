import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getDepartments, getArticles, getArticleMetadata } from "./api";
import Dashboard from "./components/Dashboard";
import AuthorDashboard from "./components/AuthorDashboard";
import ThemeDashboard from "./components/ThemeDashboard";
import ArticleList from "./components/ArticleList";
import ArticleDetails from "./components/ArticleDetails";
import { GraduationCap, Home, Loader2, User, Search, PanelLeftClose, PanelLeftOpen, ArrowUp, ArrowDown, BookMarked } from "lucide-react";

function App() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState({ percent: 0, message: "Connecting to ScholarHub..." });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [instructorSearch, setInstructorSearch] = useState("");
  const [instructorSort, setInstructorSort] = useState("publications");
  const [instructorSortDir, setInstructorSortDir] = useState("desc");
  const [showThemes, setShowThemes] = useState(false);
  const [initialThemeId, setInitialThemeId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      setLoadingProgress({ percent: 5, message: "Connecting to ScholarHub..." });
      try {
        const deps = await getDepartments();
        const depArray = Array.isArray(deps) ? deps : [deps];
        setDepartments(depArray);
        setLoadingProgress({ percent: 10, message: `Found ${depArray.length} departments. Loading publications...` });

        setLoadingProgress({ percent: 50, message: "Loading all publications..." });
        const items = await getArticles();
        const itemsArray = Array.isArray(items) ? items : [items];

        setLoadingProgress({ percent: 98, message: "Finalizing data..." });
        setAllArticles(itemsArray.filter(Boolean));
        setLoadingProgress({ percent: 100, message: "Complete!" });
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Build sorted authors list from all articles
  const authorsList = useMemo(() => {
    const map = {};
    allArticles.forEach(a => {
      const metaList = Array.isArray(a.metadata) ? a.metadata : [];
      const val = metaList.find(m => m.key === "dc.contributor.uobinstructors")?.value || "";
      const citations = parseInt(metaList.find(m => m.key === "dc.relation.citedby")?.value || "0", 10);
      val.split(";").map(s => s.trim()).filter(Boolean).forEach(name => {
        if (!map[name]) map[name] = { name, count: 0, citations: 0, deptId: a.deptId, deptName: a.deptName };
        map[name].count++;
        map[name].citations += citations;
      });
    });
    const list = Object.values(map);
    const dir = instructorSortDir === "asc" ? 1 : -1;
    if (instructorSort === "citations") return list.sort((a, b) => dir * (a.citations - b.citations));
    return list.sort((a, b) => dir * (a.count - b.count));
  }, [allArticles, instructorSort, instructorSortDir]);

  const handleSelectDepartment = useCallback((dept) => {
    setSelectedDept(dept);
    setSelectedAuthor(null);
    setSelectedArticle(null);
    setSearchTerm("");
    setShowThemes(false);
  }, []);

  const handleSelectAuthor = useCallback((author) => {
    setSelectedAuthor(author);
    setSelectedDept(null);
    setSelectedArticle(null);
    setSearchTerm("");
    setShowThemes(false);
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
    setSelectedAuthor(null);
    setSelectedArticle(null);
    setSearchTerm("");
    setShowThemes(false);
  };

  const handleShowThemes = (themeId = null) => {
    setShowThemes(true);
    setInitialThemeId(themeId && typeof themeId === 'string' ? themeId : null);
    setSelectedDept(null);
    setSelectedAuthor(null);
    setSelectedArticle(null);
    setSearchTerm("");
  };

  const currentArticles = selectedDept
    ? allArticles.filter(a => a.deptId === selectedDept.id)
    : allArticles;

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f1f5f9", gap: "2rem" }}>
        <Loader2 className="animate-spin" size={48} color="#1e3a8a" />
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#1e3a8a", fontWeight: "800", marginBottom: "0.5rem" }}>Synchronizing Research Data</h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>{loadingProgress.message}</p>
        </div>
        <div style={{ width: "320px" }}>
          <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${loadingProgress.percent}%`,
              background: "#1e3a8a",
              borderRadius: "4px",
              transition: "width 0.4s ease"
            }} />
          </div>
          <p style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#1e3a8a" }}>
            {loadingProgress.percent}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ gridTemplateColumns: sidebarOpen ? "280px 1fr" : "60px 1fr" }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ padding: sidebarOpen ? "2rem 1.5rem" : "1.25rem 0.5rem", overflow: "hidden", position: "relative" }}>
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(v => !v)}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          style={{
            position: "absolute", top: "1rem", right: "-14px",
            background: "#1e3a8a", border: "1px solid rgba(59,130,246,0.4)",
            borderRadius: "50%", width: "28px", height: "28px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#93c5fd", zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)"
          }}
        >
          {sidebarOpen ? <PanelLeftClose size={13} /> : <PanelLeftOpen size={13} />}
        </button>

        <div className="sidebar-logo" style={{ textAlign: "center", borderBottom: "none" }}>
          <div style={{
            background: "white", width: "40px", height: "40px", borderRadius: "50%",
            margin: sidebarOpen ? "0 auto 1rem" : "0 auto 0.5rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--primary)", fontSize: sidebarOpen ? "1rem" : "0.7rem", fontWeight: "900",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)", flexShrink: 0
          }}>
            UOB
          </div>
          {sidebarOpen && (
            <>
              <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>RESEARCH PORTAL</div>
              <div style={{ fontSize: "0.6rem", color: "var(--secondary)", marginTop: "0.2rem", letterSpacing: "1px", fontWeight: "700" }}>
                FACULTY OF ENGINEERING
              </div>
            </>
          )}
        </div>

        <nav style={{ overflowY: "auto", flex: 1, marginRight: sidebarOpen ? "-1rem" : "0", paddingRight: sidebarOpen ? "1rem" : "0" }}>
          <ul className="nav-list">
            <li
              className={`nav-item ${!selectedDept && !selectedAuthor && !showThemes ? "active" : ""}`}
              onClick={goHome}
              title={!sidebarOpen ? "Faculty Overview" : undefined}
              style={{ justifyContent: sidebarOpen ? undefined : "center", padding: sidebarOpen ? undefined : "0.65rem" }}
            >
              <Home size={18} />
              {sidebarOpen && " Faculty Overview"}
            </li>

            <li
              className={`nav-item ${showThemes ? "active" : ""}`}
              onClick={handleShowThemes}
              title={!sidebarOpen ? "Research Themes" : undefined}
              style={{ justifyContent: sidebarOpen ? undefined : "center", padding: sidebarOpen ? undefined : "0.65rem" }}
            >
              <BookMarked size={18} />
              {sidebarOpen && " Research Themes"}
            </li>

            {sidebarOpen && (
              <>
                {/* Instructors — now first */}
                <div style={{ margin: "1.25rem 0 0.5rem 0", color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontWeight: "800", textTransform: "uppercase" }}>
                  Instructors
                </div>

                {/* Sort controls */}
                <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.5rem" }}>
                  {[{ key: "publications", label: "Pubs" }, { key: "citations", label: "Cites" }].map(({ key, label }) => {
                    const isActive = instructorSort === key;
                    return (
                      <div key={key} style={{ flex: 1, display: "flex", borderRadius: "6px", overflow: "hidden", border: isActive ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.1)" }}>
                        <button
                          onClick={() => { setInstructorSort(key); setInstructorSortDir("desc"); }}
                          style={{
                            flex: 1, padding: "0.3rem 0.3rem",
                            fontSize: "0.68rem", fontWeight: "700",
                            cursor: "pointer", border: "none",
                            background: isActive ? "rgba(59,130,246,0.2)" : "transparent",
                            color: isActive ? "#93c5fd" : "#64748b",
                          }}
                        >
                          {label}
                        </button>
                        <button
                          onClick={() => { setInstructorSort(key); setInstructorSortDir(d => isActive ? (d === "desc" ? "asc" : "desc") : "desc"); }}
                          style={{
                            padding: "0.3rem 0.4rem", border: "none",
                            borderLeft: "1px solid rgba(255,255,255,0.08)",
                            background: isActive ? "rgba(59,130,246,0.2)" : "transparent",
                            color: isActive ? "#93c5fd" : "#475569",
                            cursor: "pointer", display: "flex", alignItems: "center"
                          }}
                        >
                          {isActive && instructorSortDir === "asc"
                            ? <ArrowUp size={11} />
                            : <ArrowDown size={11} />}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Instructor search */}
                <div style={{ position: "relative", marginBottom: "0.5rem" }}>
                  <Search size={13} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
                  <input
                    type="text"
                    placeholder="Search instructors..."
                    value={instructorSearch}
                    onChange={e => setInstructorSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.45rem 0.75rem 0.45rem 2rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#e2e8f0",
                      fontSize: "0.78rem",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {authorsList
                  .filter(a => !instructorSearch || a.name.toLowerCase().includes(instructorSearch.toLowerCase()))
                  .map((author) => (
                    <li
                      key={author.name}
                      className={`nav-item ${selectedAuthor?.name === author.name ? "active" : ""}`}
                      onClick={() => handleSelectAuthor(author)}
                      style={{ justifyContent: "space-between" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <User size={16} /> {author.name}
                      </div>
                      <span style={{
                        fontSize: "0.7rem",
                        background: selectedAuthor?.name === author.name ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                        padding: "0.1rem 0.4rem", borderRadius: "10px", fontWeight: "700"
                      }}>
                        {instructorSort === "citations" ? author.citations : author.count}
                      </span>
                    </li>
                  ))}

                {/* Departments — now below */}
                <div style={{ margin: "1.25rem 0 0.5rem 0", color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontWeight: "800", textTransform: "uppercase" }}>
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
                      padding: "0.1rem 0.4rem", borderRadius: "10px", fontWeight: "700"
                    }}>
                      {dept.numberItems}
                    </span>
                  </li>
                ))}
              </>
            )}

            {/* Collapsed state: icon-only nav items */}
            {!sidebarOpen && (
              <>
                {authorsList.map((author) => (
                  <li
                    key={author.name}
                    className={`nav-item ${selectedAuthor?.name === author.name && !showThemes ? "active" : ""}`}
                    onClick={() => handleSelectAuthor(author)}
                    title={author.name}
                    style={{ justifyContent: "center", padding: "0.65rem" }}
                  >
                    <User size={16} />
                  </li>
                ))}
                {departments.map((dept) => (
                  <li
                    key={dept.id}
                    className={`nav-item ${selectedDept?.id === dept.id ? "active" : ""}`}
                    onClick={() => handleSelectDepartment(dept)}
                    title={dept.name.replace("Department of ", "")}
                    style={{ justifyContent: "center", padding: "0.65rem" }}
                  >
                    <GraduationCap size={18} />
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {showThemes ? (
          <ThemeDashboard
            articles={allArticles}
            onSelectArticle={handleSelectArticle}
            initialThemeId={initialThemeId}
          />
        ) : selectedAuthor ? (
          <AuthorDashboard
            authorName={selectedAuthor.name}
            articles={allArticles}
            onSelectArticle={handleSelectArticle}
          />
        ) : (
          <>
            <Dashboard
              departments={departments}
              selectedDept={selectedDept}
              articles={currentArticles}
              onSelectAuthor={(name) => {
                const a = authorsList.find(x => x.name === name);
                if (a) handleSelectAuthor(a);
              }}
              onSelectDept={(fullName) => {
                const d = departments.find(x => x.fullName === fullName || x.name === fullName);
                if (d) handleSelectDepartment(d);
              }}
              onSelectTheme={handleShowThemes}
            />
          </>
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
