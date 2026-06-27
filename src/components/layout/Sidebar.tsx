"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Role } from "@/types/user";
import { ROLE_LABEL } from "@/lib/constants/roles";

interface NavItem {
  label: string;
  href: string;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/admin", roles: [Role.ADMIN] },
  { label: "Sales", href: "/sales", roles: [Role.ADMIN, Role.SALES] },
  { label: "Sanction", href: "/sanction", roles: [Role.ADMIN, Role.SANCTION] },
  { label: "Disbursement", href: "/disbursement", roles: [Role.ADMIN, Role.DISBURSEMENT] },
  { label: "Collection", href: "/collection", roles: [Role.ADMIN, Role.COLLECTION] },
];

interface SidebarProps {
  role: Role;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

/**
 * Renders twice on purpose: a static column for md+ screens, and a
 * slide-over drawer (with backdrop) for everything below md. Both share
 * the same nav content so links/active-state logic is never duplicated.
 */
export function Sidebar({ role, isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  const navContent = (
    <>
      <div className="mb-8 px-2">
        <p className="font-display text-heading text-paper">Ledger LMS</p>
        <p className="text-caption text-slate-300">{ROLE_LABEL[role]} module</p>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={clsx(
                "rounded-md px-3 py-2 font-body text-body transition-colors",
                isActive ? "bg-brass-500 text-ink-950" : "text-slate-300 hover:bg-ink-900 hover:text-paper"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop: permanent column */}
      <aside className="hidden w-60 shrink-0 flex-col bg-ink-950 px-4 py-6 md:flex">{navContent}</aside>

      {/* Mobile: backdrop + slide-over drawer, toggled by the Navbar's menu button */}
      <div
        className={clsx(
          "fixed inset-0 z-40 md:hidden",
          isMobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!isMobileOpen}
      >
        <div
          className={clsx(
            "absolute inset-0 bg-ink-950/60 transition-opacity duration-200",
            isMobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onCloseMobile}
        />
        <aside
          className={clsx(
            "absolute inset-y-0 left-0 flex w-64 max-w-[80vw] flex-col bg-ink-950 px-4 py-6 shadow-raised transition-transform duration-200",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {navContent}
        </aside>
      </div>
    </>
  );
}