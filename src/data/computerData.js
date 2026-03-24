import computerScopusCSV from './computerScopusData';
import { processScopusCSV } from './parseScopusCSV';

export const { papers, instructors } = processScopusCSV(
  computerScopusCSV,
  'computer',
  'Computer Engineering'
);
