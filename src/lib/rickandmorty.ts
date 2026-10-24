import { Character, CharacterResponse } from '@/types/rickandmorty';

const API = 'https://rickandmortyapi.com/api/character';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Reintenta si la API responde 429 (demasiadas peticiones)
async function fetchWithRetry(url: string, init: RequestInit, retries = 6): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, init);
    if (res.status !== 429) return res;
    const retryAfter = Number(res.headers.get('retry-after'));
    await sleep(retryAfter ? retryAfter * 1000 : 1500 * (i + 1));
  }
  return fetch(url, init);
}

// Lista: caché forzada (SSG)
export async function getCharacters(page = 1): Promise<CharacterResponse> {
  const res = await fetchWithRetry(`${API}?page=${page}`, { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Error al cargar personajes (HTTP ${res.status})`);
  return res.json();
}

// Detalle: ISR cada 10 días (864000 segundos)
export async function getCharacter(id: string): Promise<Character | null> {
  const res = await fetchWithRetry(`${API}/${id}`, { next: { revalidate: 864000 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error al cargar el personaje (HTTP ${res.status})`);
  return res.json();
}

// IDs de todos los personajes para generateStaticParams.
// Los IDs de la API son consecutivos (1..count), así que basta una sola petición.
export async function getAllCharacterIds(): Promise<number[]> {
  const first = await getCharacters(1);
  return Array.from({ length: first.info.count }, (_, i) => i + 1);
}