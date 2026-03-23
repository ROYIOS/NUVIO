export default function Home() {
  return (
    <main className="min-h-screen bg-white px-8 py-16 text-zinc-900">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
          Nuvio
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Control financiero claro, elegante y útil.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
          Sube tus movimientos, organiza tus gastos y construye una vista más
          inteligente de tu dinero.
        </p>

        <div className="mt-10 flex gap-4">
          <a
            href="/upload"
            className="rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white"
          >
            Ir a Upload
          </a>

          <a
            href="/api/test"
            className="rounded-2xl border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900"
          >
            Probar API
          </a>
        </div>
      </div>
    </main>
  );
}
