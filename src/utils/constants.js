/**
 * Constantes de configuration - C-management
 * Version Expo SDK 54.0.1 REQUISE
 */

// Configuration App
export const APP_CONFIG = {
  name: "C-management",
  version: "1.0.0",
  sdkVersion: "54.0.1", // VERSION EXPO SDK REQUISE
  buildNumber: "2025.01",
  author: "C-management Team",
  copyright: "© 2025 C-management. Tous droits réservés.",
};

// Thème Noir & Or
export const THEME = {
  colors: {
    primary: "#D4AF37", // Or
    background: "#000000", // Noir
    surface: "#1A1A1A",
    text: "#FFFFFF",
    textSecondary: "#CCCCCC",
    textMuted: "#888888",
    success: "#4CAF50",
    warning: "#F39C12",
    error: "#E63946",
    info: "#4ECDC4",
    border: "#333333",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

// Configuration SDK Requirements
export const SDK_REQUIREMENTS = {
  expo: "54.0.1",
  reactNative: "0.76.3",
  node: "18.0.0",
  minSDK: 54,
  targetSDK: 54,
};

// Permissions requises
export const REQUIRED_PERMISSIONS = {
  ios: [
    "NSMicrophoneUsageDescription",
    "NSCalendarsUsageDescription",
    "NSCameraUsageDescription",
    "NSRemindersUsageDescription",
  ],
  android: [
    "RECORD_AUDIO",
    "READ_CALENDAR",
    "WRITE_CALENDAR",
    "CAMERA",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
  ],
};

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || "https://api.c-management.fr",
  timeout: 10000,
  retryAttempts: 3,
};

// Fonctionnalités disponibles
export const FEATURES = {
  audioRecording: true,
  calendarSync: true,
  pdfGeneration: true,
  qrCodes: true,
  offlineMode: true,
  darkMode: true,
  statistics: true,
  multiLanguage: false, // Futur
};

export default {
  APP_CONFIG,
  THEME,
  SDK_REQUIREMENTS,
  REQUIRED_PERMISSIONS,
  API_CONFIG,
  FEATURES,
};
