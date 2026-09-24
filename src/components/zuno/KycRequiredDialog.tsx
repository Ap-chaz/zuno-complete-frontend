import { useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { setKycIntent } from "@/lib/zuno-kyc";

/**
 * Controlled "verify your identity" dialog for gating a single action
 * (e.g. marking an order shipped) without blocking the whole page the way
 * <KycGate> does.
 */
export function KycRequiredDialog({
  open,
  onOpenChange,
  title = "Verify your identity first",
  description = "Identity verification (KYC) is required before you can do this on ZUNO. It only takes a few minutes and you only do it once.",
  cancelLabel = "Not now",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  cancelLabel?: string;
}) {
  const navigate = useNavigate();

  const handleVerify = () => {
    const intent = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/seller";
    setKycIntent(intent);
    navigate({ to: "/auth/kyc", search: { redirect: intent } as never });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold sm:mx-0">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleVerify}
            className="bg-gradient-gold text-gold-foreground shadow-gold hover:opacity-90"
          >
            Verify now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
