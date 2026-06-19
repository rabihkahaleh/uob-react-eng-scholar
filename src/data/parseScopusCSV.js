// Shared Scopus CSV parser for all departments
//
// Detects one of three CSV header formats:
//
//   Format A — no themes, no SDG:
//     ,Total no.,Doc no.,Dept.,Authors,Author full names,Author(s) ID,Title,Year,Source title,...,EID
//
//   Format B — themes present, no SDG:
//     ,Total no.,Doc no.,Dept.,Theme No.,Theme title,Authors,...,Year,Source title,...,EID
//
//   Format C — themes present + SDG column:
//     ,Total no.,Doc no.,Dept.,Theme No.,Theme title,Authors,...,Year,SDG,Source title,...,EID

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

function buildCOL(headerCols) {
  const col4 = headerCols[4] ? headerCols[4].trim().toLowerCase() : '';
  const hasThemes = col4 === 'theme no.';

  if (!hasThemes) {
    // Format A
    return {
      INSTRUCTOR:  0,
      THEME_NO:    null,
      THEME_TITLE: null,
      AUTHORS:     4,
      AUTHOR_FULL: 5,
      TITLE:       7,
      YEAR:        8,
      SOURCE:      9,
      VOLUME:      10,
      ISSUE:       11,
      ART_NO:      12,
      PAGE_START:  13,
      PAGE_END:    14,
      CITED_BY:    16,
      DOI:         17,
      LINK:        18,
      DOC_TYPE:    19,
      OPEN_ACCESS: 21,
      EID:         23,
    };
  }

  // Formats B and C both have Theme No./Theme title at cols 4–5.
  // Distinguish by whether col 11 is "SDG" (Format C) or "Source title" (Format B).
  const col11 = headerCols[11] ? headerCols[11].trim().toLowerCase() : '';
  const hasSdg = col11 === 'sdg';

  if (hasSdg) {
    // Format C — themes + SDG
    return {
      INSTRUCTOR:  0,
      THEME_NO:    4,
      THEME_TITLE: 5,
      AUTHORS:     6,
      AUTHOR_FULL: 7,
      TITLE:       9,
      YEAR:        10,
      SOURCE:      12,
      VOLUME:      13,
      ISSUE:       14,
      ART_NO:      15,
      PAGE_START:  16,
      PAGE_END:    17,
      CITED_BY:    19,
      DOI:         20,
      LINK:        21,
      DOC_TYPE:    22,
      OPEN_ACCESS: 24,
      EID:         26,
    };
  }

  // Format B — themes, no SDG
  return {
    INSTRUCTOR:  0,
    THEME_NO:    4,
    THEME_TITLE: 5,
    AUTHORS:     6,
    AUTHOR_FULL: 7,
    TITLE:       9,
    YEAR:        10,
    SOURCE:      11,
    VOLUME:      12,
    ISSUE:       13,
    ART_NO:      14,
    PAGE_START:  15,
    PAGE_END:    16,
    CITED_BY:    18,
    DOI:         19,
    LINK:        20,
    DOC_TYPE:    21,
    OPEN_ACCESS: 23,
    EID:         25,
  };
}

// Handles "ME3.2 and ME4.2" style cells — returns array when multiple themes are present
function parseThemeId(raw) {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.toLowerCase().includes(' and ')) {
    const parts = trimmed.split(/\s+and\s+/i).map(s => s.trim()).filter(Boolean);
    return parts.length > 1 ? parts : parts[0];
  }
  return trimmed;
}

export function processScopusCSV(csvString, deptId, deptName) {
  const lines = csvString.replace(/^﻿/, '').split(/\r?\n/);
  const headerCols = parseCSVLine(lines[0]);
  const COL = buildCOL(headerCols);

  const dataLines = lines.slice(1).filter(l => l.trim().length > 0);

  const papers = [];
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

    // Each CSV row is its own record — same paper under different instructors
    // gets separate entries so per-instructor theme counts are preserved.
    papers.push({
      id:  eid,
      eid,
      title:       cols[COL.TITLE],
      year:        parseInt(cols[COL.YEAR], 10) || null,
      authors:     cols[COL.AUTHORS],
      authorFull:  cols[COL.AUTHOR_FULL],
      sourceTitle: cols[COL.SOURCE],
      volume:      cols[COL.VOLUME],
      issue:       cols[COL.ISSUE],
      artNo:       cols[COL.ART_NO],
      pageStart:   cols[COL.PAGE_START],
      pageEnd:     cols[COL.PAGE_END],
      citedBy:     parseInt(cols[COL.CITED_BY], 10) || 0,
      doi:         cols[COL.DOI],
      link:        cols[COL.LINK],
      docType:     cols[COL.DOC_TYPE] || 'Article',
      openAccess:  cols[COL.OPEN_ACCESS],
      themeId:     COL.THEME_NO    != null ? parseThemeId(cols[COL.THEME_NO])    : null,
      themeName:   COL.THEME_TITLE != null ? (cols[COL.THEME_TITLE] || null) : null,
      deptId,
      deptName,
      uobInstructors: currentInstructor ? [currentInstructor] : [],
    });
  }

  return {
    papers,
    instructors: Array.from(instructorsMap.values()).sort((a, b) => b.count - a.count),
  };
}
