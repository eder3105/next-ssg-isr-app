import { getCharacters } from '@/lib/rickandmorty';
import CharacterExplorer from '@/components/CharacterExplorer';

export default async function RickAndMortyPage() {
  const initial = await getCharacters(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <header className="text-center mb-12">
        <p className="text-green-400 font-semibold tracking-widest text-sm uppercase mb-3">
          Multiverso de personajes
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-linear-to-r from-green-300 via-cyan-300 to-green-400 bg-clip-text text-transparent">
          Explora a todos
        </h1>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
          {initial.info.count} personajes del universo de Rick and Morty. Busca por nombre,
          estado, tipo o género.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs font-semibold">
          <span className="rounded-full border border-green-400/40 bg-green-400/10 px-4 py-1.5 text-green-300">
            Lista: SSR + force-cache
          </span>
          <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 text-cyan-300">
            Búsqueda: CSR
          </span>
          <span className="rounded-full border border-purple-400/40 bg-purple-400/10 px-4 py-1.5 text-purple-300">
            Detalle: SSG + ISR 10 días
          </span>
        </div>
      </header>

      <CharacterExplorer initial={initial} />
    </div>
  );
}