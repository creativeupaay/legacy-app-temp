import React, { useState, useMemo } from "react";
import { theme } from "@/theme/theme";
import { Avatar, Button, ChevronLeft, Chip } from "@/components/ui";
import { useGetContactsQuery } from "@/features/journal/api/journalApi";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";

const CONTACT_PASTELS = [
  { bg: "#CDE5F1", text: "#1C274C" },
  { bg: "#DCEFD8", text: "#1F3B1F" },
  { bg: "#F2E4D8", text: "#3B2A1E" },
  { bg: "#EAE3F2", text: "#2E1E3B" },
];

const SharingPage: React.FC = () => {
  const { data: contacts = [], isLoading } = useGetContactsQuery();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");

  const groups = useMemo(() => {
    const rels = new Set<string>();
    contacts.forEach(c => {
      if (c.relationship) {
        rels.add(c.relationship);
      }
    });
    return ["All", ...Array.from(rels).sort()];
  }, [contacts]);

  const filteredContacts = contacts.filter(
    (c) => {
      const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = selectedGroup === "All" || c.relationship?.toLowerCase() === selectedGroup.toLowerCase();
      return matchesSearch && matchesGroup;
    }
  );

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-700"
          >
            <ChevronLeft size={24} />
          </button>
          <h1
            style={{
              color: "#010102",
              fontFamily: theme.fonts.nunito || "Nunito, sans-serif",
              fontSize: "clamp(20px, 5vw, 22px)",
              lineHeight: "clamp(30px, 7vw, 33px)",
              letterSpacing: "-0.4px",
              fontWeight: 700,
            }}
            className="font-bold truncate min-w-0"
          >
            Recipients ({contacts.length})
          </h1>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => navigate("/profile/add-recipient")}
          className="!h-9 !px-3.5 !rounded-xl !text-xs !font-bold !gap-1.5 !bg-[#EBF4FF] !text-[#2B7FCE] !border !border-[#2B7FCE]/10 !shadow-2xs !min-w-0 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Recipient</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div
        style={{ backgroundColor: "#ECEAE4", borderRadius: "10px" }}
        className="flex items-center w-full h-10 px-[14px] gap-[10px]"
      >
        <Search
          style={{ color: `${theme.colors.text.primary}80`, flexShrink: 0 }}
          width={15}
          height={15}
        />
        <input
          type="text"
          placeholder="Search recipients"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            fontFamily: theme.fonts.sans,
            fontSize: "15px",
            lineHeight: "100%",
            letterSpacing: "0px",
            color: theme.colors.text.primary,
            fontWeight: 400,
          }}
          className="w-full bg-transparent focus:outline-none min-w-0 placeholder-[#01010280]"
        />
      </div>

      {/* Group Chips */}
      {!isLoading && groups.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {groups.map((group) => (
            <Chip
              key={group}
              label={group.charAt(0).toUpperCase() + group.slice(1)}
              variant={selectedGroup === group ? "primary" : "secondary"}
              onClick={() => setSelectedGroup(group)}
              className="capitalize"
            />
          ))}
        </div>
      )}

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
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate("/profile/add-recipient")}
            className="!mt-2 !h-10 !px-4 !rounded-xl !text-xs !font-bold !shadow-xs !min-w-0"
          >
            Add Your First Recipient
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredContacts.length === 0 && searchQuery ? (
            <div className="py-8 text-center">
              <p style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.sans }} className="text-sm">
                No recipients match "{searchQuery}"
              </p>
            </div>
          ) : filteredContacts.map((c, idx) => {
            const pastel = CONTACT_PASTELS[idx % CONTACT_PASTELS.length];
            const avatarSrc = c.avatar || (c as any).profileImage || (c as any).avatarUrl || undefined;
            return (
              <div
                key={c.id || c._id}
                style={{
                  backgroundColor: theme.colors.surface.default,
                  borderColor: theme.colors.stroke.border,
                }}
                className="p-4 rounded-[18px] border shadow-xs flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4 transition-all hover:border-gray-300"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative w-9 h-12 rounded-full border border-gray-100 shrink-0 overflow-hidden shadow-2xs">
                    <Avatar
                      src={avatarSrc}
                      name={c.name}
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
              {selectedGroup === "All" && c.relationship && (
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] font-semibold shrink-0 uppercase tracking-wider">
                  {c.relationship}
                </span>
              )}
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
};

export default SharingPage;
