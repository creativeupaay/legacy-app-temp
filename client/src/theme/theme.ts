
export const theme = {
  colors: {
    surface: {
      base: "#F1EEE8",
      neutral: "#E9E9EE",
      default: "#FFFFFF",
      elevated: "#FFFFF9",
      primary: "#E3F1F7",
      nav: "#F8F8F8",
      bg: "#F2F3EE", // NEW — app background shade from placeholder tokens
      disabled: "#D7D7D7", // NEW — Button disabled background
    },

    text: {
      primary: "#010102",
      secondary: "#6B6B6F",
      tertiary: "#8d8d91",
      inverse: "#FFFFFF",
      dateYear: "#676767", // NEW — added, distinct from tertiary (#8d8d91); confirm with senior whether this should actually just BE tertiary
      muted: "#6B6B6B", // NEW — placeholder secondary text color from index.css
      disabled: "#7F7F7F", // NEW — Button disabled text color
    },

    primary: {
      action: "#1C274C",
      motivation: "#F6D74D",
      motivationBorder: "#E5CD61", // NEW — border shade for motivation-colored elements
      brand: "#1A1A1A", // NEW — placeholder near-black brand color from index.css
      buttonAction: "#0D2B45", // NEW — FLAG: vs. unify with primary.action (#1C274C)?
    },

    stroke: {
      light: "#FFFFFF",
      dark: "#F8F8FD",
      yellow: "#F9F9F3",
      blue: "#B3CCD7",
      nav: "#F0F0F0", // NEW — NavigationBar's border; distinct from stroke.dark (#F8F8FD)
      border: "#E5E5E5", // NEW — general border/divider color from placeholder tokens
      subtle: "rgba(0,0,0,0.04)", // NEW — shared with IconButton Close & Secondary Button border
    },

    icon: {               // NEW top-level group — theme.ts had no icon group at all
      muted: "#928C88",   // (chevrons, lock icon)
    },

    label: {               // NEW top-level group — no equivalent existed
      muted: "#8A8A8A",    // (calendar "Day" label)
    },

    streak: {                  // NEW top-level group
      inactive: "#61585D",     // StreakBadge default state icon/text
    },

    error: {                   // NEW top-level group — error alert/button states
      bg: "#FEF2F2",
      border: "#FECACA",
      text: "#B91C1C",
      textDark: "#DC2626",
    },
  },

  fonts: {          // NEW — theme.ts had no font definitions at all
    sans: "Inter, ui-sans-serif, system-ui",
    heading: "Inter, ui-sans-serif, system-ui",
    serif: "Georgia, ui-serif, system-ui",
  },

  hover: {          // NEW — top-level group for JS mouseenter/mouseleave hover states
    buttonAction: "#0a2036",  // darkened buttonAction — update if buttonAction is unified with primary.action
    outline: "rgba(0,0,0,0.02)", // Secondary variant hover
  },
} as const;

export type Theme = typeof theme;
export default theme;
