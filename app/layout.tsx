import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuvio",
  description: "Plataforma premium para control de gastos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}