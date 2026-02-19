"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/manage", label: "Manage" },
  { href: "/study", label: "Study" },
  { href: "/test", label: "Test" },
  { href: "/report", label: "Report" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-6 h-14">
        <span className="font-bold text-lg tracking-tight mr-4">Flash Cards</span>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors hover:text-indigo-200 ${
              pathname === link.href ? "underline text-white" : "text-indigo-200"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
