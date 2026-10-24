import { ReactNode } from 'react';
import Link from 'next/link';
import { Bangers } from 'next/font/google';

const bangers = Bangers({ weight: '400', subsets: ['latin'], variable: '--font-bangers' });

const phrases = [
  "Wubba Lubba Dub Dub",
  "Get Schwifty",
  "And that's the way the news goes",
  "Pickle Rick",
  "Show me what you got",
  "Rubber baby buggy bumpers",
];

export default function RMLayout({ children }: { children: ReactNode }) {
  const ticker = [...phrases, ...phrases];

  return (
    <div className={`${bangers.variable} portal-bg stars relative min-h-screen text-white`}>
      <div className="relative z-10">
        <div className="overflow-hidden border-b border-green-400/20 bg-green-400/10 py-1.5">
          <div className="marquee flex w-max gap-12 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-green-300">
            {ticker.map((p, i) => (
              <span key={i}>◉ {p}</span>
            ))}
          </div>
        </div>

        <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
            <Link href="/rickandmorty" className="font-title slime text-3xl">
              Rick and Morty
            </Link>
            <div className="flex gap-6 text-sm text-gray-300">
              <Link href="/rickandmorty" className="transition hover:text-green-300">
                Personajes
              </Link>
              <Link href="/" className="transition hover:text-green-300">
                Inicio
              </Link>
            </div>
          </div>
        </nav>

        {children}
      </div>
    </div>
  );
}
