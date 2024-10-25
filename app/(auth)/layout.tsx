import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { esES } from '@clerk/localizations'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dropped - Admin Auth",
  description: "Admin dashboard to manage Dropped's data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={esES}
    >
      <html lang="es" suppressHydrationWarning={true}>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
