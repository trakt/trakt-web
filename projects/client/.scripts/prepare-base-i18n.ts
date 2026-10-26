import path from 'node:path';
import { prepareTestI18nProject } from '../.vite/prepareTestI18nProject.ts';

const clientDir = path.join(import.meta.dirname, '..');

prepareTestI18nProject({
  i18nDir: path.join(clientDir, 'i18n'),
  testDir: path.join(clientDir, 'node_modules/base-i18n'),
});
