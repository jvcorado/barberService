import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "../../providers/auth";

export const metadata: Metadata = {
  title: "App do Barbeiro",
  description: "Aplicativo mobile para gerenciamento da barbearia",
  manifest: "/barber_app/manifest.json",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BarberApp",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function BarberAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
