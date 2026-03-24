export const tracks = [
  {
    id: "CV1",
    name: "Materials Track",
    color: "#3b82f6",
    themes: [
      { id: "CV1.1",  name: "Geopolymers: Sustainable Materials for Enhanced Strength" },
      { id: "CV1.2",  name: "Recycling Waste Materials for Enhanced Concrete Properties" },
      { id: "CV1.3",  name: "3D Printing for Concrete Construction" },
      { id: "CV1.4",  name: "Enhancing Concrete Properties with Polymer Modifications" },
      { id: "CV1.5",  name: "Ultra High-Performance Concrete Innovations and Applications" },
      { id: "CV1.6",  name: "Pervious Concrete for Sustainable Urban Drainage" },
      { id: "CV1.7",  name: "Lightweight Concrete Properties and Applications" },
      { id: "CV1.8",  name: "Enhancing Cementitious Materials with Nanomaterials" },
      { id: "CV1.9",  name: "Underwater Concrete Performance and Applications" },
      { id: "CV1.10", name: "Reclaimed Asphalt Pavement Innovations in Binder Performance" },
      { id: "CV1.11", name: "Artificial Intelligence Models for Concrete Strength Prediction" },
    ],
  },
  {
    id: "CV2",
    name: "Structural Track",
    color: "#8b5cf6",
    themes: [
      { id: "CV2.1", name: "Smart Concrete Innovations for Structural Resilience" },
      { id: "CV2.2", name: "Lateral Pressure Dynamics in Self-Consolidating Concrete" },
      { id: "CV2.3", name: "Mechanical Behavior of Composite Beams and Slabs" },
      { id: "CV2.4", name: "Prestressing Innovations in Concrete Structures" },
      { id: "CV2.5", name: "Fiber Reinforced Concrete for Structural Applications" },
      { id: "CV2.6", name: "Optimal Sensor Placement for Structural Health Monitoring" },
      { id: "CV2.7", name: "Fracture Mechanics and Size Effect in Concrete" },
    ],
  },
  {
    id: "CV3",
    name: "Transportation Track",
    color: "#f59e0b",
    themes: [
      { id: "CV3.1", name: "Warm Mix Asphalt Innovations for Sustainable Paving" },
      { id: "CV3.2", name: "Urban Transportation and Land Use Dynamics" },
      { id: "CV3.3", name: "Traffic Network Optimization and Capacity Modeling" },
      { id: "CV3.4", name: "Integrated Strategies for Sustainable Urban Transport" },
      { id: "CV3.5", name: "LiDAR and GIS Applications in Urban Modeling and Classification" },
      { id: "CV3.6", name: "Geospatial Strategies for Renewable Energy Site Selection" },
    ],
  },
  {
    id: "CV4",
    name: "Geotechnical Track",
    color: "#10b981",
    themes: [
      { id: "CV4.1", name: "Fiber Reinforcement Techniques for Soil Strength Enhancement" },
      { id: "CV4.2", name: "Strength and Sustainability of Earth Materials" },
      { id: "CV4.3", name: "Use of Soil Mechanic Principles to Cementitious Applications" },
    ],
  },
  {
    id: "CV5",
    name: "Construction Management Track",
    color: "#f43f5e",
    themes: [
      { id: "CV5.1", name: "Predictive Models for Bridge Condition Management" },
      { id: "CV5.2", name: "Fuzzy Multi-Criteria Decision-Making Framework" },
      { id: "CV5.3", name: "Integrated Strategies for Sustainable Urban Transport" },
      { id: "CV5.4", name: "Traffic Network Optimization and Capacity Modeling" },
      { id: "CV5.5", name: "Framework for Urban Social Sustainability Development" },
    ],
  },
  {
    id: "CV6",
    name: "Water Resources Track",
    color: "#06b6d4",
    themes: [
      { id: "CV6.1", name: "Salinization Dynamics in Coastal Aquifers" },
      { id: "CV6.2", name: "Pesticide Residues and Water Quality Management" },
      { id: "CV6.3", name: "Chemical Dynamics of Cloud Water and Fog Deposition" },
      { id: "CV6.4", name: "Climate Change Effects on Groundwater Resources" },
      { id: "CV6.5", name: "Wastewater Surveillance for SARS-CoV-2 Detection" },
    ],
  },
  {
    id: "CV7",
    name: "Environmental Track",
    color: "#84cc16",
    themes: [
      { id: "CV7.1", name: "Chemical Waste Management and Heavy Metal Recovery" },
      { id: "CV7.2", name: "Health Risks and Environmental Impact of Polycyclic Aromatic Hydrocarbons" },
      { id: "CV7.3", name: "Environmental Risks of Organochlorine Pesticides and PCBs" },
      { id: "CV7.4", name: "Organic Carbon Emissions from Biomass Burning Aerosols" },
      { id: "CV7.5", name: "Fog Formation and Prediction in Atmospheric Studies" },
    ],
  },
];

// Flat lookup: themeId → { id, name, trackId, trackName, color }
export const themeMap = Object.fromEntries(
  tracks.flatMap(t =>
    t.themes.map(th => [th.id, { ...th, trackId: t.id, trackName: t.name, color: t.color }])
  )
);
