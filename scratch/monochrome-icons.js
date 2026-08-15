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

  // 1. Monochromatic Icon Containers
  content = content.replace(
    /bg-emerald-500\/10 text-emerald-600 dark:text-emerald-400/g,
    'bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155]'
  );
  content = content.replace(
    /bg-emerald-50 dark:bg-emerald-950\/60 text-emerald-600 dark:text-emerald-400/g,
    'bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155]'
  );
  content = content.replace(
    /bg-amber-500\/10 text-amber-600 dark:text-amber-400/g,
    'bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155]'
  );
  content = content.replace(
    /bg-amber-50 dark:bg-amber-950\/60 text-amber-600 dark:text-amber-400/g,
    'bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155]'
  );
  content = content.replace(
    /bg-purple-500\/10 text-purple-600 dark:text-purple-400/g,
    'bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155]'
  );
  content = content.replace(
    /bg-rose-500\/10 text-rose-600 dark:text-rose-400/g,
    'bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155]'
  );
  content = content.replace(
    /bg-rose-50 dark:bg-rose-950\/60 text-rose-600 dark:text-rose-400/g,
    'bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155]'
  );

  // 2. Monochromatic Specific Colored Icons
  content = content.replace(/text-amber-500/g, 'text-neutral-700 dark:text-neutral-300');
  content = content.replace(/text-amber-600/g, 'text-neutral-700 dark:text-neutral-300');
  content = content.replace(/text-emerald-500/g, 'text-neutral-700 dark:text-neutral-300');
  content = content.replace(/text-emerald-600/g, 'text-neutral-700 dark:text-neutral-300');
  content = content.replace(/text-purple-500/g, 'text-neutral-700 dark:text-neutral-300');
  content = content.replace(/text-purple-600/g, 'text-neutral-700 dark:text-neutral-300');
  content = content.replace(/text-rose-500/g, 'text-neutral-700 dark:text-neutral-300');
  content = content.replace(/text-rose-600/g, 'text-neutral-700 dark:text-neutral-300');

  // 3. Clean up any doubled borders
  content = content.replace(/border border-neutral-200 dark:border-\[#334155\] border border-neutral-200 dark:border-\[#334155\]/g, 'border border-neutral-200 dark:border-[#334155]');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Monochromed: ${path.relative(srcDir, file)}`);
  }
}

console.log(`Successfully converted icons in ${modifiedCount} files to Black & White.`);
