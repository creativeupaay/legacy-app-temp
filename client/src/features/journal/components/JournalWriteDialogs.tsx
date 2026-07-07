import React from "react";
import { Button } from "@/components/ui";
import { theme } from "@/theme/theme";


export interface UpdateDialogProps {
  onKeepDate: () => void;
  onUpdateDate: () => void;
  onDismiss: () => void;
  isSaving: boolean;
}

export const UpdateDialog: React.FC<UpdateDialogProps> = ({
  onKeepDate,
  onUpdateDate,
  onDismiss,
  isSaving,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-5"
    style={{ backgroundColor: "rgba(0,0,0,0.40)" }}
    onClick={(e) => e.target === e.currentTarget && onDismiss()}
  >
    <div
      style={{
        backgroundColor: theme.colors.surface.default,
        fontFamily: theme.fonts.sans,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
      }}
      className="w-full max-w-[320px] rounded-[24px] px-4 pt-5 pb-4 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Title */}
      <h2
        style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
        className="text-[16px] font-bold mb-1 text-center"
      >
        Update Journal
      </h2>
      <p
        style={{ color: theme.colors.text.secondary }}
        className="text-[12px] leading-[1.5] text-center mb-4 px-1"
      >
        Keep the original date or move to today?
      </p>

      {/* Option 1 – Keep Original Date */}
      <button
        type="button"
        disabled={isSaving}
        onClick={onKeepDate}
        style={{
          borderColor: "rgba(0,0,0,0.08)",
          fontFamily: theme.fonts.sans,
          color: theme.colors.text.primary,
        }}
        className="group w-full text-left px-3.5 py-3 mb-2 rounded-[14px] border bg-[#F7F7F8] hover:bg-white hover:border-black/15 hover:shadow-sm active:scale-[0.98] transition-all duration-150 disabled:opacity-60 cursor-pointer"
      >
        <p
          style={{ fontFamily: theme.fonts.heading }}
          className="font-semibold text-[13.5px] mb-0.5"
        >
          Keep Original Date
        </p>
        <p
          style={{ color: theme.colors.text.secondary }}
          className="text-[11.5px] leading-[1.4]"
        >
          Stays in its current position.
        </p>
      </button>

      {/* Option 2 – Update to Today */}
      <button
        type="button"
        disabled={isSaving}
        onClick={onUpdateDate}
        style={{
          backgroundColor: theme.colors.primary.action || "#1C274C",
          fontFamily: theme.fonts.sans,
        }}
        className="w-full text-left px-3.5 py-3 rounded-[14px] hover:opacity-90 hover:shadow-md active:scale-[0.98] transition-all duration-150 disabled:opacity-60 cursor-pointer"
      >
        <p
          style={{ color: "#FFFFFF", fontFamily: theme.fonts.heading }}
          className="font-semibold text-[13.5px] mb-0.5"
        >
          {isSaving ? "Saving…" : "Update to Today"}
        </p>
        <p
          style={{ color: "rgba(255,255,255,0.68)" }}
          className="text-[11.5px] leading-[1.4]"
        >
          Moves to today's position.
        </p>
      </button>
    </div>
  </div>
);


export interface DeleteDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  onConfirm,
  onCancel,
  isDeleting,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-5"
    style={{ backgroundColor: "rgba(0,0,0,0.40)" }}
    onClick={(e) => e.target === e.currentTarget && onCancel()}
  >
    <div
      style={{
        backgroundColor: theme.colors.surface.default,
        fontFamily: theme.fonts.sans,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
      }}
      className="w-full max-w-[290px] rounded-[24px] px-5 pt-5 pb-5 animate-in fade-in zoom-in-95 duration-200"
    >
      <h2
        style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
        className="text-[16px] font-bold mb-1 text-center"
      >
        Delete Journal?
      </h2>
      <p
        style={{ color: theme.colors.text.secondary }}
        className="text-[12.5px] leading-[1.4] text-center mb-5"
      >
        Are you sure? This cannot be undone.
      </p>

      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={isDeleting}
          className="!w-full !rounded-[14px] !py-3 !text-[13.5px] !font-semibold"
        >
          {isDeleting ? "Deleting…" : "Confirm"}
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isDeleting}
          className="!w-full !rounded-[14px] !py-3 !text-[13.5px] !font-medium !border !border-black/10 !shadow-none"
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
);
