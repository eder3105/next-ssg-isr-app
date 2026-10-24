import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="p-8 text-center text-white">
      <h2 className="text-3xl font-bold mb-4">Pokémon no encontrado</h2>
      <Link
        href="/pokemon"
        className="bg-black px-6 py-3 rounded-lg hover:bg-purple-900 inline-block"
      >
        Volver al Pokédex
      </Link>
    </div>
  );
}
