"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SidebarData } from "./SidebarData";

function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="h-full w-72 shrink-0 flex flex-col bg-admin-navy px-3 py-4">
      <div className="px-3 py-4 mb-2">
        <Image src="/technova-logo.png" alt="Technova" width={40} height={40} />
      </div>

      <hr className="border-white/10 mb-4" />

      {SidebarData.map((group, i) => (
        <div key={i} className="mb-4">
          <p className="text-xs tracking-widest px-3 py-2 text-admin-muted">
            {group.groupTitle}
          </p>
          <ul className="flex flex-col gap-1">
            {group.items.map((val) => (
              <li key={val.link}>
                <Link
                  href={val.link}
                  aria-current={pathname === val.link ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    pathname === val.link
                      ? "bg-white/10 text-white"
                      : "text-admin-muted hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{val.icon}</span>
                  <span className="text-sm">{val.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
