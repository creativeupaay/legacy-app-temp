import React from "react";
import { Avatar, Button, Chip } from "@/components/ui";
import { theme } from "@/theme/theme";
import type { IProfile } from "../types/profile.types";
import { Edit2 } from "lucide-react";

export interface ProfileCardProps {
  profile?: IProfile | null;
  isLoading?: boolean;
  onEditClick: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isLoading = false,
  onEditClick,
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface.elevated,
    border: `0.8px solid ${theme.colors.stroke.yellow}`,
    borderRadius: "38px 16px 26px 26px",
    boxShadow: theme.shadows?.profileCard || "1px 1px 3px rgba(0,0,0,0.06)",
  };

  if (isLoading) {
    return (
      <div
        style={cardStyle}
        className="flex items-center w-full max-w-[480px] min-h-[118px] relative mx-auto box-border animate-pulse"
      >
        <div className="w-[92px] sm:w-[100px] h-[118px] shrink-0 bg-gray-200" style={{ borderRadius: "38px 38px 26px 26px" }} />
        <div className="flex flex-col justify-center items-start gap-2 min-w-0 flex-1 pl-4 pr-4 py-4">
          <div className="h-5 w-32 rounded-full bg-gray-200" />
          <div className="h-6 w-48 rounded bg-gray-200" />
          <div className="h-4 w-36 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  const email = profile?.email || "User";
  const fullName = profile?.fullName || email.split("@")[0] || "User";
  const avatar = profile?.avatar || undefined;

  let memberSince = " ";
  if (profile?.createdAt) {
    const d = new Date(profile.createdAt);
    if (!isNaN(d.getTime())) {
      const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
      memberSince = `MEMBER SINCE ${month} ${d.getFullYear()}`;
    }
  }

  return (
    <div
      style={cardStyle}
      className="flex items-center w-full max-w-[480px] min-h-[118px] relative mx-auto box-border"
    >
      {/* LEFT COLUMN: Photo arch flush covering left side of container */}
      <div className="relative w-[92px] sm:w-[100px] h-[118px] shrink-0">
        <Avatar
          src={avatar}
          name={fullName}
          size="lg"
          className="!w-full !h-full !object-cover"
          style={{ borderRadius: "38px 38px 26px 26px" }}
        />

        {/* Edit Profile Button positioned across bottom of arch */}
        <div className="absolute -bottom-2.5 left-2 z-10">
          <Button variant="edit" onClick={onEditClick} aria-label="Edit Profile">
            <Edit2
              className="w-[13px] h-[12px] shrink-0"
              style={{ strokeWidth: 1.58, color: theme.colors.text.secondary }}
            />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col justify-center items-start gap-1 min-w-0 flex-1 pl-4 pr-4 py-4">
        {memberSince.trim() ? <Chip label={memberSince} variant="compact" /> : null}

        <h2
          style={{
            color: theme.colors.text.primary,
            fontFamily: theme.fonts.nunito,
            letterSpacing: "-0.4px",
            lineHeight: "100%",
          }}
          className="text-[clamp(18px,5vw,22px)] font-semibold m-0 truncate w-full max-w-full opacity-100"
        >
          {fullName}
        </h2>

        <p
          style={{
            color: theme.colors.text.secondary || "#6B6B6F",
            fontFamily: theme.fonts.sans,
            letterSpacing: "-0.14px",
            lineHeight: "100%",
          }}
          className="text-[clamp(10.5px,3vw,12px)] font-normal m-0 truncate w-full max-w-full opacity-100"
        >
          {email}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
