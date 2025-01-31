import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayolin",
  description: "Ayolin potenciado el mundo IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-50" >{children}</body>
    </html>
  );
}
