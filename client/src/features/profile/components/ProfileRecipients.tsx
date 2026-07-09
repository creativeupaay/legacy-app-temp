import React from "react";
import { Avatar, PlusIcon } from "@/components/ui";
import { theme } from "@/theme/theme";
import type { IContact, ICreateContactRequest } from "@/features/journal/types/contacts.types";
import { ChevronRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ProfileRecipientsProps {
  contacts: IContact[];
  isLoading?: boolean;
  onAddContact?: (data: ICreateContactRequest) => Promise<void>;
  isAdding?: boolean;
}

const CONTACT_PASTELS = [
  { bg: "#CDE5F1", text: "#1C274C" },
  { bg: "#DCEFD8", text: "#1F3B1F" },
  { bg: "#F2E4D8", text: "#3B2A1E" },
  { bg: "#EAE3F2", text: "#2E1E3B" },
];

export const ProfileRecipients: React.FC<ProfileRecipientsProps> = ({
  contacts,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: theme.fonts.sans,
    fontWeight: 500,
    fontSize: "11px",
    lineHeight: "16.5px",
    letterSpacing: "0.7px",
    color: theme.colors.text.sectionTitle || "#928C88",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface.elevated || "#FFFFF9",
    border: `0.8px solid ${theme.colors.stroke.border || "#E1E1DF"}`,
    borderRadius: "12px",
    boxShadow: "1px 1px 3px 0px rgba(0, 0, 0, 0.06)",
    padding: "clamp(12px, 3.5vw, 16px)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
    boxSizing: "border-box",
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[480px] mx-auto flex flex-col gap-2 box-border">
        <h3 style={sectionTitleStyle} className="uppercase pl-1 m-0">
          RECIPIENTS
        </h3>
        <div
          style={{
            backgroundColor: theme.colors.surface.elevated || "#FFFFF9",
            border: `0.8px solid ${theme.colors.stroke.border || "#E1E1DF"}`,
            borderRadius: "12px",
            minHeight: "136px",
            width: "100%",
          }}
          className="animate-pulse"
        />
      </div>
    );
  }

  const displayedContacts = contacts.slice(0, 5);

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col gap-2 box-border">
      <h3 style={sectionTitleStyle} className="uppercase pl-1 m-0">
        RECIPIENTS
      </h3>

      <div style={cardStyle}>
        {/* Avatars Top Row */}
        <div className="flex items-center justify-between min-h-[44px] gap-2 w-full">
          {contacts.length === 0 ? (
            <div className="flex items-center gap-2 text-[#8E8E93] py-1 min-w-0 flex-1">
              <Users className="w-4 h-4 opacity-70 shrink-0" />
              <span className="text-xs sm:text-[13px] font-normal truncate">No recipients added yet</span>
            </div>
          ) : (
            <div className="flex items-center -space-x-2 sm:-space-x-2.5 overflow-hidden py-0.5 min-w-0 flex-1">
              {displayedContacts.map((c, idx) => {
                const pastel = CONTACT_PASTELS[idx % CONTACT_PASTELS.length];
                return (
                  <div
                    key={c.id || c._id}
                    className="relative w-8 h-11 md:w-[32px] md:h-[44px] rounded-full border-[2px] border-[#FFFFF9] shrink-0 overflow-hidden"
                    title={`${c.name} (${c.email})`}
                  >
                    <Avatar
                      src={c.avatar || undefined}
                      name={c.name}
                      size="md"
                      style={{
                        backgroundColor: pastel.bg,
                        color: pastel.text,
                        border: "none",
                        fontFamily: theme.fonts.sans,
                        fontWeight: 500,
                      }}
                      className="w-full h-full rounded-full text-xs !border-0 font-medium"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {contacts.length > 0 && (
            <button
              type="button"
              onClick={() => navigate("/profile/sharing")}
              style={{
                color: theme.colors.primary.action || "#1C274C",
                fontFamily: theme.fonts.sans,
                fontWeight: 500,
                fontSize: "clamp(12px, 3vw, 13px)",
                lineHeight: "19.5px",
                letterSpacing: "-0.13px",
              }}
              className="hover:underline cursor-pointer select-none ml-auto pl-2 shrink-0 whitespace-nowrap"
            >
              View All
            </button>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            height: "0.8px",
            backgroundColor: "#E1E1DF",
            width: "100%",
          }}
          className="shrink-0"
        />

        {/* Add Recipient Row */}
        <div
          onClick={() => navigate("/profile/add-recipient")}
          className="flex items-center justify-between min-h-[36px] cursor-pointer gap-2 w-full select-none"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              style={{ backgroundColor: theme.colors.primary.motivation || "#F6D74D" }}
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            >
              <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#010102] stroke-[2.5]" />
            </div>
            <span
              style={{
                color: theme.colors.text.primary || "#010102",
                fontFamily: theme.fonts.sans,
                fontWeight: 500,
                fontSize: "clamp(14px, 3.5vw, 15px)",
                lineHeight: "22.5px",
                letterSpacing: "-0.15px",
              }}
              className="truncate"
            >
              Add Recipient
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-[#8E8E93] shrink-0 ml-auto" />
        </div>
      </div>
    </div>
  );
};

export default ProfileRecipients;
