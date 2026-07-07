import React, { useState } from "react";
import { Avatar } from "@/components/ui";
import { theme } from "@/theme/theme";
import type { IContact, ICreateContactRequest } from "@/features/journal/types/contacts.types";
import { AddContactModal } from "@/features/journal/components";
import { Plus, ChevronRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ProfileRecipientsProps {
  contacts: IContact[];
  isLoading?: boolean;
  onAddContact: (data: ICreateContactRequest) => Promise<void>;
  isAdding?: boolean;
}

export const ProfileRecipients: React.FC<ProfileRecipientsProps> = ({
  contacts,
  isLoading = false,
  onAddContact,
  isAdding = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full space-y-2 sm:space-y-2.5">
        <h3
          style={{ color: "#8E8E93", fontFamily: theme.fonts.sans }}
          className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider pl-1"
        >
          RECIPIENTS
        </h3>
        <div
          style={{
            backgroundColor: "#FFFFF9",
            border: "0.8px solid #AAC8DB",
            borderRadius: "12px",
            boxShadow: "1px 1px 3px rgba(0,0,0,0.06)",
          }}
          className="w-full p-4 h-28 animate-pulse bg-gray-100"
        />
      </div>
    );
  }

  const displayedContacts = contacts.slice(0, 5);
  const hasMore = contacts.length > 5;

  return (
    <div className="w-full space-y-2 sm:space-y-2.5">
      <h3
        style={{ color: "#8E8E93", fontFamily: theme.fonts.sans }}
        className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider pl-1"
      >
        RECIPIENTS
      </h3>

      <div
        style={{
          backgroundColor: "#FFFFF9",
          border: "0.8px solid #AAC8DB",
          borderRadius: "12px",
          boxShadow: "1px 1px 3px rgba(0,0,0,0.06)",
        }}
        className="w-full overflow-hidden transition-all"
      >
        {/* Avatars row */}
        <div className="py-3 sm:py-3.5 px-3.5 sm:px-4 md:px-5 flex items-center justify-between min-h-[4rem] gap-2">
          {contacts.length === 0 ? (
            <div className="flex items-center gap-2 text-[#8E8E93] py-1 min-w-0 flex-1">
              <Users className="w-4 h-4 opacity-70 shrink-0" />
              <span className="text-xs sm:text-[13px] font-normal truncate">No recipients added yet</span>
            </div>
          ) : (
            <div className="flex items-center -space-x-2 sm:-space-x-2.5 overflow-hidden py-1 min-w-0 flex-1">
              {displayedContacts.map((c) => (
                <div
                  key={c.id || c._id}
                  className="relative rounded-full border-[2px] border-[#FFFFF9] shadow-2xs shrink-0 transition-transform hover:scale-110 hover:z-10"
                  title={`${c.name} (${c.email})`}
                >
                  <Avatar name={c.name} size="md" className="w-9 h-9 sm:w-10 sm:h-10 md:w-[42px] md:h-[42px] rounded-full text-xs font-bold" />
                </div>
              ))}
            </div>
          )}

          {hasMore && (
            <button
              type="button"
              onClick={() => navigate("/profile/sharing")}
              style={{ color: "#1E3A5F", fontFamily: theme.fonts.heading }}
              className="text-xs sm:text-[13px] font-semibold hover:underline cursor-pointer select-none ml-auto pl-2 shrink-0 whitespace-nowrap"
            >
              View All
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t-[0.8px] border-[#ECECEE] mx-3.5 sm:mx-4 md:mx-5" />

        {/* Add Recipient Row */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="py-3 px-3.5 sm:px-4 md:px-5 flex items-center justify-between cursor-pointer hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors select-none group gap-2"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F6D74D] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-[#1C1C1E] stroke-[2.5]" />
            </div>
            <span
              style={{ color: "#1C1C1E", fontFamily: theme.fonts.heading }}
              className="text-sm sm:text-[15px] font-semibold truncate"
            >
              Add Recipient
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-[#C7C7CC] shrink-0 ml-1" />
        </div>
      </div>

      <AddContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddContact={onAddContact}
        isLoading={isAdding}
      />
    </div>
  );
};
