import fs from 'node:fs';
import path from 'node:path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace inline styles and remaining hexes with tokens
  content = content
    .replace(/#EDE8E0/g, 'var(--paper-200)')
    .replace(/#E4DFD3/g, 'var(--paper-300)')
    .replace(/#D4CDBC/g, 'var(--paper-300)')
    .replace(/#FAF8F4/g, 'var(--paper-50)')
    .replace(/#F5F1EB/g, 'var(--paper-50)')
    .replace(/#F3EFE6/g, 'var(--paper-100)')
    .replace(/#F6F3EC/g, 'var(--paper-50)')
    .replace(/#2B2A26/g, 'var(--ink-900)')
    .replace(/#5B584F/g, 'var(--ink-700)')
    .replace(/#8A8579/g, 'var(--ink-500)')
    .replace(/#A0968C/g, 'var(--ink-400)')
    .replace(/#C4BAA8/g, 'var(--paper-300)')
    .replace(/#C9552F/g, 'var(--accent-500)')
    .replace(/#B04523/g, 'var(--accent-600)');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated inline styles in:', filePath);
  }
}

function scanAndClean(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanAndClean(fullPath);
    } else if (/\.(tsx|ts)$/.test(file) && !file.endsWith('Frame.tsx') && !file.endsWith('Hero.tsx')) {
      processFile(fullPath);
    }
  }
}

scanAndClean('components');
scanAndClean('app');
