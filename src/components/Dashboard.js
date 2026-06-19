import { useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';
import paperThemes from "../data/paperThemes";
import { themeMap, tracks } from "../data/facultyThemes";

export default function Dashboard({ departments, articles, selectedDept, onSelectAuthor, onSelectDept, onSelectTheme }) {
    const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#f43f5e', '#06b6d4'];

    const DEPT_TAGS = {
        CV: { label: "Civil & Environmental Engineering", bg: "#dbeafe", color: "#1d4ed8" },
        EE: { label: "Electrical Engineering",            bg: "#fef3c7", color: "#92400e" },
        ME: { label: "Mechanical Engineering",            bg: "#fee2e2", color: "#991b1b" },
        CH: { label: "Chemical Engineering",              bg: "#d1fae5", color: "#065f46" },
        CP: { label: "Computer Engineering",              bg: "#ede9fe", color: "#5b21b6" },
        ST: { label: "Sustainability for Engineering",    bg: "#ccfbf1", color: "#0f766e" },
    };

    // Deduplicate by EID for all statistical charts (annual, type, authorship, instructors).
    // trackStats intentionally uses all records to match ThemeDashboard per-instructor counts.
    const uniqueArticles = useMemo(() => {
        const seen = new Set();
        return articles.filter(a => {
            if (seen.has(a.id)) return false;
            seen.add(a.id);
            return true;
        });
    }, [articles]);

    // Annual output — real years
    const annualData = useMemo(() => {
        const counts = {};
        uniqueArticles.forEach(a => {
            const year = a.lastModified ? new Date(a.lastModified).getFullYear() : null;
            if (year && year >= 2000 && year <= new Date().getFullYear())
                counts[year] = (counts[year] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([year, value]) => ({ name: String(year), value }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [uniqueArticles]);

    // Document type distribution
    const docTypeData = useMemo(() => {
        if (!uniqueArticles.length) return [];
        const counts = {};
        uniqueArticles.forEach(a => {
            const type = a.type || 'Article';
            counts[type] = (counts[type] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [uniqueArticles]);

    // Authorship distribution
    const authorshipData = useMemo(() => {
        if (!uniqueArticles.length) return [];
        const distribution = {};
        uniqueArticles.forEach(a => {
            const metadataList = Array.isArray(a.metadata) ? a.metadata : (a.metadata ? [a.metadata] : []);
            const authorVal = metadataList.find(m => m.key === "dc.contributor.author")?.value || "";
            const authorCount = authorVal ? authorVal.split(';').filter(s => s.trim()).length : 0;
            const key = authorCount > 5 ? '5+' : authorCount.toString();
            distribution[key] = (distribution[key] || 0) + 1;
        });
        return Object.keys(distribution).sort().map(key => ({
            name: `${key} ${key === '1' ? 'Author' : 'Authors'}`,
            count: distribution[key]
        }));
    }, [uniqueArticles]);

    // Top UOB instructors — unique papers per instructor (deduplicated by EID)
    const instructorStats = useMemo(() => {
        if (!uniqueArticles.length) return [];
        const counts = {};
        uniqueArticles.forEach(a => {
            const metaList = Array.isArray(a.metadata) ? a.metadata : (a.metadata ? [a.metadata] : []);
            const instructorsVal = metaList.find(m => m.key === 'dc.contributor.uobinstructors')?.value;
            if (instructorsVal) {
                instructorsVal.split(';').map(s => s.trim()).filter(Boolean).forEach(name => {
                    counts[name] = (counts[name] || 0) + 1;
                });
            }
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [uniqueArticles]);

    // Faculty overview bar chart (only shown when no dept selected)
    const deptData = useMemo(() => {
        return departments.map(d => ({
            name: d.name.replace("Department of ", "").split(' ').map(w => w[0]).join(''),
            fullName: d.name.replace("Department of ", ""),
            value: parseInt(d.numberItems || 0)
        })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
    }, [departments]);

    // Research Tracks (Macro Level)
    const trackStats = useMemo(() => {
        if (!articles.length) return [];
        const counts = {};
        articles.forEach(a => {
            const themeIds = a.themeId || paperThemes[a.id];
            const themes = Array.isArray(themeIds) ? themeIds : [themeIds];
            themes.forEach(themeId => {
                if (themeId && themeMap[themeId]) {
                    const trackId = themeMap[themeId].trackId;
                    counts[trackId] = (counts[trackId] || 0) + 1;
                }
            });
        });
        return Object.entries(counts)
            .map(([id, count]) => {
                const track = tracks.find(t => t.id === id);
                return { id, name: track?.name || id, count, color: track?.color || "#3b82f6" };
            })
            .sort((a, b) => b.count - a.count);
    }, [articles]);

    return (
        <div className="fade-in">
            <div className="page-header">
                <div className="header-title">
                    <h1>{selectedDept ? `${selectedDept.name} Dashboard` : "Faculty of Engineering Overview"}</h1>
                    <p>Research Analytics & Knowledge Discovery Hub</p>
                </div>
            </div>

            {/* Top charts row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>

                {/* Chart 1: Annual output */}
                <div className="chart-container">
                    <h3 className="chart-title">Annual Research Output</h3>
                    <div style={{ height: "280px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={annualData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="value" position="top" style={{ fill: '#1e3a8a', fontWeight: 'bold', fontSize: '10px' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: dept bar or authorship */}
                {!selectedDept ? (
                    <div className="chart-container">
                        <h3 className="chart-title">Publications by Department</h3>
                        <div style={{ height: "280px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={deptData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }} onClick={(state) => { if (state && state.activePayload && state.activePayload.length) { const fullName = state.activePayload[0].payload.fullName; onSelectDept && onSelectDept(fullName); } }} style={{ cursor: 'pointer' }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip
                                        formatter={(value, _name, props) => [value, props.payload.fullName]}
                                        contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {deptData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                        <LabelList dataKey="value" position="top" style={{ fill: '#475569', fontWeight: 'bold', fontSize: '10px' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="chart-container">
                        <h3 className="chart-title">Authors Per Paper</h3>
                        <div style={{ height: "280px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={authorshipData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]}>
                                        <LabelList dataKey="count" position="top" style={{ fill: '#065f46', fontWeight: 'bold', fontSize: '10px' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Chart 3: type distribution */}
                <div className="chart-container">
                    <h3 className="chart-title">Publication Type Distribution</h3>
                    <div style={{ height: "280px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={docTypeData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {docTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom charts row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                {/* Chart 4: All Research Tracks */}
                {trackStats.length > 0 && (() => {
                    const groups = [];
                    const groupMap = {};
                    trackStats.forEach(t => {
                        const prefix = t.id.match(/^([A-Z]+)/)?.[1] || '';
                        if (!groupMap[prefix]) { groupMap[prefix] = []; groups.push(prefix); }
                        groupMap[prefix].push(t);
                    });
                    return (
                        <div className="chart-container" style={{ gridColumn: "span 1", marginBottom: 0 }}>
                            <h3 className="chart-title">Research Tracks Breakdown</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                                {groups.map(prefix => {
                                    const dept = DEPT_TAGS[prefix];
                                    const deptTracks = groupMap[prefix];
                                    const total = deptTracks.reduce((s, t) => s + t.count, 0);
                                    return (
                                        <div key={prefix}>
                                            {/* Department header */}
                                            <div style={{
                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                borderBottom: "1px solid #e2e8f0", paddingBottom: "0.35rem", marginBottom: "0.4rem"
                                            }}>
                                                <span style={{ fontWeight: "700", color: "#64748b", fontSize: "0.73rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                                    {dept?.label || prefix}
                                                </span>
                                                <span style={{ fontWeight: "700", color: "#94a3b8", fontSize: "0.73rem" }}>
                                                    {total}
                                                </span>
                                            </div>
                                            {/* Tracks */}
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", paddingLeft: "0.5rem" }}>
                                                {deptTracks.map(t => (
                                                    <div key={t.id} onClick={() => onSelectTheme && onSelectTheme(t.id)} style={{
                                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                                        background: `${t.color}10`, borderLeft: `4px solid ${t.color}`,
                                                        padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", gap: "0.75rem"
                                                    }}>
                                                        <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.85rem" }}>
                                                            {t.name}
                                                        </span>
                                                        <span style={{ fontWeight: "900", color: t.color, fontSize: "0.95rem", background: "#fff", padding: "0.15rem 0.5rem", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", flexShrink: 0 }}>
                                                            {t.count}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}

                {/* Top instructors — always scoped to current articles (dept or all) */}
                {instructorStats.length > 0 && (
                    <div className="chart-container" style={{ gridColumn: "span 1", marginBottom: 0 }}>
                        <h3 className="chart-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            Top Contributing Instructors
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "500", textTransform: "none", letterSpacing: "normal" }}>
                                {selectedDept ? selectedDept.name.replace("Department of ", "") : "Faculty-Wide"} · {articles.length} publications
                            </span>
                        </h3>
                        <div style={{ height: "420px", marginTop: "0.5rem" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={instructorStats}
                                    margin={{ top: 5, right: 60, left: 60, bottom: 5 }}
                                    onClick={(state) => { if (state && state.activeLabel) { onSelectAuthor && onSelectAuthor(state.activeLabel); } }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={120}
                                        tick={{ fontSize: 11, fontWeight: 600, fill: '#334155' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                                        {instructorStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                        <LabelList dataKey="count" position="right" style={{ fill: '#475569', fontWeight: '900', fontSize: '13px' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
