import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { useGetCurrentUserQuery } from "../api/authApi";
import type { IAuthWrapperProps } from "../types/auth.types";
import { theme } from "@/theme/theme";

const AuthWrapper: React.FC<IAuthWrapperProps> = ({
  children,
  routeType,
  redirectPath,
}) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  const { isLoading: isFetching, isError } = useGetCurrentUserQuery(undefined, {
    skip: isAuthenticated && !!user,
  });

  if (isLoading || isFetching) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.surface.bg,
          color: theme.colors.text.primary,
        }}
        className="flex flex-col items-center justify-center min-h-screen gap-3"
      >
        <div
          style={{
            borderColor: theme.colors.primary.brand,
            borderTopColor: "transparent",
          }}
          className="w-8 h-8 border-4 rounded-full animate-spin"
        ></div>
        <p
          style={{ color: theme.colors.text.muted }}
          className="text-sm font-medium"
        >
          Loading...
        </p>
      </div>
    );
  }

  if (routeType === "public") {
    if (isAuthenticated && user) {
      if (!user.hasOnboarded) {
        return <Navigate to="/onboarding" state={{ from: location }} replace />;
      }
      return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  if (routeType === "private") {
    if (!isAuthenticated || isError) {
      return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    if (user && !user.hasOnboarded && location.pathname !== "/onboarding") {
      return <Navigate to="/onboarding" state={{ from: location }} replace />;
    }

    return <>{children}</>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
