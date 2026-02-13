import React from "react";

export default function DepartmentList({ departments, onSelect }) {
  return (
    <div>
      <h2>Departments</h2>
      <ul>
        {departments.map((d) => (
          <li key={d.id} style={{ cursor: "pointer" }} onClick={() => onSelect(d)}>
            {d.name}
          </li>
        ))}
      </ul>
    </div>
  );
}