// Spring용 기본 템플릿 생성
// bun run scripts/create-spring.ts testScript
import { mkdir, writeFile, readdir, stat, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const name = Bun.argv[2];
if (!name) {
  console.error('❌ Please provide a feature name.');
  process.exit(1);
}

const PascalCase = name[0].toUpperCase() + name.slice(1);

// 🔧 템플릿 루트
const templateRoot = path.resolve('scripts/templates/spring/__name__');
// 🗂️ 생성될 목적지
const destRoot = path.resolve(
  `backend/src/main/java/com/sisyphus/backend/${name}`,
);

async function copyTemplates(srcDir: string, destDir: string) {
  const entries = await readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const isDir = entry.isDirectory();

    // ✅ 디렉토리 이름과 파일 이름만 치환
    const replacedName = entry.name
      .replace(/__name__/g, name)
      .replace(/__Name__/g, PascalCase);

    const destPath = path.join(destDir, replacedName);

    if (isDir) {
      await mkdir(destPath, { recursive: true });
      await copyTemplates(srcPath, destPath); // 재귀 호출
    } else {
      const content = await readFile(srcPath, 'utf8');
      const replacedContent = content
        .replace(/__name__/g, name)
        .replace(/__Name__/g, PascalCase);

      await mkdir(destDir, { recursive: true });
      await writeFile(destPath, replacedContent);
      console.log(`✅ Created: ${destPath}`);
    }
  }
}

if (!existsSync(templateRoot)) {
  console.error(`❌ Template folder not found: ${templateRoot}`);
  process.exit(1);
}

await copyTemplates(templateRoot, destRoot);
console.log(`🎉 Feature '${name}' created at ${destRoot}`);
