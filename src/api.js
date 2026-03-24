import { papers as civilPapers }          from './data/civilData';
import { papers as electricalPapers }     from './data/electricalData';
import { papers as mechanicalPapers }     from './data/mechanicalData';
import { papers as chemicalPapers }       from './data/chemicalData';
import { papers as computerPapers }       from './data/computerData';
import { papers as sustainabilityPapers } from './data/sustainabilityData';

const DEPARTMENTS = [
  { id: 'civil',          name: 'Department of Civil & Environmental Engineering' },
  { id: 'electrical',     name: 'Department of Electrical Engineering' },
  { id: 'mechanical',     name: 'Department of Mechanical Engineering' },
  { id: 'chemical',       name: 'Department of Chemical Engineering' },
  { id: 'computer',       name: 'Department of Computer Engineering' },
  { id: 'sustainability', name: 'Department of Sustainability for Engineering' },
];

const allPapers = [
  ...civilPapers,
  ...electricalPapers,
  ...mechanicalPapers,
  ...chemicalPapers,
  ...computerPapers,
  ...sustainabilityPapers,
];

function paperToArticle(p) {
  return {
    id: p.eid,
    name: p.title,
    type: p.docType,
    lastModified: p.year ? `${p.year}-01-01` : null,
    deptId: p.deptId,
    deptName: p.deptName,
    metadata: [
      { key: 'dc.contributor.author',         value: p.authors || '' },
      { key: 'dc.contributor.authorfull',     value: p.authorFull || '' },
      { key: 'dc.source',                     value: p.sourceTitle || '' },
      { key: 'dc.relation.volume',            value: p.volume || '' },
      { key: 'dc.relation.issue',             value: p.issue || '' },
      { key: 'dc.relation.artno',             value: p.artNo || '' },
      { key: 'dc.relation.pagestart',         value: p.pageStart || '' },
      { key: 'dc.relation.pageend',           value: p.pageEnd || '' },
      { key: 'dc.relation.citedby',           value: p.citedBy != null ? String(p.citedBy) : '0' },
      { key: 'dc.identifier.doi',             value: p.doi || '' },
      { key: 'dc.identifier.scopus',          value: p.link || '' },
      { key: 'dc.rights.openaccess',          value: p.openAccess || '' },
      { key: 'dc.contributor.uobinstructors', value: p.uobInstructors.join('; ') },
    ],
  };
}

export async function getDepartments() {
  return DEPARTMENTS.map(d => ({
    ...d,
    numberItems: allPapers.filter(p => p.deptId === d.id).length,
  }));
}

export async function getArticles(_departmentId) {
  return allPapers.map(paperToArticle);
}

export async function getArticleMetadata(eid) {
  const paper = allPapers.find(p => p.eid === eid);
  if (!paper) return [];

  return [
    { key: 'dc.title',                      value: paper.title || '' },
    { key: 'dc.contributor.author',         value: paper.authors || '' },
    { key: 'dc.contributor.authorfull',     value: paper.authorFull || '' },
    { key: 'dc.date.issued',                value: paper.year ? String(paper.year) : '' },
    { key: 'dc.source',                     value: paper.sourceTitle || '' },
    { key: 'dc.relation.volume',            value: paper.volume || '' },
    { key: 'dc.relation.issue',             value: paper.issue || '' },
    { key: 'dc.relation.artno',             value: paper.artNo || '' },
    { key: 'dc.relation.pagestart',         value: paper.pageStart || '' },
    { key: 'dc.relation.pageend',           value: paper.pageEnd || '' },
    { key: 'dc.relation.citedby',           value: paper.citedBy != null ? String(paper.citedBy) : '0' },
    { key: 'dc.identifier.doi',             value: paper.doi || '' },
    { key: 'dc.identifier.scopus',          value: paper.link || '' },
    { key: 'dc.rights.openaccess',          value: paper.openAccess || '' },
    { key: 'dc.contributor.uobinstructors', value: paper.uobInstructors.join('; ') },
  ];
}
