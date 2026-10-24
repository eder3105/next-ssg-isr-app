import { Character, CharacterResponse } from '@/types/rickandmorty';
import snapshot from '@/data/characters.json';

const API = 'https://rickandmortyapi.com/api/character';
const PAGE_SIZE = 20; // la API devuelve 20 personajes por página

// Copia local de respaldo (por si la API responde 429 durante el build)
const SNAPSHOT = snapshot as unknown as Character[];

let apiDown = false;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Reintenta con espera creciente si la API responde 429
async function fetchWithRetry(url: string, init: RequestInit, retries = 4): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, init);
    if (res.status !== 429) return res;
    const retryAfter = Number(res.headers.get('retry-after'));
    await sleep(retryAfter ? Math.min(retryAfter, 10) * 1000 : 2000 * (i + 1));
  }
  return fetch(url, init);
}

function fromSnapshot(page: number): CharacterResponse | null {
  if (!SNAPSHOT.length) return null;
  const pages = Math.ceil(SNAPSHOT.length / PAGE_SIZE);
  if (page < 1 || page > pages) return null;
  return {
    info: { count: SNAPSHOT.length, pages, next: null, prev: null },
    results: SNAPSHOT.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  };
}

async function loadPage(url: string, page: number, init: RequestInit): Promise<CharacterResponse | null> {
  if (apiDown) return fromSnapshot(page);
  try {
    const res = await fetchWithRetry(url, init);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as CharacterResponse;
  } catch (e) {
    const backup = fromSnapshot(page);
    if (backup) {
      apiDown = true; // no insistir más con la API en este proceso
      return backup;
    }
    throw new Error(`Error al cargar personajes (${e instanceof Error ? e.message : 'desconocido'})`);
  }
}

// Lista: caché forzada (SSG)
export async function getCharacters(page = 1): Promise<CharacterResponse> {
  const data = await loadPage(`${API}?page=${page}`, page, { cache: 'force-cache' });
  if (!data) throw new Error('No se encontraron personajes');
  return data;
}

// Detalle: ISR cada 10 días (864000 segundos).
// Los IDs son consecutivos: el personaje n está en la página ceil(n / 20).
export async function getCharacter(id: string): Promise<Character | null> {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) return null;

  const page = Math.ceil(n / PAGE_SIZE);
  const data = await loadPage(`${API}/?page=${page}`, page, { next: { revalidate: 864000 } });
  return data?.results.find((c) => c.id === n) ?? null;
}

// IDs de todos los personajes para generateStaticParams (van de 1 a count)
export async function getAllCharacterIds(): Promise<number[]> {
  const first = await getCharacters(1);
  return Array.from({ length: first.info.count }, (_, i) => i + 1);
}
