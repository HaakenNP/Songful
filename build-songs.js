const fs = require('fs');

function extractSongs(file) {
  const content = fs.readFileSync(file, 'utf8');
  const entries = [];
  const regex = /\{\s*title:\s*"([^"]+)"\s*,\s*artist:\s*"([^"]+)"\s*\}/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    entries.push({ title: m[1], artist: m[2] });
  }
  const seen = new Set();
  return entries.filter(e => {
    const key = e.title.toLowerCase() + '|' + e.artist.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const country = extractSongs('country-songs-output.ts');
const jazz = extractSongs('jazz_songs.txt');
const kpop = extractSongs('kpop_songs.txt');
const pop = extractSongs('pop-part1.ts');

function formatSongs(songs) {
  return songs.map(s => '    { title: ' + JSON.stringify(s.title) + ', artist: ' + JSON.stringify(s.artist) + ' },').join('\n');
}

const existing = fs.readFileSync('songless-react/src/data/songs.ts', 'utf8');

function extractExistingGenre(genre) {
  const regex = new RegExp(genre + ':\\s*\\[([\\s\\S]*?)\\],');
  const m = regex.exec(existing);
  if (!m) return [];
  const entries = [];
  const entryRegex = /\{\s*title:\s*"([^"]+)"\s*,\s*artist:\s*"([^"]+)"\s*\}/g;
  let em;
  while ((em = entryRegex.exec(m[1])) !== null) {
    entries.push({ title: em[1], artist: em[2] });
  }
  return entries;
}

const allGenre = extractExistingGenre('all');
const rock = extractExistingGenre('rock');
const hiphop = extractExistingGenre('hiphop');
const rnb = extractExistingGenre('rnb');
const edm = extractExistingGenre('edm');
const latin = extractExistingGenre('latin');
const indie = extractExistingGenre('indie');
const alt = extractExistingGenre('alt');

console.log('pop:', pop.length, '| country:', country.length, '| jazz:', jazz.length, '| kpop:', kpop.length);
console.log('all:', allGenre.length, '| rock:', rock.length, '| hiphop:', hiphop.length, '| rnb:', rnb.length);
console.log('edm:', edm.length, '| latin:', latin.length, '| indie:', indie.length, '| alt:', alt.length);

const output = `import type { Song, SongDB, Genre } from '../types';

export const SONG_DB: SongDB = {
  all: [
${formatSongs(allGenre)}
  ],

  pop: [
${formatSongs(pop)}
  ],

  rock: [
${formatSongs(rock)}
  ],

  hiphop: [
${formatSongs(hiphop)}
  ],

  rnb: [
${formatSongs(rnb)}
  ],

  country: [
${formatSongs(country)}
  ],

  edm: [
${formatSongs(edm)}
  ],

  latin: [
${formatSongs(latin)}
  ],

  indie: [
${formatSongs(indie)}
  ],

  jazz: [
${formatSongs(jazz)}
  ],

  kpop: [
${formatSongs(kpop)}
  ],

  alt: [
${formatSongs(alt)}
  ],
};

// Flatten all genres into a single searchable list
export const ALL_SONGS_FLAT: Song[] = Object.values(SONG_DB).flat();

export const GENRE_ORDER: Genre[] = ['all', 'pop', 'rock', 'hiphop', 'rnb', 'country', 'edm', 'latin', 'indie', 'jazz', 'kpop', 'alt'];

export const GENRE_LABELS: Record<Genre, string> = {
  all: 'All',
  pop: 'Pop',
  rock: 'Rock',
  hiphop: 'Hip Hop',
  rnb: 'R&B',
  country: 'Country',
  edm: 'EDM',
  latin: 'Latin',
  indie: 'Indie',
  jazz: 'Jazz',
  kpop: 'K-Pop',
  alt: 'Alt',
};
`;

fs.writeFileSync('songless-react/src/data/songs.ts', output);

const total = allGenre.length + pop.length + rock.length + hiphop.length + rnb.length + country.length + edm.length + latin.length + indie.length + jazz.length + kpop.length + alt.length;
console.log('Total songs:', total);
console.log('File written!');
