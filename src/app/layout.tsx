import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ask Andrii — voice agent demo",
  description:
    "A voice agent that answers questions about Andrii Sirko's CV and drives the UI while it talks. Built with ElevenLabs Agents and Next.js.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
