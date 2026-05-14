"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
  { href: "/activity", label: "Activity" },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex min-h-dvh w-full flex-col border-r border-slate-800 bg-slate-950 p-5 lg:w-72">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-red-300">
          Omen
        </p>
        <h1 className="mt-3 text-2xl font-bold text-white">
          Command Center
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Home first. Project workspaces second. Every edit leaves a trace.
        </p>
      </div>

      <nav className="mt-8 space-y-2">
        {links.map((link) => {
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl border px-4 py-3 text-sm transition ${
                active
                  ? "border-red-500/40 bg-red-500/10 text-red-200"
                  : "border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-sm font-semibold text-white">Version 3.7</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Activity trace, full workspace editing, project settings, and a smarter home dashboard.
        </p>
      </div>
    </aside>
  );
}
