"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";

type CsvRow = {
  date?: string;
  description?: string;
  amount?: string;
};

type TransactionRow = {
  date: string;
  description: string;
  amount: string;
};

export default function UploadPage() {
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const totalIncome = useMemo(() => {
    return rows.reduce((acc, row) => {
      const amount = Number(row.amount);
      return amount > 0 ? acc + amount : acc;
    }, 0);
  }, [rows]);

  const totalExpense = useMemo(() => {
    return rows.reduce((acc, row) => {
      const amount = Number(row.amount);
      return amount < 0 ? acc + amount : acc;
    }, 0);
  }, [rows]);

  const handleFileUpload = (file: File) => {
    setError("");
    setRows([]);
    setFileName(file.name);

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedRows = result.data
          .map((row) => ({
            date: row.date?.trim() ?? "",
            description: row.description?.trim() ?? "",
            amount: row.amount?.trim() ?? "",
          }))
          .filter(
            (row) => row.date !== "" || row.description !== "" || row.amount !== ""
          );

        const validShape = parsedRows.every(
          (row) =>
            typeof row.date === "string" &&
            typeof row.description === "string" &&
            typeof row.amount === "string"
        );

        if (!validShape || parsedRows.length === 0) {
          setError(
            "No se pudo leer el archivo. Asegúrate de usar columnas: date, description, amount."
          );
          return;
        }

        setRows(parsedRows);
      },
      error: () => {
        setError("No se pudo procesar el archivo CSV.");
      },
    });
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
            Nuvio
          </p>

          <div className="mt-4 max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Importa tus movimientos con una experiencia clara y elegante.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Sube un archivo CSV y revisa tus transacciones en una vista limpia,
              diseñada para preparar el análisis de gastos, presupuesto y metas.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50/70 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Cargar archivo
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Utiliza un archivo CSV con las columnas{" "}
                  <span className="font-medium text-zinc-900">date</span>,{" "}
                  <span className="font-medium text-zinc-900">description</span> y{" "}
                  <span className="font-medium text-zinc-900">amount</span>.
                </p>
              </div>

              <div className="hidden rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500 sm:block">
                CSV only
              </div>
            </div>

            <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center transition hover:border-zinc-400">
              <div className="mx-auto max-w-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                  ↑
                </div>

                <h3 className="mt-5 text-lg font-medium tracking-tight text-zinc-900">
                  Selecciona tu estado de cuenta
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Arrastra tu archivo aquí o selecciónalo manualmente desde tu
                  dispositivo.
                </p>

                <div className="mt-6 inline-flex rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white">
                  Elegir archivo
                </div>

                {fileName && (
                  <p className="mt-4 text-sm text-zinc-600">
                    Archivo cargado:{" "}
                    <span className="font-medium text-zinc-900">{fileName}</span>
                  </p>
                )}
              </div>

              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
              />
            </label>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <aside className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight">Resumen</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-zinc-50 px-5 py-4">
                <p className="text-sm text-zinc-500">Movimientos detectados</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {rows.length}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 px-5 py-4">
                <p className="text-sm text-zinc-500">Ingresos</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 px-5 py-4">
                <p className="text-sm text-zinc-500">Gastos</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  ${Math.abs(totalExpense).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-zinc-200 pt-6">
              <p className="text-sm leading-6 text-zinc-600">
                Esta vista es el primer paso para construir clasificación
                automática, presupuesto por categoría y metas de ahorro.
              </p>
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-3xl border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5 sm:px-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Vista previa de movimientos
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Revisión inicial antes de categorizar y guardar en la base de datos.
              </p>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="px-6 py-16 text-center sm:px-8">
              <p className="text-lg font-medium tracking-tight text-zinc-900">
                Aún no hay movimientos cargados
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Sube un archivo CSV para visualizar tus transacciones.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 sm:px-8">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 sm:px-8">
                      Descripción
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 sm:px-8">
                      Monto
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => {
                    const amount = Number(row.amount);
                    const isIncome = amount > 0;

                    return (
                      <tr
                        key={`${row.date}-${row.description}-${index}`}
                        className="border-b border-zinc-100 last:border-b-0"
                      >
                        <td className="px-6 py-4 text-sm text-zinc-600 sm:px-8">
                          {row.date}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-zinc-900 sm:px-8">
                          {row.description}
                        </td>

                        <td
                          className={`px-6 py-4 text-right text-sm font-medium sm:px-8 ${
                            isIncome ? "text-zinc-900" : "text-zinc-600"
                          }`}
                        >
                          {amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
