"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { SidebarData } from "./SidebarData";

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="h-full w-72 shrink-0 flex flex-col px-3 py-4" style={{ backgroundColor: "#1f3a5f" }}>
      <div className="px-3 py-4 mb-2">
        <Image src="/technova-logo.png" alt="Technova" width={40} height={40} />
      </div>

      <hr className="border-white/10 mb-4" />

      {SidebarData.map((group, i) => (
        <div key={i} className="mb-4">
          <p className="text-xs tracking-widest px-3 py-2" style={{ color: "#9fabc0" }}>
            {group.groupTitle}
          </p>
          <ul className="flex flex-col gap-1">
            {group.items.map((val, key) => (
              <li
                key={key}
                onClick={() => router.push(val.link)}
                style={pathname !== val.link ? { color: "#9fabc0" } : {}}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  pathname === val.link
                    ? "bg-white/10 text-white"
                    : "hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="text-lg">{val.icon}</div>
                <div className="text-sm">{val.title}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
