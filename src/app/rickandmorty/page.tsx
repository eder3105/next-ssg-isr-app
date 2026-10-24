import Image from 'next/image';
import { getCharacters } from '@/lib/rickandmorty';
import CharacterExplorer from '@/components/CharacterExplorer';

export default async function RickAndMortyPage() {
  const initial = await getCharacters(1);

  const stats: [string, string][] = [
    [String(initial.info.count), 'Personajes'],
    [String(initial.info.pages), 'Páginas'],
    ['10 días', 'Revalidación ISR'],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      <header className="mb-14 grid items-center gap-10 md:grid-cols-[1fr_340px]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
            Dimensión C-137
          </p>
          <h1 className="font-title slime text-6xl leading-none md:text-8xl">
            Explora el multiverso
          </h1>
          <p className="mt-6 max-w-xl text-gray-300">
            Busca entre todos los personajes de Rick and Morty por nombre, estado, tipo o
            género. Cada ficha se genera de forma estática y se actualiza cada 10 días.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
            <span className="rounded-full border border-green-400/40 bg-green-400/10 px-4 py-1.5 text-green-300">
              Lista: SSR + force-cache
            </span>
            <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 text-cyan-300">
              Búsqueda: CSR
            </span>
            <span className="rounded-full border border-purple-400/40 bg-purple-400/10 px-4 py-1.5 text-purple-300">
              Detalle: SSG + ISR
            </span>
          </div>

          <div className="mt-8 grid max-w-lg grid-cols-3 gap-4">
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-green-400/20 bg-black/40 p-4 text-center backdrop-blur"
              >
                <p className="font-title slime text-3xl">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-float relative mx-auto h-72 w-72 md:h-80 md:w-80">
          <div className="portal-ring absolute inset-0" />
          <div className="absolute inset-3 rounded-full bg-black" />
          <div className="absolute inset-5 overflow-hidden rounded-full">
            <Image
              src="https://rickandmortyapi.com/api/character/avatar/1.jpeg"
              alt="Rick Sanchez"
              width={300}
              height={300}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </header>

      <CharacterExplorer initial={initial} />
    </div>
  );
}
