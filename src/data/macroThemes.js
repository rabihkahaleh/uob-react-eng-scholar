import { tracks as civilTracks } from "./facultyThemes";

// We define overarching Faculty Themes here.
// These span across all departments.
export const facultyMacroThemes = [
  {
    id: "FT-MAT",
    name: "Advanced Materials & Manufacturing",
    description: "Innovations in concrete, nanomaterials, 3D printing, and chemical processing.",
    color: "#f59e0b", // Amber
    icon: "Layers",
    departmentTracks: ["CV1", "ME2", "CHE2"]
  },
  {
    id: "FT-STRUCT",
    name: "Structural & Geotechnical Engineering",
    description: "Structural resilience, soil mechanics, and advanced foundation systems.",
    color: "#8b5cf6", // Purple
    icon: "Building",
    departmentTracks: ["CV2", "CV4"]
  },
  {
    id: "FT-SMART",
    name: "Smart Mobility & Digital Systems",
    description: "Intelligent transportation networks, artificial intelligence, and IoT.",
    color: "#3b82f6", // Blue
    icon: "Cpu",
    departmentTracks: ["CV3", "CE1", "EE1", "EE2"]
  },
  {
    id: "FT-CONST",
    name: "Construction & Systems Management",
    description: "Project management, predictive modeling, and multi-criteria decision making.",
    color: "#f43f5e", // Rose
    icon: "Activity",
    departmentTracks: ["CV5", "CE2"]
  },
  {
    id: "FT-WATER",
    name: "Water Resources & Fluid Dynamics",
    description: "Hydrology, groundwater management, and fluid transport systems.",
    color: "#06b6d4", // Cyan
    icon: "Leaf",
    departmentTracks: ["CV6"]
  },
  {
    id: "FT-ENV",
    name: "Environment, Energy & Sustainability",
    description: "Renewable energy, waste recovery, and sustainable urban development.",
    color: "#10b981", // Emerald
    icon: "Leaf",
    departmentTracks: ["CV7", "ST1", "ME1", "CHE1"]
  }
];

// Combine existing civil tracks with placeholder tracks for other departments
// so the user can see the full cross-department analysis.
export const allDepartmentTracks = [
  ...civilTracks,
  // Placeholders for Computer Engineering
  { 
    id: "CE1", 
    name: "Machine Learning & Algorithms", 
    color: "#3b82f6", 
    dept: "Computer", 
    themes: [
      { id: "CE1.1", name: "Neural Networks & Deep Learning" },
      { id: "CE1.2", name: "Support Vector Machines (SVM)" },
      { id: "CE1.3", name: "Fuzzy Logic & Clustering" },
      { id: "CE1.4", name: "Computer Vision & Pattern Recognition" }
    ] 
  },
  { id: "CE2", name: "Biomedical Signal Processing", color: "#f43f5e", dept: "Computer", themes: [] },
  
  // Placeholders for Electrical Engineering
  { id: "EE1", name: "Telecommunications & IoT", color: "#3b82f6", dept: "Electrical", themes: [] },
  { id: "EE2", name: "Bio-Sensors & Electronics", color: "#f43f5e", dept: "Electrical", themes: [] },

  // Placeholders for Mechanical Engineering
  { id: "ME1", name: "Renewable Energy Systems", color: "#10b981", dept: "Mechanical", themes: [] },
  { id: "ME2", name: "Advanced Manufacturing & Robotics", color: "#f59e0b", dept: "Mechanical", themes: [] },

  // Placeholders for Chemical Engineering
  { id: "CHE1", name: "Waste Management & Recovery", color: "#10b981", dept: "Chemical", themes: [] },
  { id: "CHE2", name: "Polymer & Nanomaterial Synthesis", color: "#f59e0b", dept: "Chemical", themes: [] },

  // Placeholders for Sustainability
  { id: "ST1", name: "Sustainability Track", color: "#10b981", dept: "Sustainability", themes: [
    { id: "ST1.1", name: "Miscellaneous" },
    { id: "ST1.2", name: "Engineering Education for Sustainable Development" },
  ] },
];
