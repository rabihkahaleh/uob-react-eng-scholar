import chemicalScopusCSV from './chemicalScopusData';
import { processScopusCSV } from './parseScopusCSV';

export const { papers, instructors } = processScopusCSV(
  chemicalScopusCSV,
  'chemical',
  'Chemical Engineering'
);
