import { createFileRoute } from "@tanstack/react-router";
import { Help } from "./help";

export const Route = createFileRoute("/seller/help")({
  head: () => ({ meta: [{ title: "Help & Support — ZUNO Seller" }] }),
  component: () => <Help backTo="/seller/account" reportTo="/seller/disputes" embedded />,
});
