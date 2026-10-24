import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js SSG + ISR",
  description: "Laboratorio de enrutamiento y páginas",
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