import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import EmailStep from "./EmailStep";
import OtpStep from "./OtpStep";

type Step = "email" | "otp";


const AuthFlow: React.FC = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, isNewUser } = useAppSelector((state) => state.auth);

  // After verifyOtp updates Redux, navigate based on isNewUser flag
  if (isAuthenticated) {
    if (isNewUser) {
      navigate("/onboarding", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
    return null;
  }

  const handleOtpSent = (sentEmail: string, token: string) => {
    setEmail(sentEmail);
    setOtpToken(token);
    setStep("otp");
  };

  const handleBack = () => {
    setStep("email");
  };

  if (step === "otp") {
    return (
      <OtpStep
        email={email}
        otpToken={otpToken}
        onTokenUpdate={setOtpToken}
        onBack={handleBack}
      />
    );
  }

  return <EmailStep onOtpSent={handleOtpSent} />;
};

export default AuthFlow;
