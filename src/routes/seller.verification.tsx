import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, Clock, Landmark, ShieldOff, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/zuno/TopBar";
import { DocUpload, type DocUploadState } from "@/components/zuno/DocUpload";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { SELLER_CATEGORIES } from "@/services/sellers.service";
import {
  getSellerVerificationTier,
  submitBusinessVerification,
} from "@/lib/seller-business-verification";

export const Route = createFileRoute("/seller/verification")({
  head: () => ({ meta: [{ title: "Business Verification — ZUNO Seller" }] }),
  component: SellerVerification,
});

const OTP_LENGTH = 6;

function SellerVerification() {
  const [tier, setTier] = useState(getSellerVerificationTier());

  // Business details
  const [category, setCategory] = useState(SELLER_CATEGORIES[1] ?? "");
  const [businessRegNumber, setBusinessRegNumber] = useState("");
  const [kraPin, setKraPin] = useState("");
  const [location, setLocation] = useState("");

  // Business phone + OTP
  const [businessPhone, setBusinessPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Payout details
  const [payoutMethod, setPayoutMethod] = useState<"mpesa" | "bank">("mpesa");
  const [payoutDetails, setPayoutDetails] = useState("");
  const [payoutBankName, setPayoutBankName] = useState("");

  // Document
  const [doc, setDoc] = useState<DocUploadState>(null);

  const validPhone = /^\+?[0-9\s-]{7,}$/.test(businessPhone);

  const handleSendOtp = () => {
    if (!validPhone) {
      setOtpError("Enter a valid phone number first");
      return;
    }
    setOtpError(null);
    setOtpSent(true);
    toast.success(`Code sent to ${businessPhone}`);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length !== OTP_LENGTH) {
      setOtpError(`Enter the full ${OTP_LENGTH}-digit code`);
      return;
    }
    // Mock verification — any complete code succeeds here. Replace with a
    // real OTP-check endpoint once the backend exists.
    setOtpError(null);
    setPhoneVerified(true);
    toast.success("Phone number verified.");
  };

  const canSubmit =
    Boolean(category) &&
    businessRegNumber.trim().length > 0 &&
    kraPin.trim().length > 0 &&
    location.trim().length > 0 &&
    phoneVerified &&
    payoutDetails.trim().length > 0 &&
    (payoutMethod === "mpesa" || payoutBankName.trim().length > 0) &&
    Boolean(doc?.done);

  function handleSubmit() {
    if (!canSubmit || !doc) return;
    submitBusinessVerification({
      category,
      businessRegNumber: businessRegNumber.trim(),
      kraPin: kraPin.trim().toUpperCase(),
      location: location.trim(),
      businessPhone: businessPhone.trim(),
      payoutMethod,
      payoutDetails: payoutDetails.trim(),
      payoutBankName: payoutMethod === "bank" ? payoutBankName.trim() : undefined,
      documentName: doc.name,
      submittedAt: new Date().toISOString(),
    });
    setTier("pending");
    toast.success("Submitted for review — we'll notify you within 24 hours.");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <TopBar title="Business Verification" back="/seller/account" />

      <div className="px-5 pt-4 pb-8">
        {tier === "verified" && (
          <div className="rounded-3xl border border-border/40 bg-gradient-card p-5 text-center shadow-card">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-success/15">
              <BadgeCheck className="h-10 w-10 text-success" />
            </div>
            <h1 className="mt-4 text-xl font-bold">Business verified</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your business is displayed to buyers with a verified badge.
            </p>
          </div>
        )}

        {tier === "pending" && (
          <div className="rounded-3xl border border-gold/30 bg-gold/5 p-5 text-center shadow-card">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gold/15">
              <Clock className="h-10 w-10 text-gold" />
            </div>
            <h1 className="mt-4 text-xl font-bold">Submitted — in review</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              We're checking your details. This usually takes under 24 hours. Your business
              won't appear in buyer listings until this is approved.
            </p>
          </div>
        )}

        {tier === "unverified" && (
          <>
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-5 text-center shadow-card">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-destructive/15">
                <ShieldOff className="h-10 w-10 text-destructive" />
              </div>
              <h1 className="mt-4 text-xl font-bold">Not yet displayed to buyers</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete the details below to get verified and start receiving protected payments
                through ZUNO.
              </p>
            </div>

            {/* Business details */}
            <p className="mt-6 px-1 text-xs font-bold tracking-[0.18em] text-muted-foreground">
              BUSINESS DETAILS
            </p>
            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-border/60 bg-input px-4 text-sm outline-none focus:border-gold/50"
                >
                  {SELLER_CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <TextField
                label="Business registration / ID number"
                value={businessRegNumber}
                onChange={setBusinessRegNumber}
                placeholder="e.g. PVT-ABCD1234 or National ID"
              />

              <TextField
                label="KRA PIN"
                value={kraPin}
                onChange={(v) => setKraPin(v.toUpperCase())}
                placeholder="e.g. A012345678B"
              />

              <TextField
                label="Location"
                value={location}
                onChange={setLocation}
                placeholder="e.g. Westlands, Nairobi"
              />
            </div>

            {/* Business phone + OTP */}
            <p className="mt-6 px-1 text-xs font-bold tracking-[0.18em] text-muted-foreground">
              BUSINESS PHONE
            </p>
            <div className="mt-3 space-y-3">
              <div className="flex gap-2">
                <label className="flex h-12 flex-1 items-center gap-2 rounded-2xl border border-border/60 bg-input px-4">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={businessPhone}
                    disabled={phoneVerified}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    placeholder="e.g. +254 7XX XXX XXX"
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60"
                  />
                </label>
                {!phoneVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="shrink-0 rounded-2xl border border-gold/40 bg-gold/10 px-4 text-xs font-semibold text-gold"
                  >
                    {otpSent ? "Resend" : "Send code"}
                  </button>
                )}
              </div>

              {phoneVerified && (
                <p className="flex items-center gap-1.5 text-xs font-semibold text-success">
                  <BadgeCheck className="h-4 w-4" /> Phone verified
                </p>
              )}

              {otpSent && !phoneVerified && (
                <div className="rounded-2xl border border-border/40 bg-surface p-4">
                  <p className="mb-3 text-xs text-muted-foreground">Enter the 6-digit code sent to your phone</p>
                  <InputOTP maxLength={OTP_LENGTH} value={otpCode} onChange={setOtpCode}>
                    <InputOTPGroup>
                      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="mt-3 flex h-10 w-full items-center justify-center rounded-xl bg-gradient-gold text-xs font-semibold text-gold-foreground"
                  >
                    Verify code
                  </button>
                </div>
              )}
              {otpError && <p className="px-1 text-[11px] text-destructive">{otpError}</p>}
            </div>

            {/* Payout details */}
            <p className="mt-6 px-1 text-xs font-bold tracking-[0.18em] text-muted-foreground">
              PAYOUT DETAILS
            </p>
            <div className="mt-3 space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPayoutMethod("mpesa")}
                  className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl border text-xs font-semibold ${
                    payoutMethod === "mpesa"
                      ? "border-gold bg-gold text-gold-foreground"
                      : "border-border bg-surface text-muted-foreground"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" /> M-Pesa
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMethod("bank")}
                  className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl border text-xs font-semibold ${
                    payoutMethod === "bank"
                      ? "border-gold bg-gold text-gold-foreground"
                      : "border-border bg-surface text-muted-foreground"
                  }`}
                >
                  <Landmark className="h-3.5 w-3.5" /> Bank
                </button>
              </div>

              {payoutMethod === "mpesa" ? (
                <TextField
                  label="Till or Paybill number"
                  value={payoutDetails}
                  onChange={setPayoutDetails}
                  placeholder="e.g. 400200"
                />
              ) : (
                <>
                  <TextField
                    label="Bank name"
                    value={payoutBankName}
                    onChange={setPayoutBankName}
                    placeholder="e.g. Equity Bank"
                  />
                  <TextField
                    label="Account number"
                    value={payoutDetails}
                    onChange={setPayoutDetails}
                    placeholder="e.g. 0123456789"
                  />
                </>
              )}
            </div>

            {/* Document upload */}
            <p className="mt-6 px-1 text-xs font-bold tracking-[0.18em] text-muted-foreground">
              VERIFICATION DOCUMENT
            </p>
            <div className="mt-3">
              <DocUpload
                label="ID or business permit"
                state={doc}
                setState={setDoc}
                hint="JPG, PNG or PDF, up to 10MB"
              />
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-gold text-sm font-semibold text-gold-foreground shadow-gold disabled:opacity-40"
            >
              Submit for review
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-border/60 bg-input px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-gold/50"
      />
    </label>
  );
}
