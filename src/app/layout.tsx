import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Header } from "@/components/motrick/Header";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Motrick — Repuestos, talleres y bitácora para tu auto",
  description: "Compra repuestos compatibles, encuentra talleres verificados y lleva la bitácora de tu vehículo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <AppProvider>
          <Header />
          <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6 md:pb-16 md:pt-8">
            {children}
          </main>
          <Toaster position="bottom-right" />
        </AppProvider>
      </body>
    </html>
  );
}
