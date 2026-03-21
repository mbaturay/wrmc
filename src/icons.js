// src/icons.js
// ─────────────────────────────────────────────────────────────────
// Central icon registry for WRMC Prototype
// Weight is controlled by the ICON_WEIGHT constant.
// Change it here to preview a different style across the whole app.
// Options: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
// ─────────────────────────────────────────────────────────────────

export const ICON_WEIGHT = "regular"; // ← change this to test weights

export {
  // Navigation
  House,
  Star,
  List,
  Question,
  Gear,

  // Header actions
  Bell,
  MagnifyingGlass,
  CaretLeft,

  // Account menu
  User,
  CreditCard,
  Snowflake,
  FileText,

  // Notification types
  Tag,
  CheckCircle,
  Confetti,
  Info,

  // Transaction categories
  ShoppingCart,
  House as HomeIcon,
  GasPump,
  Coffee,
  Pill,
  Wrench,
  Wallet,
  Receipt,

  // Help screen
  Phone,
  ChatCircle,
  ClipboardText,
  BookOpen,
  SealPercent,

  // Home screen quick actions / misc
  ArrowRight,
  Sparkle,
  LockKey,
} from "@phosphor-icons/react";
