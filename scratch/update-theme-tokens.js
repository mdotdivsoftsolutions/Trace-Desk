const fs = require('fs');
const path = require('path');

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const srcDir = path.join(__dirname, '../src');
const files = walkDir(srcDir);

let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace dark bg #0B0F19 with #0A0A0A
  content = content.replace(/#0B0F19/gi, '#0A0A0A');

  // Replace dark surface #131A2A with #1A1A1A
  content = content.replace(/#131A2A/gi, '#1A1A1A');

  // Replace dark border #232B3D with #2A2A2A
  content = content.replace(/#232B3D/gi, '#2A2A2A');

  // Replace light bg #F8FAFC with #F9FAFB where appropriate
  content = content.replace(/#F8FAFC/gi, '#F9FAFB');

  // Replace light border #E2E8F0 with #E5E7EB
  content = content.replace(/#E2E8F0/gi, '#E5E7EB');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Updated: ${path.relative(srcDir, file)}`);
  }
}

console.log(`Successfully updated ${modifiedCount} files.`);
