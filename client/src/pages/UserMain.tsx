import { Navigate, Route, Routes } from "react-router-dom";
import { AuthWrapper } from "@/features/auth";
import AuthFlow from "@/features/auth/components/AuthFlow";
import { AppLayout } from "@/components/layout";
import HomePage from "./home/HomePage";
import JournalPage from "./journal/JournalPage";
import JournalDetailPage from "./journal/JournalDetailPage";
import MemoriesPage from "./memories/MemoriesPage";
import ProfilePage from "./profile/ProfilePage";
import OnboardingPage from "./onboarding/OnboardingPage";
import { useAppSelector } from "@/app/hooks";

/**
 * OnboardingGuard — allows access to /onboarding only if hasOnboarded is
 * false. Returning users who navigate there manually are redirected to
 * /home.
 */
const OnboardingGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  if (user?.hasOnboarded) {
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
};

const UserMain = () => {
  return (
    <Routes>
      {/* Public Routes — redirect to /home if already logged in */}
      <Route
        path="/login"
        element={
          <AuthWrapper routeType="public" redirectPath="/home">
            <AuthFlow />
          </AuthWrapper>
        }
      />

      {/* Onboarding — private (must be logged in), but not inside AppLayout */}
      <Route
        path="/onboarding"
        element={
          <AuthWrapper routeType="private" redirectPath="/login">
            <OnboardingGuard>
              <OnboardingPage />
            </OnboardingGuard>
          </AuthWrapper>
        }
      />


      {/* Private Routes inside AppLayout */}
      <Route
        element={
          <AuthWrapper routeType="private" redirectPath="/login">
            <AppLayout />
          </AuthWrapper>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/journal/:entryId" element={<JournalDetailPage />} />
        <Route path="/memories" element={<MemoriesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default UserMain;
