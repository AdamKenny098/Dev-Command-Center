"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview" },
  { href: "/board", label: "Board" },
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-800 bg-slate-950 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="p-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h1 className="text-lg font-semibold text-white">Project Command Center</h1>
          <p className="mt-1 text-sm text-slate-400">Solo dev project management hub</p>
        </div>

        <nav className="mt-6 space-y-2">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-white text-slate-950"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-medium text-white">Version 0.1</p>
          <p className="mt-2 text-sm text-slate-400">
            Mock data first. Real backend later.
          </p>
        </div>
      </div>
    </aside>
  );
}