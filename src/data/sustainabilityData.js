import sustainabilityScopusCSV from './sustainabilityScopusData';
import { processScopusCSV } from './parseScopusCSV';

export const { papers, instructors } = processScopusCSV(
  sustainabilityScopusCSV,
  'sustainability',
  'Sustainability for Engineering'
);
