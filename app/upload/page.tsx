"use client";

import { useState } from "react";

type Transaction = {
  date: string;
  description: string;
  amount: number;
};

export default function UploadPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File) => {
    const text = await file.text();
    const rows = text.split("\n").slice(1);

    const parsed: Transaction[] = rows
      .map((row) => {
        const [date, description, amount] = row.split(",");
        if (!date || !amount) return null;

        return {
          date,
          description,
          amount: parseFloat(amount),
        };
      })
      .filter(Boolean) as Transaction[];

    setTransactions(parsed);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((a, b) => a + b.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((a, b) => a + b.amount, 0);

  return (
    <main className="min-h-screen bg-white px-8 py-16 text-zinc-900">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          NUVIO
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Importa tus movimientos con una experiencia clara y elegante.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-600">
          Sube un archivo CSV y revisa tus transacciones en una vista limpia.
        </p>

        {/* GRID */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* UPLOAD */}
          <div className="rounded-3xl border border-zinc-200 p-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Cargar archivo</h2>
              <span className="text-xs border px-2 py-1 rounded-full text-zinc-500">
                CSV only
              </span>
            </div>

            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => setDragging(true)}
              onDragLeave={() => setDragging(false)}
              className={`mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center ${
                dragging ? "border-black bg-zinc-100" : "border-zinc-300"
              }`}
            >
              <p className="text-zinc-600 mb-4">
                Arrastra tu archivo o selecciónalo
              </p>

              <input type="file" accept=".csv" onChange={onSelect} />
            </div>
          </div>

          {/* SUMMARY */}
          <div className="rounded-3xl border border-zinc-200 p-8">
            <h2 className="text-lg font-medium mb-6">Resumen</h2>

            <div className="space-y-4">
              <div className="bg-zinc-100 rounded-xl p-4">
                <p className="text-sm text-zinc-500">
                  Movimientos detectados
                </p>
                <p className="text-xl font-semibold">
                  {transactions.length}
                </p>
              </div>

              <div className="bg-zinc-100 rounded-xl p-4">
                <p className="text-sm text-zinc-500">Ingresos</p>
                <p className="text-xl font-semibold text-green-600">
                  ${income.toFixed(2)}
                </p>
              </div>

              <div className="bg-zinc-100 rounded-xl p-4">
                <p className="text-sm text-zinc-500">Gastos</p>
                <p className="text-xl font-semibold text-red-600">
                  ${expenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
