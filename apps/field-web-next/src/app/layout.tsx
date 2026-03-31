import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/providers/AuthProvider";

export const metadata: Metadata = {
  title: "BossOS Field",
  description: "Field tools, logs, and division workflows.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon-field.ico",
    shortcut: "/favicon-field.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
