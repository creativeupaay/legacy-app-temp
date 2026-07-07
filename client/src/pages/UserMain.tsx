import { Navigate, Route, Routes } from "react-router-dom";
import { AuthWrapper } from "@/features/auth";
import AuthFlow from "@/features/auth/components/AuthFlow";
import { AppLayout } from "@/components/layout";
import HomePage from "./home/HomePage";
import JournalPage from "./journal/JournalPage";
import JournalWritePage from "./journal/JournalWritePage";
import PrivacySelectionPage from "./journal/PrivacySelectionPage";
import MemoriesPage from "./memories/MemoriesPage";
import ProfilePage from "./profile/ProfilePage";
import SettingsPage from "./profile/SettingsPage";
import SharingPage from "./profile/SharingPage";
import OnboardingPage from "./onboarding/OnboardingPage";
import { useAppSelector } from "@/app/hooks";


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

      {/* Full-screen Private Routes (without Bottom Nav Bar per Figma Images 2, 3, 4) */}
      <Route
        path="/journal/write"
        element={
          <AuthWrapper routeType="private" redirectPath="/login">
            <JournalWritePage />
          </AuthWrapper>
        }
      />
      <Route
        path="/journal/privacy"
        element={
          <AuthWrapper routeType="private" redirectPath="/login">
            <PrivacySelectionPage />
          </AuthWrapper>
        }
      />
      <Route
        path="/journal/:entryId"
        element={
          <AuthWrapper routeType="private" redirectPath="/login">
            <JournalWritePage />
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
        <Route path="/memories" element={<MemoriesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/settings" element={<SettingsPage />} />
        <Route path="/profile/sharing" element={<SharingPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default UserMain;

