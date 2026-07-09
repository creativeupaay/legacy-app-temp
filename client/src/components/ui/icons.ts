import React from "react";
import {
  ArrowRight,
  Play,
  ChevronRight,
  ChevronLeft,
  Plus,
  Lock,
  Zap,
  Search,
  Calendar,
  Check,
  User,
  Users,
  Globe,
  X,
  SquarePen,
  Mic,
  Bell,
  Star,
  Sun,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export const ArrowRightIcon: React.FC<LucideProps> = ({
  size = 24,
  className = "",
  ...props
}) =>
  React.createElement(ArrowRight, {
    size,
    className: `shrink-0 aspect-square ${className}`.trim(),
    ...props,
  });

export const PlayIcon: React.FC<LucideProps> = ({
  size = 24,
  className = "",
  ...props
}) =>
  React.createElement(Play, {
    size,
    className: `shrink-0 aspect-square ${className}`.trim(),
    ...props,
  });

export const PlusIcon: React.FC<LucideProps> = ({
  size = 24,
  className = "",
  ...props
}) =>
  React.createElement(Plus, {
    size,
    className: `shrink-0 aspect-square ${className}`.trim(),
    ...props,
  });

export {
  ArrowRight,
  Play,
  ChevronRight,
  ChevronLeft,
  Plus,
  Lock,
  Zap,
  Search,
  Calendar,
  Check,
  User,
  Users,
  Globe,
  X,
  SquarePen,
  Mic,
  Bell,
  Star,
  Sun,
};
export type { LucideIcon, LucideProps };

