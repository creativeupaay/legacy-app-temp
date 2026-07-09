import React, { useState } from "react";
import { theme } from "@/theme/theme";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Button } from "@/components/ui";
import {
  Search,
  Mail,
  SlidersHorizontal,
  Bell,
  Clock,
  Download,
  Shield,
  FileText,
  HelpCircle,
  Bug,
  Info,
  Share2,
  Trash2,
  LogOut,
  ExternalLink,
} from "lucide-react";

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    style={{
      color: "#928C88",
      fontFamily: theme.fonts.sans,
      fontWeight: 500,
      fontSize: "11px",
      lineHeight: "16.5px",
      letterSpacing: "0.7px",
      textTransform: "uppercase",
      opacity: 1,
    }}
    className="mb-2 px-1"
  >
    {children}
  </h2>
);

const SectionCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      backgroundColor: "#FFFFF9",
      borderRadius: "12px",
      border: "0.8px solid #0000000F",
      borderTop: "0.8px solid #0000000F",
      boxShadow: "0px 1px 4px 0px #0000000D",
    }}
    className="w-full divide-y divide-[#E1E1DF] overflow-hidden mb-6"
  >
    {children}
  </div>
);

interface SettingRowProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  rightElement,
  disabled,
  onClick,
}) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`flex items-center justify-between w-full min-h-[clamp(56px,_16.5vw,_62px)] px-[clamp(12px,_4.3vw,_16px)] py-[clamp(10px,_3.5vw,_13px)] gap-[clamp(8px,_3.2vw,_12px)] transition-colors select-none ${
      disabled ? "opacity-40 pointer-events-none cursor-not-allowed" : "cursor-pointer hover:bg-gray-50/70 active:bg-gray-100/60"
    }`}
  >
    <div className="flex items-center gap-[clamp(8px,_3.2vw,_12px)] min-w-0 flex-1">
      <div
        style={{
          backgroundColor: iconBg,
          color: iconColor,
          width: "clamp(30px, 9.5vw, 36px)",
          height: "clamp(30px, 9.5vw, 36px)",
          borderRadius: "clamp(7px, 2.4vw, 9px)",
          flexShrink: 0,
        }}
        className="flex items-center justify-center"
      >
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span
          style={{
            fontFamily: theme.fonts.sans,
            color: "#010102",
            fontWeight: 400,
            fontSize: "15px",
            lineHeight: "19.5px",
            letterSpacing: "0px",
            opacity: 1,
          }}
          className="truncate"
        >
          {title}
        </span>
        {subtitle && (
          <span
            style={{
              fontFamily: theme.fonts.sans,
              color: "#6B6B6F",
              fontWeight: 500,
              fontSize: "clamp(10px, 3.2vw, 12px)",
              lineHeight: "clamp(14px, 4.5vw, 16.8px)",
              letterSpacing: "0px",
            }}
            className="line-clamp-2 mt-0.5 max-w-[188px]"
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-1 shrink-0">
      {rightElement}
    </div>
  </div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({
  checked,
  onChange,
}) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      onChange();
    }}
    style={{
      width: "48px",
      height: "28px",
      borderRadius: "14px",
      backgroundColor: checked ? "#0D2B45" : "#D1D1D6",
    }}
    className="flex items-center p-[2px] cursor-pointer transition-colors duration-200 shrink-0"
  >
    <div
      style={{
        width: "24px",
        height: "24px",
        borderRadius: "12px",
      }}
      className={`bg-white shadow-md transform transition-transform duration-200 ${
        checked ? "translate-x-[20px]" : "translate-x-0"
      }`}
    />
  </div>
);

const SettingsPage: React.FC = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [journalReminders, setJournalReminders] = useState(true);
  const [sharedMemoryAlerts, setSharedMemoryAlerts] = useState(false);

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ─── Data model ─────────────────────────────────────────────────────────────
  interface SettingItem {
    key: string;
    title: string;
    subtitle?: string;
    section: string;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    rightElement?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
  }

  const allSettings: SettingItem[] = [
    // ACCOUNT
    {
      key: "change-email",
      section: "ACCOUNT",
      icon: <Mail size={17} />,
      iconBg: "#EAF4FB",
      iconColor: "#1C274C",
      title: "Change Email",
      rightElement: <ChevronRight size={18} style={{ color: theme.colors.icon.muted }} />,
      onClick: () => alert("Change Email feature coming soon"),
    },
    {
      key: "legacy-threshold",
      section: "ACCOUNT",
      icon: <SlidersHorizontal size={17} />,
      iconBg: "#FEF9E6",
      iconColor: "#1C274C",
      title: "Legacy Threshold",
      subtitle: "Entries before your journal becomes a legacy",
      rightElement: (
        <>
          <span
            style={{
              fontFamily: theme.fonts.sans,
              color: "#928C88",
              fontWeight: 500,
              fontSize: "13px",
              lineHeight: "19.5px",
              letterSpacing: "0px",
            }}
          >
            2 months
          </span>
          <ChevronRight size={14} style={{ color: theme.colors.icon.muted }} />
        </>
      ),
      onClick: () => alert("Legacy Threshold feature coming soon"),
    },
    // NOTIFICATIONS
    {
      key: "push-notifications",
      section: "NOTIFICATIONS",
      icon: <Bell size={17} />,
      iconBg: "#FEF9E6",
      iconColor: "#1C274C",
      title: "Push Notifications",
      rightElement: (
        <ToggleSwitch
          checked={pushNotifications}
          onChange={() => setPushNotifications((v) => !v)}
        />
      ),
      onClick: () => setPushNotifications((v) => !v),
    },
    {
      key: "journal-reminders",
      section: "NOTIFICATIONS",
      icon: <Clock size={17} />,
      iconBg: "#F0EDE8",
      iconColor: "#1C274C",
      title: "Journal Reminders",
      rightElement: (
        <ToggleSwitch
          checked={journalReminders}
          onChange={() => setJournalReminders((v) => !v)}
        />
      ),
      onClick: () => setJournalReminders((v) => !v),
    },
    {
      key: "reminder-time",
      section: "NOTIFICATIONS",
      icon: <Clock size={17} />,
      iconBg: "#EAF4FB",
      iconColor: "#1C274C",
      title: "Reminder Time",
      subtitle: "Daily nudge to write in your journal",
      disabled: !journalReminders,
      rightElement: (
        <>
         <span
            style={{
              fontFamily: theme.fonts.sans,
              color: "#928C88",
              fontWeight: 500,
              fontSize: "13px",
              lineHeight: "19.5px",
              letterSpacing: "0px",
            }}
          >8:00 PM</span>
          <ChevronRight size={18} style={{ color: theme.colors.icon.muted }} />
        </>
      ),
      onClick: () => alert("Reminder Time selection coming soon"),
    },
    {
      key: "shared-memory-alerts",
      section: "NOTIFICATIONS",
      icon: <Bell size={17} />,
      iconBg: "#F0EDE8",
      iconColor: "#1C274C",
      title: "Shared Memory Alerts",
      rightElement: (
        <ToggleSwitch
          checked={sharedMemoryAlerts}
          onChange={() => setSharedMemoryAlerts((v) => !v)}
        />
      ),
      onClick: () => setSharedMemoryAlerts((v) => !v),
    },
    // PRIVACY & SECURITY
    {
      key: "download-memories",
      section: "PRIVACY & SECURITY",
      icon: <Download size={17} />,
      iconBg: "#EAF4FB",
      iconColor: "#1C274C",
      title: "Download Memories",
      rightElement: <ChevronRight size={18} style={{ color: theme.colors.icon.muted }} />,
      onClick: () => alert("Download Memories feature coming soon"),
    },
    {
      key: "privacy-policy",
      section: "PRIVACY & SECURITY",
      icon: <Shield size={17} />,
      iconBg: "#F0EDE8",
      iconColor: "#1C274C",
      title: "Privacy Policy",
      rightElement: <ExternalLink className="w-4 h-4 text-gray-400" />,
      onClick: () => alert("Opening Privacy Policy..."),
    },
    {
      key: "terms-of-service",
      section: "PRIVACY & SECURITY",
      icon: <FileText size={17} />,
      iconBg: "#F0EDE8",
      iconColor: "#1C274C",
      title: "Terms of Service",
      rightElement: <ExternalLink className="w-4 h-4 text-gray-400" />,
      onClick: () => alert("Opening Terms of Service..."),
    },
    // SUPPORT
    {
      key: "help-center",
      section: "SUPPORT",
      icon: <HelpCircle size={17} />,
      iconBg: "#FEF9E6",
      iconColor: "#1C274C",
      title: "Help Center",
      rightElement: <ChevronRight size={18} style={{ color: theme.colors.icon.muted }} />,
      onClick: () => alert("Opening Help Center..."),
    },
    {
      key: "report-bug",
      section: "SUPPORT",
      icon: <Bug size={17} />,
      iconBg: "#F0EDE8",
      iconColor: "#1C274C",
      title: "Report a Bug",
      rightElement: <ChevronRight size={18} style={{ color: theme.colors.icon.muted }} />,
      onClick: () => alert("Opening Bug Report form..."),
    },
    // ABOUT
    {
      key: "app-version",
      section: "ABOUT",
      icon: <Info size={17} />,
      iconBg: "#F0EDE8",
      iconColor: "#1C274C",
      title: "App Version",
      subtitle: "2.4.1 (Build 240)",
    },
    {
      key: "share-app",
      section: "ABOUT",
      icon: <Share2 size={17} />,
      iconBg: "#F0EDE8",
      iconColor: "#1C274C",
      title: "Share App",
      rightElement: <ChevronRight size={18} style={{ color: theme.colors.icon.muted }} />,
      onClick: () => alert("Sharing app link..."),
    },
    // DANGER
    {
      key: "delete-account",
      section: "DANGER",
      icon: <Trash2 size={17} />,
      iconBg: "#FFEBEB",
      iconColor: "#1C274C",
      title: "Delete Account",
      subtitle: "Permanently removes all your data",
      onClick: () => alert("Delete Account confirmation coming soon"),
    },
    {
      key: "sign-out",
      section: "DANGER",
      icon: <LogOut size={17} />,
      iconBg: "#FFEBEB",
      iconColor: "#1C274C",
      title: "Sign Out",
      onClick: () => setIsLogoutModalOpen(true),
    },
  ];

  // ─── Filter ──────────────────────────────────────────────────────────────────
  const q = searchQuery.toLowerCase().trim();
  const filtered = q
    ? allSettings.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.section.toLowerCase().includes(q) ||
          (s.subtitle?.toLowerCase().includes(q) ?? false)
      )
    : allSettings;

  // Group into sections
  const sections = ["ACCOUNT", "NOTIFICATIONS", "PRIVACY & SECURITY", "SUPPORT", "ABOUT", "DANGER"];
  const grouped = sections
    .map((sec) => ({ section: sec, items: filtered.filter((s) => s.section === sec) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-right duration-300 ease-out">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full bg-white border border-gray-200/80 shadow-2xs flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft size={20} />
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
          Settings
        </h1>
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
          placeholder="Search settings"
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

      {/* Settings Sections (filtered) */}
      {grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Search
            style={{ color: theme.colors.icon.muted }}
            width={32}
            height={32}
          />
          <p
            style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.sans }}
            className="text-sm text-center"
          >
            No settings found for{" "}
            <span className="font-semibold">"{searchQuery}"</span>
          </p>
        </div>
      ) : (
        grouped.map(({ section, items }) => (
          <div key={section}>
            {section !== "DANGER" && <SectionTitle>{section}</SectionTitle>}
            {section === "DANGER" ? (
              <div
                style={{
                  backgroundColor: "#FFFFF9",
                  borderRadius: "12px",
                  border: "0.8px solid #FCA5A5",
                  boxShadow: "0px 1px 4px 0px #0000000D",
                }}
                className="w-full divide-y divide-red-100 overflow-hidden mb-6"
              >
                {items.map((item) => (
                  <SettingRow
                    key={item.key}
                    icon={item.icon}
                    iconBg={item.iconBg}
                    iconColor={item.iconColor}
                    title={item.title}
                    subtitle={item.subtitle}
                    rightElement={item.rightElement}
                    disabled={item.disabled}
                    onClick={item.onClick}
                  />
                ))}
              </div>
            ) : (
              <SectionCard>
                {items.map((item) => (
                  <SettingRow
                    key={item.key}
                    icon={item.icon}
                    iconBg={item.iconBg}
                    iconColor={item.iconColor}
                    title={item.title}
                    subtitle={item.subtitle}
                    rightElement={item.rightElement}
                    disabled={item.disabled}
                    onClick={item.onClick}
                  />
                ))}
              </SectionCard>
            )}
          </div>
        ))
      )}

      {/* FOOTER TEXT */}
      {!q && (
        <div className="text-center text-[12px] text-gray-400 mt-2 pb-6">
          Legacy Journal · Version 2.4.1
        </div>
      )}

      {/* SIGN OUT CONFIRMATION MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div
            style={{ 
              backgroundColor: "#FFFFF9",
              borderRadius: "24px",
              boxShadow: "0px 8px 32px rgba(0,0,0,0.12), 0px 2px 8px rgba(0,0,0,0.06)",
              border: "0.8px solid rgba(0,0,0,0.05)"
            }}
            className="w-full max-w-[320px] p-6 flex flex-col items-center gap-1 animate-in fade-in zoom-in-95 duration-200 text-center"
          >
            <div 
              style={{ backgroundColor: "#FFEBEB", color: "#E04F4F" }} 
              className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
            >
              <LogOut strokeWidth={2.2} size={24} className="ml-1" />
            </div>
            <h3
              style={{ fontFamily: theme.fonts.heading, color: "#010102" }}
              className="text-[20px] font-bold tracking-tight mb-1"
            >
              Sign Out
            </h3>
            <p 
              style={{ color: "#6B6B6F", fontFamily: theme.fonts.sans }} 
              className="text-[14px] leading-[20px] mb-6 px-2"
            >
              Are you sure you want to sign out of your account?
            </p>

            <div className="flex flex-col w-full gap-2.5">
              <Button
                variant="primary"
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full shadow-sm"
              >
                {isLoading ? "Signing out..." : "Yes, sign out"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsLogoutModalOpen(false)}
                disabled={isLoading}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

