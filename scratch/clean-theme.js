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

  // 1. Update dark background & surfaces from pitch black to soft premium light-dark
  content = content.replace(/#0A0A0A/gi, '#111318');
  content = content.replace(/#141414/gi, '#161920');
  content = content.replace(/#1A1A1A/gi, '#1C2029');
  content = content.replace(/#2A2A2A/gi, '#2D333F');

  // 2. Replace primary buttons (bg-indigo-600 hover:bg-indigo-700 text-white) with black in light / white in dark
  content = content.replace(
    /bg-indigo-600 hover:bg-indigo-700( active:scale-95)? text-white/g,
    'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95'
  );
  content = content.replace(
    /bg-indigo-600 text-white/g,
    'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
  );

  // 3. Replace indigo shadows
  content = content.replace(/shadow-indigo-600\/\d+/g, 'shadow-sm');
  content = content.replace(/shadow-indigo-500\/\d+/g, 'shadow-sm');

  // 4. Replace indigo icon containers (bg-indigo-50 text-indigo-600)
  content = content.replace(
    /bg-indigo-50 dark:bg-indigo-950\/(40|50|60) text-indigo-(500|600) dark:text-indigo-400/g,
    'bg-neutral-100 dark:bg-[#252B37] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#2D333F]'
  );
  content = content.replace(
    /bg-indigo-50(0)?\/10 text-indigo-(500|600) dark:text-indigo-400/g,
    'bg-neutral-100 dark:bg-[#252B37] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#2D333F]'
  );
  content = content.replace(
    /bg-indigo-50 text-indigo-600/g,
    'bg-neutral-100 dark:bg-[#252B37] text-neutral-800 dark:text-neutral-200'
  );

  // 5. Replace text-indigo-600 dark:text-indigo-400 header icon colors
  content = content.replace(
    /text-indigo-600 dark:text-indigo-400/g,
    'text-neutral-900 dark:text-white'
  );
  content = content.replace(
    /text-indigo-600/g,
    'text-neutral-900 dark:text-white'
  );
  content = content.replace(
    /text-indigo-500/g,
    'text-neutral-700 dark:text-neutral-300'
  );
  content = content.replace(
    /text-indigo-400/g,
    'text-neutral-600 dark:text-neutral-400'
  );

  // 6. Replace focus ring
  content = content.replace(
    /focus:ring-indigo-500/g,
    'focus:ring-neutral-400 dark:focus:ring-neutral-500'
  );

  // 7. Replace indigo borders / badges
  content = content.replace(
    /border-indigo-500\/\d+/g,
    'border-neutral-200 dark:border-[#2D333F]'
  );
  content = content.replace(
    /border-indigo-200 dark:border-indigo-800/g,
    'border-neutral-200 dark:border-[#2D333F]'
  );

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Updated: ${path.relative(srcDir, file)}`);
  }
}

console.log(`Successfully updated ${modifiedCount} files.`);
