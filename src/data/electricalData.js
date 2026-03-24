import electricalScopusCSV from './electricalScopusData';
import { processScopusCSV } from './parseScopusCSV';

export const { papers, instructors } = processScopusCSV(
  electricalScopusCSV,
  'electrical',
  'Electrical Engineering'
);
