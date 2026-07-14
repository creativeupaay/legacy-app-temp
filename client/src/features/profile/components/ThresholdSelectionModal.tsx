import React, { useState, useEffect } from "react";
import { theme } from "@/theme/theme";
import { Check } from "lucide-react";

export interface ThresholdSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentValue?: number;
  onSave: (days: number) => Promise<void>;
}

interface ThresholdOption {
  days: number;
  label: string;
}

const THRESHOLD_OPTIONS: ThresholdOption[] = [
  { days: 30, label: "1 month" },
  { days: 60, label: "2 months" },
  { days: 90, label: "3 months (Default)" },
  { days: 180, label: "6 months" },
  { days: 365, label: "12 months" },
];

export const ThresholdSelectionModal: React.FC<ThresholdSelectionModalProps> = ({
  isOpen,
  onClose,
  currentValue = 90,
  onSave,
}) => {
  const [selectedDays, setSelectedDays] = useState(currentValue);
  const [isSaving, setIsSaving] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedDays(currentValue);
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateIn(true);
        });
      });
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentValue]);

  if (!shouldRender) return null;

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      await onSave(selectedDays);
      onClose();
    } catch (err) {
      console.error("Failed to update threshold:", err);
      alert("Failed to update inactivity threshold.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end justify-center transition-opacity duration-200 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.40)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: theme.colors.surface.default || "#FFFFFF",
          fontFamily: theme.fonts.sans,
          boxShadow: "0 -8px 32px rgba(0,0,0,0.12), 0 -2px 8px rgba(0,0,0,0.06)",
        }}
        className={`w-full max-w-[480px] rounded-t-[28px] px-6 pt-6 pb-8 transition-transform duration-220 ease-out transform ${
          animateIn ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Decorative notch */}
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {/* Title */}
        <h2
          style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary || "#182232" }}
          className="text-[17px] font-bold mb-1 text-center"
        >
          Legacy Inactivity Threshold
        </h2>
        <p
          style={{ color: theme.colors.text.secondary || "#6B6B6F" }}
          className="text-[12.5px] leading-[1.5] text-center mb-6 px-2"
        >
          Select how long you must be inactive on the app before your shared journal entries are released to your recipients.
        </p>

        {/* Selection Options List */}
        <div className="flex flex-col gap-2.5 mb-6">
          {THRESHOLD_OPTIONS.map((option) => {
            const isSelected = selectedDays === option.days;
            return (
              <button
                key={option.days}
                type="button"
                onClick={() => setSelectedDays(option.days)}
                style={{
                  borderColor: isSelected ? theme.colors.primary.action : "rgba(0,0,0,0.06)",
                  backgroundColor: isSelected ? "rgba(28, 39, 76, 0.03)" : "#FDFDFD",
                }}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-[16px] border text-left cursor-pointer transition-all active:scale-[0.99]"
              >
                <span
                  style={{
                    fontFamily: theme.fonts.sans,
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? theme.colors.primary.action : theme.colors.text.primary,
                  }}
                  className="text-[14px]"
                >
                  {option.label}
                </span>
                {isSelected && (
                  <Check
                    size={16}
                    style={{ color: theme.colors.primary.action }}
                    className="shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            style={{
              borderColor: "rgba(0,0,0,0.08)",
              color: theme.colors.text.primary,
            }}
            className="flex-1 py-3.5 border rounded-full font-semibold text-[14.5px] text-center hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveClick}
            style={{
              backgroundColor: theme.colors.primary.action,
              color: "#FFFFFF",
            }}
            className="flex-1 py-3.5 rounded-full font-semibold text-[14.5px] text-center hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Saving…" : "Save Threshold"}
          </button>
        </div>
      </div>
    </div>
  );
};
