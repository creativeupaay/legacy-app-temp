import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompleteOnboardingMutation } from "@/features/auth/api/authApi";
import { theme } from "@/theme/theme";

interface OnboardingSlide {
  title: string;
  body: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    title: "Welcome to your journal",
    body: "This is your private space to capture thoughts, memories, and the things that matter most — organised the way you think.",
  },
  {
    title: "What is a journal entry?",
    body: "A journal entry can be anything: a memory, a reflection, a letter to someone you love, or a note about today. There are no rules — just your words.",
  },
  {
    title: "Legacy contacts",
    body: "You can designate trusted people to receive parts of your journal when the time comes. They access only what you choose, through a secure one-time link — nothing more.",
  },
];

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [completeOnboarding, { isLoading }] = useCompleteOnboardingMutation();

  const isLast = step === SLIDES.length - 1;
  const progress = ((step + 1) / SLIDES.length) * 100;

  const handleNext = async () => {
    if (isLast) {
      try {
        await completeOnboarding().unwrap();
        navigate("/home", { replace: true });
      } catch {
        navigate("/home", { replace: true });
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  const slide = SLIDES[step];

  return (
    <div
      style={{ backgroundColor: theme.colors.surface.bg }}
      className="min-h-screen flex flex-col items-center justify-center px-6"
    >
      {/* Progress bar */}
      <div className="w-full max-w-xl mb-12">
        <div
          style={{ backgroundColor: theme.colors.stroke.border }}
          className="w-full h-1 rounded-full overflow-hidden"
        >
          <div
            className="h-full transition-all duration-300 ease-out"
            style={{
              backgroundColor: theme.colors.primary.brand,
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Slide content */}
      <div className="w-full max-w-xl flex-1 flex flex-col justify-center my-auto py-8">
        <span
          style={{ color: theme.colors.text.muted }}
          className="text-xs font-semibold uppercase tracking-widest mb-3"
        >
          {step + 1} of {SLIDES.length}
        </span>

        <h1
          style={{ color: theme.colors.text.primary }}
          className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
        >
          {slide.title}
        </h1>

        <p
          style={{ color: theme.colors.text.muted }}
          className="text-base md:text-lg leading-relaxed max-w-md"
        >
          {slide.body}
        </p>
      </div>

      {/* Navigation */}
      <div className="w-full max-w-xl pb-12">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{ color: theme.colors.text.muted }}
            className="hover:opacity-80 font-medium disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
            style={{
              backgroundColor: theme.colors.primary.brand,
              color: theme.colors.text.inverse,
            }}
            className="rounded-md px-8 py-3 font-semibold text-base hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center shadow-sm cursor-pointer"
          >
            {isLast ? (isLoading ? "Starting…" : "Get started") : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
