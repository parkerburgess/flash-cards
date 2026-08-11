"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "@parkerburgess/wandering-parker-ui";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/manage", label: "Manage" },
  { href: "/study", label: "Study" },
  { href: "/test", label: "Test" },
  { href: "/report", label: "Report" },
];

interface NavBarProps {
  userName: string | null;
}

export default function NavBar({ userName }: NavBarProps) {
  const pathname = usePathname();

  // #region Tailwind utility consts
  const navCls = "bg-indigo-700 text-white shadow-md";
  const containerCls = "max-w-5xl mx-auto px-4 flex items-center gap-6 h-14";
  const brandCls = "font-bold text-lg tracking-tight mr-4";
  const navLinkBaseCls = "text-sm font-medium transition-colors hover:text-indigo-200";
  const navLinkActiveCls = `${navLinkBaseCls} underline text-white`;
  const navLinkInactiveCls = `${navLinkBaseCls} text-indigo-200`;
  const rightSectionCls = "ml-auto flex items-center gap-4";
  // #endregion

  return (
    <nav className={navCls}>
      <div className={containerCls}>
        <span className={brandCls}>Flash Cards</span>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? navLinkActiveCls : navLinkInactiveCls}
          >
            {link.label}
          </Link>
        ))}
        <div className={rightSectionCls}>
          {userName && <UserMenu userName={userName} />}
        </div>
      </div>
    </nav>
  );
}
