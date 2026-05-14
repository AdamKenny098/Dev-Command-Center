import type { Metadata } from "next";

import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Command Center",
  description: "Local command center for solo developer projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-dvh bg-slate-950 text-slate-100 lg:flex">
          <Sidebar />
          <main className="min-w-0 flex-1 p-5 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
