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

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden w-60 flex-col bg-ink-950 px-4 py-6 md:flex">
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
    </aside>
  );
}
