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

export interface ContactItemProps {
  contact: IContact;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  isSelected,
  onToggle,
}) => {
  const contactId = contact.id || contact._id || "";

  return (
    <div
      onClick={() => onToggle(contactId)}
      className="flex items-center justify-between py-2.5 px-1 cursor-pointer transition-opacity hover:opacity-80 active:scale-[0.99] select-none"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
        <Avatar name={contact.name} size="md" className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex flex-col min-w-0">
          <span
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
            className="font-semibold text-[15px] leading-tight truncate"
          >
            {contact.name}
          </span>
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
}

export const ContactSelectionList: React.FC<ContactSelectionListProps> = ({
  contacts,
  selectedIds,
  onToggle,
  isLoading = false,
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
        />
      ))}
    </div>
  );
};

export interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (data: ICreateContactRequest) => Promise<void>;
  isLoading?: boolean;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  isOpen,
  onClose,
  onAddContact,
  isLoading = false,
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [relationship, setRelationship] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    try {
      setError(null);
      await onAddContact({
        name: name.trim(),
        email: email.trim(),
        relationship: relationship.trim() || undefined,
      });
      setName("");
      setEmail("");
      setRelationship("");
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to add contact.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        style={{ backgroundColor: theme.colors.surface.default }}
        className="w-full max-w-sm rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
      >
        <h3
          style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
          className="text-lg font-bold"
        >
          Add New Recipient
        </h3>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label
              style={{ color: theme.colors.text.secondary }}
              className="block text-xs font-semibold uppercase tracking-wider mb-1"
            >
              Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              disabled={isLoading}
              className="w-full text-sm py-2 px-3 rounded-xl border border-gray-200 outline-none focus:border-[#2B7FCE] transition-colors"
            />
          </div>

          <div>
            <label
              style={{ color: theme.colors.text.secondary }}
              className="block text-xs font-semibold uppercase tracking-wider mb-1"
            >
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jane@example.com"
              disabled={isLoading}
              className="w-full text-sm py-2 px-3 rounded-xl border border-gray-200 outline-none focus:border-[#2B7FCE] transition-colors"
            />
          </div>

          <div>
            <label
              style={{ color: theme.colors.text.secondary }}
              className="block text-xs font-semibold uppercase tracking-wider mb-1"
            >
              Relationship (Optional)
            </label>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. Sister, Friend"
              disabled={isLoading}
              className="w-full text-sm py-2 px-3 rounded-xl border border-gray-200 outline-none focus:border-[#2B7FCE] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 mt-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{ color: theme.colors.text.secondary }}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: theme.colors.primary.action,
                color: theme.colors.text.inverse,
              }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
