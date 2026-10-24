import { writeFileSync, mkdirSync } from 'node:fs';

const API = 'https://rickandmortyapi.com/api/character';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getPage(page) {
  for (let i = 0; i < 12; i++) {
    const res = await fetch(`${API}?page=${page}`);
    if (res.ok) return res.json();
    if (res.status !== 429) throw new Error(`HTTP ${res.status} en la página ${page}`);
    const wait = 5000 * (i + 1);
    console.log(`429 en la página ${page}, esperando ${wait / 1000}s...`);
    await sleep(wait);
  }
  throw new Error(`No se pudo descargar la página ${page}`);
}

const first = await getPage(1);
const all = [...first.results];
console.log(`Página 1/${first.info.pages}`);

for (let p = 2; p <= first.info.pages; p++) {
  const data = await getPage(p);
  all.push(...data.results);
  console.log(`Página ${p}/${first.info.pages}`);
  await sleep(1500);
}

mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/characters.json', JSON.stringify(all));
console.log(`Listo: ${all.length} personajes guardados en src/data/characters.json`);
