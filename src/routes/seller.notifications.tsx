import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "./app.notifications";

export const Route = createFileRoute("/seller/notifications")({
  head: () => ({ meta: [{ title: "Notifications — ZUNO Seller" }] }),
  component: () => <NotificationsPage backTo="/seller" />,
});
