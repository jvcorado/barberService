import { Metadata } from "next";
import { ClientLayoutProvider } from "./components/client-layout-provider";

// Metadata estática
export const metadata: Metadata = {
  title: "Cliente - BarberApp",
  description:
    "Aplicativo mobile para clientes agendarem serviços na barbearia",
  manifest: "/manifest-client.json",
  themeColor: "#000000",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BarberApp Cliente",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <link rel="manifest" href="/manifest-client.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BarberApp Cliente" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
      </head>

      <ClientLayoutProvider>{children}</ClientLayoutProvider>
    </>
  );
}
