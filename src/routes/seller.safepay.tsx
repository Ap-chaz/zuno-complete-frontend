import { createFileRoute } from "@tanstack/react-router";
import { SafePayPage } from "./app.safepay";

export const Route = createFileRoute("/seller/safepay")({
  head: () => ({ meta: [{ title: "SafePay Protection — ZUNO Seller" }] }),
  component: () => <SafePayPage backTo="/seller/account" startHref="/seller/protected-deal" />,
});
