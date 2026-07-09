import React from "react";
import { Card, Avatar } from "@/components/ui";
import { Check } from "lucide-react";
import { theme } from "@/theme/theme";
import type { IContact, ICreateContactRequest } from "../types/contacts.types";

export interface ShareOptionCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode; 
}

export const ShareOptionCard: React.FC<ShareOptionCardProps> = ({
  title,
  description,
  isSelected,
  onClick,
  className = "",
}) => {
  return (
    <Card
      variant="default"
      onClick={onClick}
      style={{
        backgroundColor: isSelected ? "#E8F2FA" : "#F2F2F7",
        borderColor: isSelected ? "#2B7FCE" : "transparent",
      }}
      className={`w-full p-4 rounded-[14px] border transition-all cursor-pointer select-none ${className}`}
    >
      <div className="flex flex-col">
        <span
          style={{
            fontFamily: theme.fonts.heading,
            color: isSelected ? "#1C68B3" : theme.colors.text.primary,
          }}
          className="font-semibold text-[16px] leading-tight"
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: theme.fonts.sans,
            color: isSelected ? "#6E6E73" : theme.colors.text.secondary,
          }}
          className="text-[13px] leading-normal mt-1"
        >
          {description}
        </span>
      </div>
    </Card>
  );
};

const CONTACT_PASTELS = [
  { bg: "#CDE5F1", text: "#1C274C" },
  { bg: "#DCEFD8", text: "#1F3B1F" },
  { bg: "#F2E4D8", text: "#3B2A1E" },
  { bg: "#EAE3F2", text: "#2E1E3B" },
];

export interface ContactItemProps {
  contact: IContact;
  isSelected: boolean;
  onToggle: (id: string) => void;
  hideRelationship?: boolean;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  isSelected,
  onToggle,
  hideRelationship,
}) => {
  const contactId = contact.id || contact._id || "";
  const charCode = (contact.name || "A").charCodeAt(0);
  const pastel = CONTACT_PASTELS[charCode % CONTACT_PASTELS.length];
  const avatarSrc = contact.avatar || (contact as any).profileImage || (contact as any).avatarUrl || undefined;

  return (
    <div
      onClick={() => onToggle(contactId)}
      className="flex items-center justify-between py-2.5 px-1 cursor-pointer transition-opacity hover:opacity-80 active:scale-[0.99] select-none"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
        <div className="relative w-8 h-11 rounded-full border border-gray-100 shrink-0 overflow-hidden shadow-2xs">
          <Avatar
            src={avatarSrc}
            name={contact.name}
            size="md"
            style={{
              backgroundColor: pastel.bg,
              color: pastel.text,
              fontFamily: theme.fonts.sans,
              fontWeight: 600,
            }}
            className="w-full h-full rounded-full text-xs !border-0 font-medium"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span
              style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
              className="font-semibold text-[15px] leading-tight truncate"
            >
              {contact.name}
            </span>
            {!hideRelationship && contact.relationship && (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[9px] font-bold uppercase tracking-wider shrink-0">
                {contact.relationship}
              </span>
            )}
          </div>
          <span
            style={{ fontFamily: theme.fonts.sans, color: theme.colors.text.tertiary }}
            className="text-[12.5px] leading-normal truncate mt-0.5"
          >
            {contact.email}
          </span>
        </div>
      </div>

      <div
        style={{
          borderColor: isSelected ? theme.colors.primary.action : "#D1D5DB",
          backgroundColor: isSelected ? theme.colors.primary.action : "transparent",
        }}
        className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all"
      >
        {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
      </div>
    </div>
  );
};

 
export interface ContactSelectionListProps {
  contacts: IContact[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onCreateContact?: (data: ICreateContactRequest) => Promise<void>;
  isLoading?: boolean;
  hideRelationship?: boolean;
}

export const ContactSelectionList: React.FC<ContactSelectionListProps> = ({
  contacts,
  selectedIds,
  onToggle,
  isLoading = false,
  hideRelationship = false,
}) => {
  if (isLoading) {
    return (
      <div className="py-4 text-center text-gray-400 text-[13px] animate-pulse">
        Loading contacts...
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="py-4 px-2 text-center text-gray-500 text-[13px]">
        No contacts found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full mt-2 pl-1 animate-in fade-in duration-200">
      {contacts.map((c) => (
        <ContactItem
          key={c.id || c._id}
          contact={c}
          isSelected={selectedIds.includes(c.id || c._id || "")}
          onToggle={onToggle}
          hideRelationship={hideRelationship}
        />
      ))}
    </div>
  );
};
