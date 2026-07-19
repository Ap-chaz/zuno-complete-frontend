import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "./app.settings";

export const Route = createFileRoute("/seller/settings")({
  head: () => ({ meta: [{ title: "Settings — ZUNO Seller" }] }),
  component: () => <SettingsPage backTo="/seller/account" />,
});
