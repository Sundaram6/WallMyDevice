import fs from 'node:fs';
import path from 'node:path';

const TARGET_DIRS = ['app', 'components'];
const HEX_REGEX = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/g;

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDir(filePath, fileList);
    } else if (/\.(tsx|ts|css)$/.test(file) && !file.endsWith('.test.tsx') && !file.endsWith('.test.ts')) {
      // Exclude hardware frames, metadata files, test pages, and global CSS
      if (
        !file.endsWith('Frame.tsx') &&
        !file.endsWith('Hero.tsx') &&
        !file.endsWith('globals.css') &&
        !file.endsWith('layout.tsx') &&
        !file.endsWith('opengraph-image.tsx') &&
        !filePath.includes('scale-test')
      ) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

let violations = 0;
const report = [];

// Check for legacy brand-* class usages
const LEGACY_BRAND_REGEX = /\b(bg-brand-[a-z0-9-]+|text-brand-[a-z0-9-]+|border-brand-[a-z0-9-]+)\b/g;

for (const targetDir of TARGET_DIRS) {
  const fullDirPath = path.resolve(process.cwd(), targetDir);
  if (!fs.existsSync(fullDirPath)) continue;
  
  const files = scanDir(fullDirPath);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Ignore comments
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

      // Ignore generator palette array definitions e.g. ["#111111", "#ff0000"] or palette data or viewport themeColor
      if (trimmed.includes('palette:') || trimmed.includes('themeColor:') || (trimmed.includes('["#') && !trimmed.includes('className'))) return;

      // Check for raw hex colors in UI files
      const hexMatches = line.match(HEX_REGEX);
      if (hexMatches) {
        hexMatches.forEach((hex) => {
          violations++;
          report.push(`${path.relative(process.cwd(), file)}:${index + 1}: Hardcoded hex color "${hex}" found in UI element.`);
        });
      }

      // Check for legacy brand-* classes in new/edited UI files
      const brandMatches = line.match(LEGACY_BRAND_REGEX);
      if (brandMatches) {
        brandMatches.forEach((brandCls) => {
          violations++;
          report.push(`${path.relative(process.cwd(), file)}:${index + 1}: Legacy token class "${brandCls}" found in UI element.`);
        });
      }
    });
  }
}

if (violations > 0) {
  console.error(`\n❌ Token Check Failed: ${violations} violation(s) found:\n`);
  report.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
} else {
  console.log(`\n✅ Token Check Passed: 0 violations found across UI components in ${TARGET_DIRS.join(', ')}.\n`);
  process.exit(0);
}
