import { requireRole } from "@/lib/auth/dal";
import Sidebar from "@/components/admin/Sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole(["admin"]);

  return (
    <div className="admin-shell flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
