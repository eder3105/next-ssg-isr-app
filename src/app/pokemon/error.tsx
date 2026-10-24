'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-8 text-center text-white">
      <h2 className="text-3xl font-bold mb-4">Algo salió mal</h2>
      <p className="mb-6">{error.message}</p>
      <button onClick={reset} className="bg-black px-6 py-3 rounded-lg hover:bg-purple-900">
        Reintentar
      </button>
    </div>
  );
}
