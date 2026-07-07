import React, { useState } from "react";
import { theme } from "@/theme/theme";
import { Avatar } from "@/components/ui";
import {
  useGetContactsQuery,
  useCreateContactMutation,
} from "@/features/journal/api/journalApi";
import { AddContactModal } from "@/features/journal/components";
import type { ICreateContactRequest } from "@/features/journal/types/contacts.types";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users } from "lucide-react";

const SharingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: contacts = [], isLoading } = useGetContactsQuery();
  const [createContact, { isLoading: isAdding }] = useCreateContactMutation();
  const navigate = useNavigate();

  const handleAddContact = async (data: ICreateContactRequest) => {
    await createContact(data).unwrap();
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1
            style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.heading }}
            className="text-2xl font-extrabold tracking-tight"
          >
            Recipients ({contacts.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: "#EBF4FF",
            color: theme.colors.primary.action,
          }}
          className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-opacity hover:opacity-80 cursor-pointer shrink-0 border border-[#2B7FCE]/10 select-none shadow-2xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Recipient</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: theme.colors.surface.default,
                borderColor: theme.colors.stroke.border,
              }}
              className="p-4 rounded-[18px] border h-16 bg-gray-100"
            />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div
          style={{
            backgroundColor: theme.colors.surface.default,
            borderColor: theme.colors.stroke.border,
          }}
          className="p-8 rounded-[20px] border text-center flex flex-col items-center justify-center gap-3 my-8"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2B7FCE] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
            className="text-base font-bold"
          >
            No recipients yet
          </h3>
          <p style={{ color: theme.colors.text.secondary }} className="text-xs max-w-xs">
            Add contacts to share your legacy memories and journals with loved ones.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: theme.colors.primary.action,
              color: theme.colors.text.inverse,
            }}
            className="mt-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
          >
            Add Your First Recipient
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {contacts.map((c) => (
            <div
              key={c.id || c._id}
              style={{
                backgroundColor: theme.colors.surface.default,
                borderColor: theme.colors.stroke.border,
              }}
              className="p-4 rounded-[18px] border shadow-xs flex items-center justify-between gap-4 transition-all hover:border-gray-300"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <Avatar name={c.name} size="md" className="w-11 h-11 rounded-full text-sm font-bold shrink-0 shadow-2xs" />
                <div className="min-w-0 flex-1">
                  <h4
                    style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
                    className="text-base font-bold truncate leading-tight"
                  >
                    {c.name}
                  </h4>
                  <p
                    style={{ fontFamily: theme.fonts.sans, color: theme.colors.text.secondary }}
                    className="text-xs truncate mt-0.5"
                  >
                    {c.email}
                  </p>
                </div>
              </div>
              {c.relationship && (
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] font-semibold shrink-0 uppercase tracking-wider">
                  {c.relationship}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <AddContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddContact={handleAddContact}
        isLoading={isAdding}
      />
    </div>
  );
};

export default SharingPage;
