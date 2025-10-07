const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function hasConflictMarkers(content) {
  return content.split(/\r?\n/).some((line) =>
    line.startsWith('<<<<<<< ') ||
    line === '=======' ||
    line.startsWith('>>>>>>> ')
  );
}

function detectConflicts() {
  const filesList = execSync('git ls-files', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
    .filter((file) => file !== 'scripts/check-conflicts.js');

  const conflictedFiles = [];

  for (const relativePath of filesList) {
    const absolutePath = path.join(process.cwd(), relativePath);
    try {
      const stats = fs.statSync(absolutePath);
      if (!stats.isFile()) continue;

      const content = fs.readFileSync(absolutePath, 'utf8');
      if (hasConflictMarkers(content)) {
        conflictedFiles.push(relativePath);
      }
    } catch (error) {
      console.error(`Impossibile leggere ${relativePath}:`, error);
      process.exitCode = 1;
      return;
    }
  }

  if (conflictedFiles.length > 0) {
    console.error('Sono stati trovati marker di conflitto nei seguenti file:');
    conflictedFiles.forEach((file) => console.error(` - ${file}`));
    process.exitCode = 1;
  } else {
    console.log('Nessun marker di conflitto rilevato nei file tracciati.');
  }
}

detectConflicts();
