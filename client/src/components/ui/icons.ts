import React from "react";
import { ArrowRight, Play, ChevronRight, Plus, Lock, Zap, type LucideIcon, type LucideProps } from "lucide-react";
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
export { ArrowRight, Play, ChevronRight, Plus, Lock, Zap };
export type { LucideIcon, LucideProps };
