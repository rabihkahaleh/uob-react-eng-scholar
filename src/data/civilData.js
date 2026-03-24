import civilEnvScopusCSV from './civilEnvScopusData';
import { processScopusCSV } from './parseScopusCSV';

export const { papers, instructors } = processScopusCSV(
  civilEnvScopusCSV,
  'civil',
  'Civil & Environmental Engineering'
);
