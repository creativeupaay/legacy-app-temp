import React from "react";
import { Avatar } from "@/components/ui";
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
  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: "#FFFFF9",
          border: "0.8px solid #AAC8DB",
          borderRadius: "39px 14px 14px 50px",
          boxShadow: "1px 1px 3px rgba(0,0,0,0.06)",
        }}
        className="w-full flex items-stretch animate-pulse relative min-h-[7rem]"
      >
        <div className="relative shrink-0 w-[32%] min-w-[5.5rem] max-w-[7.5rem] flex flex-col self-stretch">
          <div className="relative w-full flex-1 min-h-[6.5rem]">
            <div
              style={{
                borderTopLeftRadius: "38px",
                borderBottomLeftRadius: "49px",
                borderTopRightRadius: "42px",
                borderBottomRightRadius: "42px",
              }}
              className="w-full h-full absolute inset-0 bg-gray-200"
            />
            <div className="absolute bottom-0 left-0 w-full flex justify-start pl-1 sm:pl-2 translate-y-1/2 z-10">
              <div className="w-20 sm:w-24 h-6 sm:h-7 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
        <div className="space-y-2 flex-1 min-w-0 py-4 sm:py-5 px-3 sm:px-5 md:px-6 flex flex-col justify-center">
          <div className="h-4 sm:h-5 w-28 sm:w-36 bg-gray-200 rounded-full" />
          <div className="h-6 sm:h-7 w-36 sm:w-48 bg-gray-200 rounded" />
          <div className="h-3.5 sm:h-4 w-32 sm:w-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const email = profile?.email || "User";
  const fullName = profile?.fullName || email.split("@")[0] || "User";
  const avatar = profile?.avatar || undefined;

  let memberSince = "MEMBER SINCE RECENTLY";
  if (profile?.createdAt) {
    const d = new Date(profile.createdAt);
    if (!isNaN(d.getTime())) {
      const month = d.toLocaleString("default", { month: "short" }).toUpperCase();
      memberSince = `MEMBER SINCE ${month} ${d.getFullYear()}`;
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#FFFFF9",
        border: "0.8px solid #AAC8DB",
        borderRadius: "39px 14px 14px 50px",
        boxShadow: "1px 1px 3px rgba(0,0,0,0.06)",
      }}
      className="w-full flex items-stretch transition-all relative min-h-[7rem]"
    >
      <div className="relative shrink-0 w-[32%] min-w-[5.5rem] max-w-[7.5rem] flex flex-col self-stretch">
        <div className="relative w-full flex-1 min-h-[6.5rem]">
          <div
            style={{
              borderTopLeftRadius: "38px",
              borderBottomLeftRadius: "49px",
              borderTopRightRadius: "42px",
              borderBottomRightRadius: "42px",
            }}
            className="w-full h-full absolute inset-0 overflow-hidden shrink-0"
          >
            <Avatar
              src={avatar}
              name={fullName}
              size="lg"
              className="w-full h-full object-cover font-bold text-2xl sm:text-3xl !rounded-none"
            />
          </div>

          <div className="absolute bottom-0 left-0 w-full flex justify-start pl-1 sm:pl-2 translate-y-1/2 z-10">
            <button
              type="button"
              onClick={onEditClick}
              style={{
                backgroundColor: "#DBDBE0",
                color: "#48484A",
                boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
              }}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 border border-white/50 cursor-pointer select-none hover:bg-[#D0D0D6] transition-colors max-w-[95%] shadow-xs whitespace-nowrap"
            >
              <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#48484A] stroke-[2.2] shrink-0" />
              <span className="truncate">Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center py-4 sm:py-5 px-3 sm:px-5 md:px-6">
        <div className="bg-[#EAEAEB] text-[#7C7C80] text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2.5 sm:px-3 py-1 rounded-full w-fit mb-1.5 sm:mb-2 select-none truncate max-w-full">
          {memberSince}
        </div>
        <h2
          style={{ color: "#1C1C1E", fontFamily: theme.fonts.heading }}
          className="text-xl sm:text-2xl md:text-[25px] font-bold truncate leading-tight tracking-tight mb-1"
        >
          {fullName}
        </h2>
        <p
          style={{ color: "#7C7C80", fontFamily: theme.fonts.sans }}
          className="text-xs sm:text-sm md:text-[14px] truncate font-normal"
        >
          {email}
        </p>
      </div>
    </div>
  );
};
