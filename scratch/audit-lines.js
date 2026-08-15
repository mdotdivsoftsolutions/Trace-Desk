const fs = require('fs');
const path = require('path');

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.tsx') || (file.endsWith('.ts') && !file.endsWith('.d.ts'))) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const srcDir = path.join(__dirname, '../src');
const files = walkDir(srcDir);

const overLimit = [];

for (const file of files) {
  const relPath = path.relative(srcDir, file);
  // Only check frontend (app and components)
  if (!relPath.startsWith('app') && !relPath.startsWith('components')) continue;
  // Ignore API routes for this check
  if (relPath.includes('api' + path.sep)) continue;

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n').length;
  if (lines > 120) {
    overLimit.push({ file: relPath, lines });
  }
}

overLimit.sort((a, b) => b.lines - a.lines);

console.log('Files exceeding 120 lines:');
console.table(overLimit);
console.log(`Total files to refactor: ${overLimit.length}`);
