import mechanicalScopusCSV from './mechanicalScopusData';
import { processScopusCSV } from './parseScopusCSV';

export const { papers, instructors } = processScopusCSV(
  mechanicalScopusCSV,
  'mechanical',
  'Mechanical Engineering'
);
