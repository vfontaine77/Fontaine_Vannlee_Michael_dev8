/**
 * Point d'entrée principal - C-management
 * Redirection vers la navigation par tabs
 * Expo SDK 54.0.1 REQUIS
 */
import { Redirect } from "expo-router";

export default function Index() {
  // Redirection automatique vers l'écran principal avec tabs
  return <Redirect href="/(tabs)" />;
}
