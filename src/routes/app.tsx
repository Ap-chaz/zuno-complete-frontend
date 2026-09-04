import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/zuno/AppShell";
import { BottomNav } from "@/components/zuno/BottomNav";
import { Sidebar } from "@/components/zuno/Sidebar";

export const Route = createFileRoute("/app")({
  component: () => (
    <AppShell sidebar={<Sidebar variant="buyer" />} bottomNav={<BottomNav variant="buyer" />}>
      <Outlet />
    </AppShell>
  ),
});
