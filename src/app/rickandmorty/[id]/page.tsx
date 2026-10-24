import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCharacter, getAllCharacterIds } from '@/lib/rickandmorty';

export const revalidate = 864000; // 10 días (ISR)

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllCharacterIds();
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const c = await getCharacter(id);
  return { title: c ? `${c.name} - Rick and Morty` : 'No encontrado' };
}

const statusStyle: Record<string, string> = {
  Alive: 'border-green-500/40 bg-green-500/15 text-green-300',
  Dead: 'border-red-500/40 bg-red-500/15 text-red-300',
  unknown: 'border-gray-500/40 bg-gray-500/15 text-gray-300',
};

export default async function CharacterDetail({ params }: Props) {
  const { id } = await params;
  const c = await getCharacter(id);
  if (!c) notFound();

  // Todos los campos del Response de la API
  const info: [string, string][] = [
    ['id', `#${c.id}`],
    ['name', c.name],
    ['status', c.status],
    ['species', c.species],
    ['type', c.type || '—'],
    ['gender', c.gender],
    ['origin.name', c.origin.name],
    ['origin.url', c.origin.url || '—'],
    ['location.name', c.location.name],
    ['location.url', c.location.url || '—'],
    ['image', c.image],
    ['url', c.url],
    ['created', new Date(c.created).toLocaleString('es-PE')],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
      <Link
        href="/rickandmorty"
        className="mb-8 inline-block rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold transition hover:border-green-400 hover:text-green-300"
      >
        ← Volver al multiverso
      </Link>

      <div className="overflow-hidden rounded-3xl border border-green-400/20 bg-black/50 backdrop-blur-md">
        <div className="bg-linear-to-r from-black via-green-950 to-green-700/60 px-8 py-10 text-center">
          <span
            className={`inline-block rounded-full border px-4 py-1 text-sm font-semibold ${statusStyle[c.status]}`}
          >
            {c.status}
          </span>
          <h1 className="font-title slime mt-4 text-5xl md:text-7xl">{c.name}</h1>
          <p className="mt-2 text-gray-300">
            {c.species} · {c.gender}
          </p>
        </div>

        <div className="grid items-start gap-10 p-8 md:grid-cols-[340px_1fr]">
          <div className="animate-float relative mx-auto h-72 w-72 md:h-80 md:w-80">
            <div className="portal-ring absolute inset-0" />
            <div className="absolute inset-3 rounded-full bg-black" />
            <div className="absolute inset-5 overflow-hidden rounded-full">
              <Image
                src={c.image}
                alt={c.name}
                width={300}
                height={300}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="font-title slime mb-4 text-3xl">Información</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {info.map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-green-400">{label}</p>
                  <p className="mt-1 break-all font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-8">
          <h2 className="font-title slime mb-4 text-3xl">episode ({c.episode.length})</h2>
          <div className="flex flex-wrap gap-2">
            {c.episode.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                title={url}
                className="rounded-lg border border-green-400/20 bg-black/40 px-3 py-1 text-xs font-semibold text-gray-300 transition hover:border-green-400 hover:text-green-300"
              >
                EP {url.split('/').pop()}
              </a>
            ))}
          </div>
        </div>

        <details className="border-t border-white/10 p-8">
          <summary className="cursor-pointer font-semibold text-green-300">
            Ver Response completo (JSON)
          </summary>
          <pre className="mt-4 max-h-96 overflow-auto rounded-xl bg-black/60 p-4 text-xs text-green-200">
            {JSON.stringify(c, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
