'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CharacterResponse } from '@/types/rickandmorty';

const API = 'https://rickandmortyapi.com/api/character';

const statusDot: Record<string, string> = {
  Alive: 'bg-green-400',
  Dead: 'bg-red-500',
  unknown: 'bg-gray-400',
};

const emptyFilters = { name: '', status: '', type: '', gender: '' };

const field =
  'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-400 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-400/30';

const grid = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';

export default function CharacterExplorer({ initial }: { initial: CharacterResponse }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CharacterResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasFilters = Object.values(filters).some(Boolean);
  const isDefault = page === 1 && !hasFilters;

  useEffect(() => {
    if (isDefault) return;
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ page: String(page) });
        Object.entries(filters).forEach(([k, v]) => {
          if (v) params.set(k, v);
        });
        const url = `${API}?${params}`;

        let res = await fetch(url, { signal: controller.signal });
        if (res.status === 429) {
          // límite de la API: espera y reintenta una vez
          await new Promise((r) => setTimeout(r, 1500));
          if (controller.signal.aborted) return;
          res = await fetch(url, { signal: controller.signal });
        }

        if (res.status === 404) {
          setData(null);
          setError('No se encontraron personajes con esos filtros');
        } else if (!res.ok) {
          setData(null);
          setError(`Error al buscar personajes (HTTP ${res.status}). Intenta de nuevo en unos segundos.`);
        } else {
          setData(await res.json());
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setData(null);
        setError('No se pudo conectar con la API. Revisa tu conexión.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 400); // debounce: espera 400 ms después de dejar de escribir

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, page, isDefault]);

  const update = (key: keyof typeof emptyFilters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const reset = () => {
    setFilters(emptyFilters);
    setPage(1);
    setError('');
  };

  const shown = isDefault ? initial : data;

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className={field}
            placeholder="Buscar por nombre..."
            value={filters.name}
            onChange={(e) => update('name', e.target.value)}
          />
          <select
            className={field}
            value={filters.status}
            onChange={(e) => update('status', e.target.value)}
          >
            <option value="">Status (todos)</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
          <input
            className={field}
            placeholder="Type (ej. Parasite)"
            value={filters.type}
            onChange={(e) => update('type', e.target.value)}
          />
          <select
            className={field}
            value={filters.gender}
            onChange={(e) => update('gender', e.target.value)}
          >
            <option value="">Gender (todos)</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="genderless">Genderless</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-gray-400">
            {loading
              ? 'Buscando en el multiverso...'
              : shown
              ? `${shown.info.count} personajes encontrados`
              : ''}
          </p>
          {hasFilters && (
            <button
              onClick={reset}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-gray-300 transition hover:border-green-400 hover:text-green-300"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {error && !loading && (
        <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className={grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <div className="aspect-square bg-white/10" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={grid}>
          {shown?.results.map((c) => (
            <Link
              key={c.id}
              href={`/rickandmorty/${c.id}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-green-400/60 hover:shadow-[0_0_40px_-10px_rgba(74,222,128,0.6)]"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.name}
                  width={300}
                  height={300}
                  loading="lazy"
                  style={{ width: '100%', height: 'auto' }}
                  className="transition duration-500 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <span className={`h-2.5 w-2.5 rounded-full ${statusDot[c.status]}`} />
                  {c.status}
                </span>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-green-300 backdrop-blur">
                  #{c.id}
                </span>
              </div>
              <div className="p-4">
                <h2 className="truncate text-lg font-bold transition group-hover:text-green-300">
                  {c.name}
                </h2>
                <p className="text-sm text-gray-300">
                  {c.species} · {c.gender}
                </p>
                <p className="mt-2 truncate text-xs text-gray-500">
                  Última ubicación: {c.location.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {shown && shown.info.pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-semibold transition hover:border-green-400 hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Anterior
          </button>
          <span className="rounded-xl bg-black/40 px-4 py-2.5 text-sm text-gray-300">
            Página <strong className="text-green-300">{page}</strong> de {shown.info.pages}
          </span>
          <button
            disabled={page >= shown.info.pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-semibold transition hover:border-green-400 hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
