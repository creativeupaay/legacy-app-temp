import React, { useState, useEffect, useRef } from "react";
import { useVerifyOtpMutation, useRequestOtpMutation } from "../api/authApi";
import { otpSchema } from "../validators/auth.validator";
import { theme } from "@/theme/theme";
import { Button, IconButton } from "@/components/ui";
import { AlertCircle } from "lucide-react";

interface OtpStepProps {
  email: string;
  otpToken: string;
  onTokenUpdate: (newToken: string) => void;
  onBack: () => void;
}

const RESEND_COOLDOWN = 30; // seconds

const OtpStep: React.FC<OtpStepProps> = ({ email, otpToken, onTokenUpdate, onBack }) => {
  const [otp, setOtp] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [verifyOtp, { isLoading: isVerifying, error }] = useVerifyOtpMutation();
  const [requestOtp, { isLoading: isResending }] = useRequestOtpMutation();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  const getErrorMessage = () => {
    if (!error) return null;
    if ("data" in error) {
      const d = error.data as { message?: string };
      return d?.message || "Verification failed";
    }
    return "Unable to verify OTP. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!otpToken) {
      setValidationError("Session token is missing. Please request a new code.");
      return;
    }

    const parseResult = otpSchema.safeParse(otp);
    if (!parseResult.success) {
      setValidationError(parseResult.error.issues[0]?.message || "Invalid OTP format.");
      return;
    }

    try {
      await verifyOtp({ email, otp: parseResult.data, otpToken }).unwrap();
    } catch {
      // error shown via RTK Query error state
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    try {
      const res = await requestOtp({ email }).unwrap();
      const newToken = res.otpToken || res.data?.otpToken || "";
      if (newToken) {
        onTokenUpdate(newToken);
      }
      setOtp("");
      setValidationError(null);
      setCooldown(RESEND_COOLDOWN);
      clearInterval(timerRef.current!);
      timerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      // silent — resend errors are non-critical
    }
  };

  return (
    <div
      style={{ backgroundColor: theme.colors.surface.bg, fontFamily: theme.fonts.sans }}
      className="flex items-center justify-center min-h-screen p-4"
    >
      <div
        style={{
          backgroundColor: theme.colors.surface.default,
          borderColor: theme.colors.stroke.subtle,
        }}
        className="max-w-[400px] w-full rounded-[28px] border shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-8 transition-all relative"
      >
        <div className="mb-4">
          <IconButton variant="back" onClick={onBack} aria-label="Go back" />
        </div>

        <div className="text-center mb-8">
          <h1
            style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.heading }}
            className="text-2xl font-bold tracking-tight mb-2"
          >
            Check Your Email
          </h1>
          <p
            style={{ color: theme.colors.text.secondary }}
            className="text-sm leading-relaxed"
          >
            We sent a 6-digit verification code to
          </p>
          <div className="inline-flex items-center gap-1.5 mt-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            <span style={{ color: theme.colors.text.primary }} className="text-sm font-semibold">
              {email}
            </span>
            <button
              type="button"
              onClick={onBack}
              style={{ color: theme.colors.primary.buttonAction }}
              className="text-xs font-semibold hover:underline cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>

        {(error || validationError) && (
          <div
            style={{
              backgroundColor: theme.colors.error.bg,
              borderColor: theme.colors.error.border,
              color: theme.colors.error.text,
            }}
            className="mb-6 p-3.5 rounded-2xl border text-sm flex items-start gap-2.5 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: theme.colors.error.textDark }} />
            <span className="font-medium leading-snug">{validationError ?? getErrorMessage()}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="otp"
              style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.heading }}
              className="block text-[15px] font-semibold text-center"
            >
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(val);
                if (validationError) setValidationError(null);
              }}
              required
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              autoFocus
              style={{
                backgroundColor: theme.colors.surface.elevated,
                borderColor: theme.colors.stroke.border,
                color: theme.colors.text.primary,
                outlineColor: theme.colors.primary.buttonAction,
              }}
              className="w-full px-4 py-4 text-center text-3xl font-mono tracking-[0.35em] border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-transparent transition-all font-bold placeholder:text-gray-300 placeholder:font-normal"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            icon={!isVerifying}
            disabled={isVerifying || otp.length !== 6 || !otpToken}
            className="w-full h-13 rounded-2xl justify-center text-base shadow-sm hover:shadow transition-all"
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <span
                  style={{ borderColor: theme.colors.text.inverse, borderTopColor: "transparent" }}
                  className="inline-block w-5 h-5 border-2 rounded-full animate-spin"
                ></span>
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify Code"
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center items-center text-sm">
          <div style={{ color: theme.colors.text.secondary }}>
            {cooldown > 0 ? (
              <span className="font-medium">Resend code in <strong className="font-mono">{cooldown}s</strong></span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                style={{ color: theme.colors.primary.buttonAction }}
                className="hover:underline font-semibold disabled:opacity-50 cursor-pointer"
              >
                {isResending ? "Sending new code…" : "Resend verification code"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpStep;
