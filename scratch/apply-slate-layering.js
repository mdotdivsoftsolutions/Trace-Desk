const fs = require('fs');
const path = require('path');

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
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

  // Replace Main Backgrounds -> #0F172A (darkest)
  content = content.replace(/#111318/gi, '#0F172A');
  content = content.replace(/#0A0A0A/gi, '#0F172A');
  content = content.replace(/#161920/gi, '#0B1120');

  // Replace Card / Surface -> #1E293B (one step lighter)
  content = content.replace(/#1C2029/gi, '#1E293B');
  content = content.replace(/#1A1A1A/gi, '#1E293B');

  // Replace Elevated / Hover / Inputs -> #334155 (lighter still)
  content = content.replace(/#252B37/gi, '#334155');
  content = content.replace(/#242424/gi, '#334155');

  // Replace Borders -> #334155
  content = content.replace(/#2D333F/gi, '#334155');
  content = content.replace(/#2A2A2A/gi, '#334155');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Updated: ${path.relative(srcDir, file)}`);
  }
}

console.log(`Successfully updated ${modifiedCount} files with Slate Layering.`);
