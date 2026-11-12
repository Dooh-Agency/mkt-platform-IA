import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOOH Agency AI Platform",
  description: "El usuario administra su negocio. La IA administra la complejidad.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
