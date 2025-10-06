const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'index.html');

try {
  const content = fs.readFileSync(targetFile, 'utf8');
  const conflictMarkers = ['<<<<<<<', '=======', '>>>>>>>'];
  const foundMarkers = conflictMarkers.filter(marker => content.includes(marker));

  if (foundMarkers.length > 0) {
    console.error(`Sono stati trovati marker di conflitto (${foundMarkers.join(', ')}) in index.html.`);
    process.exitCode = 1;
  } else {
    console.log('Nessun marker di conflitto rilevato in index.html.');
  }
} catch (error) {
  console.error('Impossibile leggere index.html:', error);
  process.exitCode = 1;
}
