import React, { useState } from "react";
import { useRequestOtpMutation } from "../api/authApi";
import { emailSchema } from "../validators/auth.validator";
import { theme } from "@/theme/theme";
import { Button } from "@/components/ui";
import { AlertCircle } from "lucide-react";

interface EmailStepProps {
  onOtpSent: (email: string, otpToken: string) => void;
}

const EmailStep: React.FC<EmailStepProps> = ({ onOtpSent }) => {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [requestOtp, { isLoading, error }] = useRequestOtpMutation();

  const getErrorMessage = () => {
    if (!error) return null;
    if ("data" in error) {
      const d = error.data as { message?: string };
      return d?.message || "Something went wrong";
    }
    return "Unable to send OTP. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const parseResult = emailSchema.safeParse(email);
    if (!parseResult.success) {
      setValidationError(parseResult.error.issues[0]?.message || "Please enter a valid email address.");
      return;
    }

    try {
      const normalizedEmail = parseResult.data;
      const res = await requestOtp({ email: normalizedEmail }).unwrap();
      const token = res.otpToken || res.data?.otpToken || "";
      onOtpSent(normalizedEmail, token);
    } catch {
      // error shown via RTK Query error state
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
        className="max-w-[400px] w-full rounded-[28px] border shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-8 transition-all"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <h1
            style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.heading }}
            className="text-2xl font-bold tracking-tight mb-1.5"
          >
            Welcome
          </h1>
          <p
            style={{ color: theme.colors.text.secondary }}
            className="text-sm max-w-[260px] leading-relaxed"
          >
            Enter your email to receive a one-time verification code
          </p>
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
              htmlFor="email"
              style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.heading }}
              className="block text-[15px] font-semibold"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationError) setValidationError(null);
              }}
              required
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              style={{
                backgroundColor: theme.colors.surface.elevated,
                borderColor: theme.colors.stroke.border,
                color: theme.colors.text.primary,
                outlineColor: theme.colors.primary.buttonAction,
              }}
              className="w-full px-4 py-3.5 text-[15px] border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-transparent transition-all placeholder:text-gray-400 font-medium"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            icon={!isLoading}
            disabled={isLoading}
            className="w-full h-13 rounded-2xl justify-center text-base shadow-sm hover:shadow transition-all"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span
                  style={{ borderColor: theme.colors.text.inverse, borderTopColor: "transparent" }}
                  className="inline-block w-5 h-5 border-2 rounded-full animate-spin"
                ></span>
                <span>Sending Code...</span>
              </div>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EmailStep;
