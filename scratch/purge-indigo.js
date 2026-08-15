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

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace progress bars
  content = content.replace(/bg-indigo-600 h-full/g, 'bg-neutral-900 dark:bg-white h-full');
  content = content.replace(/h-full bg-indigo-600/g, 'h-full bg-neutral-900 dark:bg-white');
  content = content.replace(/from-indigo-500 via-purple-500 to-emerald-500/g, 'from-neutral-800 to-neutral-600 dark:from-white dark:to-neutral-300');
  content = content.replace(/from-indigo-500 to-emerald-500/g, 'from-neutral-800 to-neutral-600 dark:from-white dark:to-neutral-300');
  content = content.replace(/from-indigo-500 to-violet-500/g, 'from-neutral-800 to-neutral-600 dark:from-white dark:to-neutral-300');

  // Replace remaining hover & bg
  content = content.replace(/hover:bg-indigo-700/g, 'hover:bg-neutral-800 dark:hover:bg-neutral-200');
  content = content.replace(/hover:bg-indigo-100 dark:hover:bg-indigo-900\/50/g, 'hover:bg-neutral-200 dark:hover:bg-neutral-800');
  content = content.replace(/hover:bg-indigo-100/g, 'hover:bg-neutral-200 dark:hover:bg-neutral-800');
  content = content.replace(/hover:bg-indigo-50 dark:hover:bg-indigo-950\/40/g, 'hover:bg-neutral-100 dark:hover:bg-neutral-800');
  content = content.replace(/hover:bg-indigo-50 dark:hover:bg-indigo-950\/50/g, 'hover:bg-neutral-100 dark:hover:bg-neutral-800');
  content = content.replace(/bg-indigo-500\/10/g, 'bg-neutral-100 dark:bg-[#252B37]');
  content = content.replace(/bg-indigo-50 dark:bg-indigo-950\/50/g, 'bg-neutral-100 dark:bg-[#252B37]');
  content = content.replace(/bg-indigo-50 dark:bg-indigo-950\/60/g, 'bg-neutral-100 dark:bg-[#252B37]');
  content = content.replace(/bg-indigo-50\/50 dark:bg-indigo-950\/20/g, 'bg-neutral-50 dark:bg-[#1C2029]');
  content = content.replace(/text-indigo-700 dark:text-indigo-300/g, 'text-neutral-800 dark:text-neutral-200');
  content = content.replace(/text-indigo-400 hover:text-indigo-600/g, 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white');
  content = content.replace(/border-indigo-200\/50 dark:border-indigo-800\/50/g, 'border-neutral-200 dark:border-[#2D333F]');
  content = content.replace(/border-indigo-200\/60 dark:border-indigo-800\/60/g, 'border-neutral-200 dark:border-[#2D333F]');
  content = content.replace(/border-indigo-300 dark:border-indigo-800/g, 'border-neutral-300 dark:border-neutral-700');
  content = content.replace(/border-indigo-200 dark:border-indigo-900\/50/g, 'border-neutral-200 dark:border-[#2D333F]');
  content = content.replace(/border-indigo-200 dark:border-indigo-900\/40/g, 'border-neutral-200 dark:border-[#2D333F]');
  content = content.replace(/from-indigo-900\/10 via-purple-900\/5 to-transparent dark:from-indigo-950\/40 dark:via-\[#1C2029\] dark:to-\[#1C2029\]/g, 'bg-white dark:bg-[#1C2029]');
  content = content.replace(/from-indigo-600 via-indigo-500 to-purple-500/g, 'from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300');
  content = content.replace(/from-indigo-500\/10 via-purple-500\/5 to-neutral-500\/5/g, 'bg-neutral-50 dark:bg-[#1C2029]');
  content = content.replace(/border-indigo-500/g, 'border-neutral-900 dark:border-white');
  content = content.replace(/ring-indigo-500\/20/g, 'ring-neutral-400/20');
  content = content.replace(/ring-indigo-500/g, 'ring-neutral-400');
  content = content.replace(/selection:bg-indigo-600/g, 'selection:bg-neutral-900 dark:selection:bg-white dark:selection:text-neutral-900');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
  }
}
console.log('Complete indigo purge finished.');
