import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "@/theme/theme";
import { Button } from "@/components/ui";
import {
  useCreateContactMutation,
  useGetContactsQuery,
} from "@/features/journal/api/journalApi";
import { ChevronLeft, User, Heart, Plus } from "lucide-react";

export const AddRecipientPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: contacts = [] } = useGetContactsQuery();
  const [createContact, { isLoading }] = useCreateContactMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isCustomGroup, setIsCustomGroup] = useState(false);
  const [customGroupName, setCustomGroupName] = useState("");
  const [userCreatedGroups, setUserCreatedGroups] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Combine custom relationship groups from existing contacts with any groups created in this session
  const existingContactsGroups = Array.from(
    new Set(
      contacts
        .map((c) => c.relationship?.trim() || "")
        .filter((r): r is string => r.length > 0)
    )
  );
  const allGroups = Array.from(
    new Set([...existingContactsGroups, ...userCreatedGroups])
  );

  const handleGroupClick = (group: string) => {
    setIsCustomGroup(false);
    if (relationship === group) {
      setRelationship("");
    } else {
      setRelationship(group);
    }
  };

  const handleAddNewGroupClick = () => {
    setIsCustomGroup(true);
    setCustomGroupName("");
  };

  const handleConfirmCustomGroup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customGroupName.trim();
    if (!trimmed) return;
    if (!allGroups.includes(trimmed)) {
      setUserCreatedGroups((prev) => [...prev, trimmed]);
    }
    setIsCustomGroup(false);
    setCustomGroupName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    try {
      setError(null);
      await createContact({
        name: name.trim(),
        email: email.trim(),
        relationship: relationship.trim() || undefined,
      }).unwrap();
      navigate(-1);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to save recipient.");
    }
  };

  const isFormValid = name.trim().length > 0 && email.trim().length > 0;

  return (
    <div
      style={{ backgroundColor: "#FFFFF9" }}
      className="w-full max-w-[393px] sm:max-w-[480px] min-h-screen mx-auto flex flex-col justify-between select-none animate-in fade-in duration-200"
    >
      {/* Top Sticky Header Container attached to top even when scrolling */}
      <div
        style={{
          backgroundColor: "#FFFFF9",
          paddingTop: "4px",
          paddingRight: "16px",
          paddingBottom: "12px",
          paddingLeft: "16px",
        }}
        className="sticky top-0 z-30 w-full flex items-center justify-between min-h-[63px]"
      >
        {/* Chevron from icon buttons */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isLoading}
          className="w-10 h-10 rounded-full bg-white border border-[#E1E1DF]/80 shadow-sm flex items-center justify-center text-[#010102] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Center Add Recipient text & Subtitle */}
        <div className="flex flex-col items-center text-center flex-1 px-1">
          <h1
            style={{
              fontFamily: theme.fonts.nunito,
              fontWeight: 700,
              fontSize: "18px",
              lineHeight: "27px",
              letterSpacing: "-0.3px",
              color: "#010102",
            }}
            className="m-0"
          >
            Add Recipient
          </h1>
          <p
            style={{
              fontFamily: theme.fonts.sans,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              letterSpacing: "0px",
              color: "#928C88",
            }}
            className="m-0 mt-0.5"
          >
            Someone who&apos;ll receive your memories
          </p>
        </div>

        {/* Right empty spacer to keep title centered */}
        <div className="w-10 h-10 shrink-0" />
      </div>

      {/* Main Scrollable Container (width: 393; height: ~765.8) */}
      <div className="w-full flex flex-col justify-between flex-1 px-4 pt-2 pb-12">
        <div>
          {/* Avatar Form UI Component (width: 80; height: 80; border-radius: 26843500px; border: 2.4px solid #FFFFFF; bg: #EDE9E2) */}
          <div className="flex flex-col items-center justify-center my-5">
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "9999px",
                borderWidth: "2.4px",
                borderColor: "#FFFFFF",
                backgroundColor: "#EDE9E2",
              }}
              className="flex items-center justify-center mb-2 shadow-sm"
            >
              <User className="w-8 h-8 text-[#928C88] stroke-[1.8]" />
            </div>
            <span
              style={{
                fontFamily: theme.fonts.sans,
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "19.5px",
                letterSpacing: "0px",
                color: "#928C88",
              }}
              className="text-center"
            >
              Enter their name below
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Form Fields Card Container (width: 353; height: ~206; border-radius: 16px; border: 0.8px solid #E1E1DF; bg: #FFFFFF; shadow) */}
            <div
              style={{
                borderRadius: "16px",
                borderWidth: "0.8px",
                borderColor: "#E1E1DF",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)",
              }}
              className="w-full overflow-hidden mb-6"
            >
              {/* Full Name Field Container (padding: 16px; border-bottom: 0.8px solid #E1E1DF) */}
              <div
                style={{
                  padding: "16px",
                  borderBottomWidth: "0.8px",
                  borderBottomColor: "#E1E1DF",
                }}
                className="flex flex-col gap-1.5"
              >
                <label
                  style={{
                    fontFamily: theme.fonts.sans,
                    fontWeight: 600,
                    fontSize: "11px",
                    lineHeight: "16.5px",
                    letterSpacing: "0.7px",
                    color: "#928C88",
                  }}
                  className="flex items-center gap-1 uppercase"
                >
                  FULL NAME <span className="text-[#EF4444] font-bold">*</span>
                </label>
                <div style={{ height: "24px" }} className="w-full flex items-center">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                   
                    disabled={isLoading}
                    style={{
                      fontFamily: theme.fonts.sans,
                      fontSize: "16px",
                      color: "#010102",
                    }}
                    className="w-full font-medium placeholder-[#C5C5C0] outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Email Address Field Container */}
              <div style={{ padding: "16px" }} className="flex flex-col gap-1.5">
                <label
                  style={{
                    fontFamily: theme.fonts.sans,
                    fontWeight: 600,
                    fontSize: "11px",
                    lineHeight: "16.5px",
                    letterSpacing: "0.7px",
                    color: "#928C88",
                  }}
                  className="flex items-center gap-1 uppercase"
                >
                  EMAIL ADDRESS <span className="text-[#EF4444] font-bold">*</span>
                </label>
                <div style={{ height: "24px" }} className="w-full flex items-center">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                   
                    disabled={isLoading}
                    style={{
                      fontFamily: theme.fonts.sans,
                      fontSize: "16px",
                      color: "#010102",
                    }}
                    className="w-full font-medium placeholder-[#C5C5C0] outline-none bg-transparent"
                  />
                </div>
                <span
                  style={{
                    fontFamily: theme.fonts.sans,
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "16.8px",
                    letterSpacing: "0px",
                    color: "#928C88",
                  }}
                  className="mt-1 block"
                >
                  We&apos;ll send a secure invitation to this address.
                </span>
              </div>
            </div>

            {/* GROUPS (optional) Container (gap: 12px) */}
            <div className="w-full flex flex-col gap-3 mb-6">
              {/* Nested Header Container (gap: 8px) */}
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: theme.fonts.sans,
                    fontWeight: 600,
                    fontSize: "11px",
                    lineHeight: "16.5px",
                    letterSpacing: "0.7px",
                    color: "#928C88",
                  }}
                  className="uppercase"
                >
                  GROUPS
                </span>
                <span
                  style={{
                    fontFamily: theme.fonts.sans,
                    fontWeight: 500,
                    fontSize: "10px",
                    lineHeight: "15px",
                    letterSpacing: "0px",
                    color: "#928C88",
                    backgroundColor: "#EDE9E2",
                    paddingTop: "2px",
                    paddingRight: "6px",
                    paddingBottom: "2px",
                    paddingLeft: "6px",
                    borderRadius: "4px",
                  }}
                  className="lowercase"
                >
                  optional
                </span>
              </div>

              {/* Groups Grid Container (rows: 2; columns: 3; row-gap: 8px; column-gap: 8px) */}
              {/* Groups Grid Container (responsive columns, gap: 8px, w-full) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                {allGroups.map((group) => {
                  const isSelected = relationship === group && !isCustomGroup;
                  return (
                    <Button
                      key={group}
                      type="button"
                      variant={isSelected ? "primary" : "secondary"}
                      onClick={() => handleGroupClick(group)}
                      disabled={isLoading}
                      style={{
                        borderWidth: isSelected ? undefined : "0.8px",
                        borderColor: isSelected ? undefined : "#E1E1DF",
                        backgroundColor: isSelected ? undefined : "#FFFFFF",
                        color: isSelected ? undefined : "#6B6B6F",
                        fontFamily: theme.fonts.sans,
                        fontWeight: isSelected ? 600 : 400,
                        fontSize: "12px",
                        lineHeight: "18px",
                        letterSpacing: "-0.1px",
                        boxShadow: isSelected ? undefined : "0px 1px 3px 0px rgba(0, 0, 0, 0.04)",
                      }}
                      className="!w-full !h-[43.6px] !py-[12px] !rounded-[12px] !text-[12px] !leading-[18px] !tracking-[-0.1px] !px-2 !min-w-0 text-center truncate flex items-center justify-center transition-all duration-150"
                    >
                      {group}
                    </Button>
                  );
                })}

                {/* Add new button */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddNewGroupClick}
                  disabled={isLoading || isCustomGroup}
                  style={{
                    borderWidth: isCustomGroup || isLoading ? undefined : "0.8px",
                    borderColor: isCustomGroup || isLoading ? undefined : "#E1E1DF",
                    backgroundColor: isCustomGroup || isLoading ? undefined : "#FFFFFF",
                    color: isCustomGroup || isLoading ? undefined : "#6B6B6F",
                    fontFamily: theme.fonts.sans,
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "18px",
                    letterSpacing: "-0.1px",
                    boxShadow: isCustomGroup || isLoading ? undefined : "0px 1px 3px 0px rgba(0, 0, 0, 0.04)",
                  }}
                  className="!w-full !h-[43.6px] !py-[12px] !rounded-[12px] !text-[12px] !leading-[18px] !tracking-[-0.1px] !px-2 !min-w-0 !gap-[4px] text-center flex items-center justify-center transition-all duration-150"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
                  <span>Add new</span>
                </Button>
              </div>

              {/* Expanded custom group input when "Add new" is clicked */}
              {isCustomGroup && (
                <div
                  style={{
                    borderRadius: "12px",
                    borderWidth: "0.8px",
                    borderColor: "#010102",
                    backgroundColor: "#FFFFFF",
                  }}
                  className="mt-1 p-2.5 shadow-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <input
                    type="text"
                    value={customGroupName}
                    onChange={(e) => setCustomGroupName(e.target.value)}
                    placeholder="Enter group name (e.g. Besties)..."
                    disabled={isLoading}
                    autoFocus
                    style={{
                      fontFamily: theme.fonts.sans,
                      fontSize: "13px",
                      color: "#010102",
                    }}
                    className="flex-1 px-2 py-1 placeholder-[#928C88] outline-none bg-transparent font-medium"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleConfirmCustomGroup();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant={customGroupName.trim() && !isLoading ? "primary" : "disabled"}
                    onClick={() => handleConfirmCustomGroup()}
                    disabled={!customGroupName.trim() || isLoading}
                    className="!h-8 !px-3 !rounded-lg !text-xs !font-semibold !min-w-0"
                  >
                    Add Group
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsCustomGroup(false)}
                    className="!h-8 !px-2 !rounded-lg !text-xs !min-w-0 !border-none !bg-transparent hover:!bg-gray-100 !text-[#6B6B6F]"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Privacy Notice Box (Headset/Heart Notice - border: 0.8px solid #AAC8DB66; bg: linear gradient) */}
            <div
              style={{
                borderRadius: "12px",
                borderWidth: "0.8px",
                borderColor: "rgba(170, 200, 219, 0.4)",
                background:
                  "linear-gradient(135deg, rgba(205, 229, 241, 0.25) 0%, rgba(241, 230, 217, 0.25) 100%)",
                paddingTop: "14px",
                paddingRight: "16px",
                paddingBottom: "14px",
                paddingLeft: "16px",
              }}
              className="w-full flex items-start gap-3 mb-5"
            >
              <Heart className="w-4 h-4 text-[#6B6B6F] shrink-0 mt-0.5 stroke-[1.8]" />
              <p
                style={{
                  fontFamily: theme.fonts.sans,
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "19.2px",
                  letterSpacing: "0px",
                  color: "#6B6B6F",
                }}
                className="m-0 leading-relaxed font-normal"
              >
                Your recipient won&apos;t see anything until you choose to share a
                memory with them. You&apos;re always in control.
              </p>
            </div>

            {/* "* Required fields" Paragraph Container */}
            <div
              style={{
                fontFamily: theme.fonts.sans,
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "18px",
                letterSpacing: "0px",
                color: "#928C88",
              }}
              className="w-full text-center mb-6 flex items-center justify-center gap-1"
            >
              <span className="text-[#EF4444] font-bold">*</span> Required fields
            </div>

            {/* Error Message if any */}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 mb-4 text-center">
                {error}
              </div>
            )}

            {/* Final Save Recipient Button */}
            <Button
              type="submit"
              variant={isFormValid && !isLoading ? "primary" : "disabled"}
              disabled={!isFormValid || isLoading}
              className="!w-full !h-[44px] !rounded-full !font-bold !text-[15px] !min-w-0 !shadow-sm"
            >
              {isLoading ? "Saving..." : "Save Recipient"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipientPage;
