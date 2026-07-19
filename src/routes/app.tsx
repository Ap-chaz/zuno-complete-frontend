import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav } from "@/components/zuno/BottomNav";
import { PhoneFrame } from "@/components/zuno/PhoneFrame";

export const Route = createFileRoute("/app")({
  component: () => (
    <PhoneFrame>
      <Outlet />
      <BottomNav variant="buyer" />
    </PhoneFrame>
  ),
});
