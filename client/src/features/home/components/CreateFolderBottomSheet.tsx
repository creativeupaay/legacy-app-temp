import React, { useState, useEffect } from "react";
import { X } from "@/components/ui/icons";
import {
  Check,
  Star,
  Activity,
  Headphones,
  AlarmClock,
  Award,
  Medal,
  CloudLightning,
  CloudMoon,
  Target,
  Flag,
  Rocket,
  Hourglass,
  Moon,
  Paintbrush,
  Image as ImageIcon,
  Zap,
  HeartPulse,
  PiggyBank,
  Sparkles,
  Sun,
  BarChart2,
  Mic,
  Smile,
  SmilePlus,
  Frown,
  Meh,
  Annoyed,
  Laugh,
  HeartHandshake,
  Asterisk,
  Eye,
  Heart,
  ThumbsUp,
  Bookmark,
  Compass,
} from "lucide-react";

export interface CreateFolderBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (folder: { name: string; color: string; iconId: string }) => void;
  initialData?: {
    id?: string | null;
    name: string;
    color: string;
    iconId: string;
  };
}

const COLORS = [
  { id: "plum", color: "#9D4A6E", bg: "#ECCDDC" },
  { id: "red", color: "#EE4B4B", bg: "#FAD0D0" },
  { id: "pink", color: "#DF73C4", bg: "#F8D0EE" },
  { id: "salmon", color: "#EE8983", bg: "#FAD6D3" },
  { id: "tan", color: "#D69580", bg: "#F5DDD5" },
  { id: "orange", color: "#FA9653", bg: "#FADCC9" },
  { id: "mint", color: "#00BD84", bg: "#CDECE1" },
  { id: "aqua", color: "#21ACE3", bg: "#CCEBF9" },
  { id: "royalblue", color: "#3458CA", bg: "#D3DCF5" },
  { id: "slate", color: "#7096B4", bg: "#DCE4ED" },
  { id: "cornflower", color: "#6B89F7", bg: "#DBE3FD" },
  { id: "indigo", color: "#796BF2", bg: "#DFDCFD" },
  { id: "black", color: "#000000", bg: "#D4D4D4" },
  {
    id: "rainbow",
    color: "#4A5568",
    bg: "#E8EEF5",
    gradient: "linear-gradient(135deg, #F3C4D4 0%, #D8CEF6 50%, #C4E3F3 100%)",
  },
];

const ICONS = [
  // Row 1
  { id: "Activity", icon: Activity },
  { id: "Headphones", icon: Headphones },
  { id: "AlarmClock", icon: AlarmClock },
  { id: "Award", icon: Award },
  { id: "Medal", icon: Medal },
  { id: "CloudLightning", icon: CloudLightning },
  { id: "CloudMoon", icon: CloudMoon },
  // Row 2
  { id: "Target", icon: Target },
  { id: "Flag", icon: Flag },
  { id: "Rocket", icon: Rocket },
  { id: "Hourglass", icon: Hourglass },
  { id: "Moon", icon: Moon },
  { id: "Paintbrush", icon: Paintbrush },
  { id: "ImageIcon", icon: ImageIcon },
  // Row 3
  { id: "Zap", icon: Zap },
  { id: "HeartPulse", icon: HeartPulse },
  { id: "PiggyBank", icon: PiggyBank },
  { id: "Sparkles", icon: Sparkles },
  { id: "Sun", icon: Sun },
  { id: "BarChart2", icon: BarChart2 },
  { id: "Mic", icon: Mic },
  // Row 4
  { id: "Smile", icon: Smile },
  { id: "SmilePlus", icon: SmilePlus },
  { id: "Frown", icon: Frown },
  { id: "Meh", icon: Meh },
  { id: "Annoyed", icon: Annoyed },
  { id: "Laugh", icon: Laugh },
  { id: "HeartHandshake", icon: HeartHandshake },
  // Row 5
  { id: "Asterisk", icon: Asterisk },
  { id: "Eye", icon: Eye },
  { id: "Star", icon: Star },
  { id: "Heart", icon: Heart },
  { id: "ThumbsUp", icon: ThumbsUp },
  { id: "Bookmark", icon: Bookmark },
  { id: "Compass", icon: Compass },
];

export const CreateFolderBottomSheet: React.FC<CreateFolderBottomSheetProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[5]);
  const [selectedIconId, setSelectedIconId] = useState("Star");
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFolderName(initialData.name || "");
        const matchColor =
          COLORS.find(
            (c) => c.color.toLowerCase() === initialData.color?.toLowerCase()
          ) || COLORS[5];
        setSelectedColor(matchColor);
        setSelectedIconId(initialData.iconId || "Star");
      } else {
        setFolderName("");
        setSelectedColor(COLORS[5]);
        setSelectedIconId("Star");
      }

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
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData]);

  if (!shouldRender) return null;

  const ActiveIconComponent =
    ICONS.find((i) => i.id === selectedIconId)?.icon || Star;

  const handleSave = () => {
    if (onSave) {
      onSave({
        name: folderName.trim() || "New Folder",
        color: selectedColor.color,
        iconId: selectedIconId,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
      <div className="pointer-events-auto relative w-full max-w-[480px] h-full flex items-end justify-center overflow-hidden">
        {/* Backdrop constrained to the mobile viewport */}
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-400 ${
            animateIn ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Bottom Sheet Panel edge-to-edge inside mobile frame */}
        <div
          className={`relative w-full h-auto max-h-[92%] rounded-t-[24px] bg-[#F8F8F3] p-[20px] pb-[28px] gap-[10px] shadow-2xl flex flex-col justify-between overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-transform duration-400 ease-out ${
            animateIn ? "translate-y-0" : "translate-y-full"
          }`}
        >
        {/* Top bar: Close & Save buttons */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onClose}
            style={{
              border: "0.5px solid rgba(0, 0, 0, 0.04)",
              boxShadow:
                "0px 1px 0.8px 0px rgba(0, 0, 0, 0.04), 0px 2px 1.5px 0px rgba(0, 0, 0, 0.12)",
            }}
            className="w-[44px] h-[44px] rounded-[999px] bg-white flex items-center justify-center text-[#1C1C1E] transition-transform active:scale-95 hover:bg-gray-50"
            aria-label="Close"
          >
            <X size={20} strokeWidth={1.8} />
          </button>

          <button
            onClick={handleSave}
            style={{
              backgroundColor: "#1C274C",
              border: "0.5px solid #01203C",
              boxShadow:
                "0px 3px 1px 0px rgba(0, 0, 0, 0.04), 0px 3px 8px 0px rgba(0, 0, 0, 0.12)",
            }}
            className="w-[44px] h-[44px] rounded-[999px] flex items-center justify-center text-white transition-transform active:scale-95 hover:opacity-95"
            aria-label="Save"
          >
            <Check size={20} strokeWidth={2.2} />
          </button>
        </div>

        {/* Selected Icon & Color Preview Circle */}
        <div className="flex justify-center my-2">
          <div
            className="w-[100px] h-[100px] rounded-[999px] flex items-center justify-center transition-colors duration-200"
            style={
              selectedColor.gradient
                ? { background: selectedColor.gradient }
                : { backgroundColor: selectedColor.bg }
            }
          >
            <ActiveIconComponent
              size={48}
              strokeWidth={1.8}
              style={{ color: selectedColor.color }}
            />
          </div>
        </div>

        {/* Input Field */}
        <div className="w-full max-w-[353px] mx-auto mb-3">
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Journal Name"
            className="w-full h-[56px] rounded-[999px] bg-[#E9E9EE] text-center font-['Inter'] text-[18px] font-medium leading-none tracking-[-0.01em] text-[#6B6B6F] placeholder:text-[#6B6B6F] focus:outline-none focus:ring-2 focus:ring-[#182232]/20 transition-all px-4"
          />
        </div>

        {/* Color Picker Grid */}
        <div className="w-full max-w-[353px] min-h-[100px] h-auto mx-auto py-[4px] grid grid-cols-7 gap-1.5 sm:gap-[10px] justify-items-center items-center mb-3">
          {COLORS.map((item) => {
            const isSelected = selectedColor.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedColor(item)}
                style={
                  item.gradient
                    ? { background: item.gradient }
                    : { backgroundColor: item.color }
                }
                className={`w-[36px] h-[36px] sm:w-[41px] sm:h-[41px] rounded-[99px] transition-transform active:scale-95 ${
                  isSelected
                    ? "ring-2 ring-offset-2 ring-black/20 scale-105"
                    : "hover:scale-105"
                }`}
                aria-label={item.id}
              />
            );
          })}
        </div>

        {/* Icon Picker Grid */}
        <div className="w-full max-w-[353px] min-h-[253px] h-auto mx-auto py-[4px] grid grid-cols-7 gap-1.5 sm:gap-[10px] justify-items-center items-center">
          {ICONS.map((item) => {
            const IconComp = item.icon;
            const isSelected = selectedIconId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIconId(item.id)}
                className={`w-[36px] h-[36px] sm:w-[41px] sm:h-[41px] rounded-[99px] flex items-center justify-center transition-all active:scale-95 ${
                  isSelected
                    ? "bg-[#B8B8C7] text-[#1C1C1E] shadow-sm scale-105 ring-2 ring-[#1C1C1E]/25"
                    : "bg-[#E9E9EE] text-[#1C1C1E] hover:opacity-80"
                }`}
                aria-label={item.id}
              >
                <IconComp size={18} strokeWidth={1.6} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </div>
  );
};

export default CreateFolderBottomSheet;
