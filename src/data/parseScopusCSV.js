// Shared Scopus CSV parser for all departments
// Column indices
const COL = {
  INSTRUCTOR: 0,
  AUTHORS: 4,
  AUTHOR_FULL: 5,
  TITLE: 7,
  YEAR: 8,
  SOURCE: 9,
  VOLUME: 10,
  ISSUE: 11,
  ART_NO: 12,
  PAGE_START: 13,
  PAGE_END: 14,
  CITED_BY: 16,
  DOI: 17,
  LINK: 18,
  DOC_TYPE: 19,
  OPEN_ACCESS: 21,
  EID: 23,
};

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}

export function processScopusCSV(csvString, deptId, deptName) {
  const lines = csvString.split(/\r?\n/);
  const dataLines = lines.slice(1).filter(l => l.trim().length > 0);

  const papersMap = new Map();
  const instructorsMap = new Map();
  let currentInstructor = '';

  for (const line of dataLines) {
    const cols = parseCSVLine(line);
    if (cols.length < 20) continue;

    if (cols[COL.INSTRUCTOR].trim()) {
      currentInstructor = cols[COL.INSTRUCTOR].trim();
    }

    const eid = cols[COL.EID];
    if (!eid) continue;

    if (currentInstructor) {
      if (!instructorsMap.has(currentInstructor)) {
        instructorsMap.set(currentInstructor, { name: currentInstructor, count: 0, deptId });
      }
      instructorsMap.get(currentInstructor).count++;
    }

    if (papersMap.has(eid)) {
      const existing = papersMap.get(eid);
      if (currentInstructor && !existing.uobInstructors.includes(currentInstructor)) {
        existing.uobInstructors.push(currentInstructor);
      }
    } else {
      papersMap.set(eid, {
        eid,
        title: cols[COL.TITLE],
        year: parseInt(cols[COL.YEAR], 10) || null,
        authors: cols[COL.AUTHORS],
        authorFull: cols[COL.AUTHOR_FULL],
        sourceTitle: cols[COL.SOURCE],
        volume: cols[COL.VOLUME],
        issue: cols[COL.ISSUE],
        artNo: cols[COL.ART_NO],
        pageStart: cols[COL.PAGE_START],
        pageEnd: cols[COL.PAGE_END],
        citedBy: parseInt(cols[COL.CITED_BY], 10) || 0,
        doi: cols[COL.DOI],
        link: cols[COL.LINK],
        docType: cols[COL.DOC_TYPE] || 'Article',
        openAccess: cols[COL.OPEN_ACCESS],
        deptId,
        deptName,
        uobInstructors: currentInstructor ? [currentInstructor] : [],
      });
    }
  }

  return {
    papers: Array.from(papersMap.values()),
    instructors: Array.from(instructorsMap.values()).sort((a, b) => b.count - a.count),
  };
}
