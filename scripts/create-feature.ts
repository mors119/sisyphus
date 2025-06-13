// 프론트엔드용 기본 템플릿 생성
// bun run scripts/create-feature.ts testScript
import { mkdir, writeFile, readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const name = Bun.argv[2];
if (!name) {
  console.error('❌ Please provide a feature name.');
  process.exit(1);
}

const PascalCase = name[0].toUpperCase() + name.slice(1);
const templateDir = path.resolve('scripts/templates/feature/__name__');
const targetDir = path.resolve(`sisyphus-web/src/features/${name}`);

if (existsSync(targetDir)) {
  console.error('❌ Feature already exists.');
  process.exit(1);
}

await mkdir(targetDir, { recursive: true });

const templateFiles = await readdir(templateDir, { withFileTypes: true });

for (const file of templateFiles) {
  if (!file.isFile()) continue;
  const content = await readFile(path.join(templateDir, file.name), 'utf8');
  const replaced = content
    .replace(/__name__/g, name)
    .replace(/__Name__/g, PascalCase);

  const newFileName = file.name.replace(/__name__/g, name);
  await writeFile(path.join(targetDir, newFileName), replaced);
}

console.log(`✅ Feature '${name}' created in src/features/${name}`);
