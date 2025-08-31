import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import AuthProvider from "../providers/auth";
import Footer from "@/components/footer";
/* import Footer from "./_components/footer";
import AuthProvider from "./_providers/auth";
 */
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reserva Agora",
  description:
    "é a plataforma ideal para você marcar serviços em poucos cliques. Seja para um corte de cabelo, uma consulta, ou qualquer outro atendimento, aqui você encontra praticidade e controle na palma da mão.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BarberApp",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="!dark ">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex h-full flex-col overflow-x-hidden">
            <div className="flex-1">{children}</div>
            {/* <Footer /> */}
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
