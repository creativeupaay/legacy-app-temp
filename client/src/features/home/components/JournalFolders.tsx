import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Star, ChevronRight } from "@/components/ui/icons";
import { useGetJournalEntriesQuery } from "@/features/journal/api/journalApi";
import {
  useGetJournalFoldersQuery,
  useCreateJournalFolderMutation,
} from "@/features/journal/api/journalFolderApi";
import { CreateFolderBottomSheet } from "./CreateFolderBottomSheet";
import * as LucideIcons from "lucide-react";

export const JournalFolders: React.FC = () => {
  const navigate = useNavigate();
  const { data: journals } = useGetJournalEntriesQuery();
  const { data: fetchedFolders = [] } = useGetJournalFoldersQuery();
  const [createFolder] = useCreateJournalFolderMutation();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleAddFolder = async (folderData: {
    name: string;
    color: string;
    iconId: string;
  }) => {
    try {
      await createFolder({
        name: folderData.name,
        color: folderData.color,
        icon: folderData.iconId,
      }).unwrap();
    } catch (err) {
      console.error("Failed to create folder:", err);
    }
  };

  const getFolderIcon = (iconId: string, color: string) => {
    const IconComp = (LucideIcons as any)[iconId] || LucideIcons.Folder;
    return (
      <IconComp
        size={20}
        strokeWidth={1.5}
        style={{ color }}
        className="shrink-0"
      />
    );
  };

  // Ensure "All Entries" virtual item is always present at top
  const allEntriesFolder = fetchedFolders.find((f) => f.id === null) || {
    id: null,
    name: "All entries",
    icon: "Star",
    color: "#C15700",
    journalCount: journals?.length || 0,
  };

  const customFolders = fetchedFolders.filter((f) => f.id !== null);

  return (
    <div className="w-full flex flex-col gap-[8px]">
      {/* Journal Header */}
      <div className="flex justify-between items-center w-full h-[24px]">
        <h2 className="text-[18px] font-medium leading-[100%] tracking-[-0.01em] text-[#6B6B6F] m-0 font-['Inter']">
          Journal
        </h2>

        <button
          onClick={() => setIsBottomSheetOpen(true)}
          className="w-[24px] h-[24px] rounded-full flex items-center justify-center transition-transform active:scale-95 bg-[#D9D9D9] hover:bg-[#CCCCCC]"
          aria-label="Add folder"
        >
          <Plus size={14} strokeWidth={2} className="text-[#333333]" />
        </button>
      </div>

      {/* Folders Container */}
      <div className="w-full rounded-[7px] bg-[#FDFDF6] flex flex-col overflow-hidden">
        {/* All entries */}
        <div
          onClick={() => navigate("/journal?folder=all")}
          className="w-full min-h-[41px] flex items-center justify-between pt-[12px] pr-[14px] pb-[8px] pl-[14px] cursor-pointer hover:bg-[rgba(0,0,0,0.025)] active:bg-[rgba(0,0,0,0.05)] transition-colors"
        >
          <div className="flex items-center gap-[12px]">
            <Star
              size={20}
              strokeWidth={1.5}
              className="text-[#C15700] shrink-0"
            />
            <span className="font-['Inter'] font-normal text-[16px] leading-[100%] tracking-[-0.01em] text-[#000000]">
              All entries
            </span>
          </div>
          <div className="flex items-center gap-[8px]">
            <span className="font-['Inter'] font-medium text-[16px] leading-[21px] tracking-[-0.32px] text-[#928C88]">
              {allEntriesFolder.journalCount}
            </span>
            <ChevronRight
              size={16}
              strokeWidth={1.3}
              className="text-[#928C88]"
            />
          </div>
        </div>

        {/* Custom Folders */}
        {customFolders.map((folder) => (
          <React.Fragment key={folder.id}>
            <div className="w-full h-[1px] bg-[#E1E1DF]" />
            <div
              onClick={() => navigate(`/journal?folder=${folder.id}`)}
              className="w-full min-h-[41px] flex items-center justify-between pt-[12px] pr-[14px] pb-[8px] pl-[14px] cursor-pointer hover:bg-[rgba(0,0,0,0.025)] active:bg-[rgba(0,0,0,0.05)] transition-colors"
            >
              <div className="flex items-center gap-[12px] min-w-0 flex-1 mr-2">
                {getFolderIcon(folder.icon, folder.color)}
                <span className="font-['Inter'] font-normal text-[16px] leading-[100%] tracking-[-0.01em] text-[#000000] truncate">
                  {folder.name}
                </span>
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="font-['Inter'] font-medium text-[16px] leading-[21px] tracking-[-0.32px] text-[#928C88]">
                  {folder.journalCount}
                </span>
                <ChevronRight
                  size={16}
                  strokeWidth={1.3}
                  className="text-[#928C88]"
                />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Create Folder Bottom Sheet */}
      <CreateFolderBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        onSave={handleAddFolder}
      />
    </div>
  );
};

export default JournalFolders;
