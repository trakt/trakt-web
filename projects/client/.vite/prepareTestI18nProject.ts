import fs from 'node:fs';
import path from 'node:path';

type PrepareTestI18nProjectParams = {
  i18nDir: string;
  testDir: string;
};

function writeIfChanged(file: string, content: string) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) {
    return;
  }

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

export function prepareTestI18nProject({
  i18nDir,
  testDir,
}: PrepareTestI18nProjectParams): string {
  const settingsFile = path.join(i18nDir, 'project.inlang', 'settings.json');
  const settings = fs.readFileSync(settingsFile, 'utf8');
  const { baseLocale } = JSON.parse(settings);
  const baseMessages = path.join(i18nDir, 'messages', `${baseLocale}.json`);
  const projectDir = path.join(testDir, 'project.inlang');

  writeIfChanged(path.join(projectDir, 'settings.json'), settings);

  if (fs.existsSync(baseMessages)) {
    writeIfChanged(
      path.join(testDir, 'messages', `${baseLocale}.json`),
      fs.readFileSync(baseMessages, 'utf8'),
    );
  }

  return projectDir;
}
