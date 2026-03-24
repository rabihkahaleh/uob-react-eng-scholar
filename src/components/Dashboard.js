import { useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';

export default function Dashboard({ departments, articles, selectedDept }) {
    const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#f43f5e', '#06b6d4'];

    // Annual output — real years
    const annualData = useMemo(() => {
        const counts = {};
        articles.forEach(a => {
            const year = a.lastModified ? new Date(a.lastModified).getFullYear() : null;
            if (year && year >= 2000 && year <= new Date().getFullYear())
                counts[year] = (counts[year] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([year, value]) => ({ name: String(year), value }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [articles]);

    // Document type distribution
    const docTypeData = useMemo(() => {
        if (!articles.length) return [];
        const counts = {};
        articles.forEach(a => {
            const type = a.type || 'Article';
            counts[type] = (counts[type] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [articles]);

    // Authorship distribution
    const authorshipData = useMemo(() => {
        if (!articles.length) return [];
        const distribution = {};
        articles.forEach(a => {
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
    }, [articles]);

    // Top UOB instructors — scoped to currently displayed articles (dept or faculty-wide)
    const instructorStats = useMemo(() => {
        if (!articles.length) return [];
        const counts = {};
        articles.forEach(a => {
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
    }, [articles]);

    // Faculty overview bar chart (only shown when no dept selected)
    const deptData = useMemo(() => {
        return departments.map(d => ({
            name: d.name.replace("Department of ", "").split(' ').map(w => w[0]).join(''),
            fullName: d.name.replace("Department of ", ""),
            value: parseInt(d.numberItems || 0)
        })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
    }, [departments]);

    return (
        <div className="fade-in">
            <div className="page-header">
                <div className="header-title">
                    <h1>{selectedDept ? `${selectedDept.name} Dashboard` : "Faculty of Engineering Overview"}</h1>
                    <p>Research Analytics & Knowledge Discovery Hub</p>
                </div>
            </div>

            {/* Three-column charts row */}
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
                                <BarChart data={deptData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip
                                        formatter={(value, _name, props) => [value, props.payload.fullName]}
                                        contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                                        <LabelList dataKey="value" position="top" style={{ fill: '#b45309', fontWeight: 'bold', fontSize: '10px' }} />
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

            {/* Top instructors — always scoped to current articles (dept or all) */}
            {instructorStats.length > 0 && (
                <div className="chart-container" style={{ width: "100%" }}>
                    <h3 className="chart-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        Top Contributing Instructors
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "500" }}>
                            {selectedDept ? selectedDept.name.replace("Department of ", "") : "Faculty-Wide"} · {articles.length} publications
                        </span>
                    </h3>
                    <div style={{ height: `${Math.max(300, instructorStats.length * 45)}px`, marginTop: "1rem" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={instructorStats}
                                margin={{ top: 5, right: 60, left: 60, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={120}
                                    tick={{ fontSize: 12, fontWeight: 600, fill: '#334155' }}
                                />
                                <Tooltip
                                    contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" fill="var(--primary)" radius={[0, 6, 6, 0]} barSize={25}>
                                    <LabelList dataKey="count" position="right" style={{ fill: 'var(--primary)', fontWeight: '900', fontSize: '14px' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
