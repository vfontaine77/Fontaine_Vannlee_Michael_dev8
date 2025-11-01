import { Alert } from "react-native";

export function useSettingsHandlers() {
  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: () => {
          Alert.alert("Déconnexion", "Vous avez été déconnecté avec succès");
          // Ici, implémenter la logique de déconnexion
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      "Effacer les données",
      "Cette action supprimera toutes les données locales. Êtes-vous sûr de continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Effacer",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Données effacées",
              "Les données locales ont été supprimées",
            );
          },
        },
      ],
    );
  };

  const handleExportData = () => {
    Alert.alert(
      "Export de données",
      "Les données vont être exportées en format CSV",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Exporter",
          onPress: () => {
            Alert.alert(
              "Export réussi",
              "Les données ont été exportées avec succès",
            );
          },
        },
      ],
    );
  };

  const handleGradeScaleChange = (setSettings) => {
    Alert.alert(
      "Barème de notation",
      "Choisissez le barème par défaut pour les nouvelles évaluations",
      [
        {
          text: "Notes sur 20",
          onPress: () =>
            setSettings((prev) => ({
              ...prev,
              defaultGradeScale: "20",
            })),
        },
        {
          text: "Notes sur 100",
          onPress: () =>
            setSettings((prev) => ({
              ...prev,
              defaultGradeScale: "100",
            })),
        },
        {
          text: "Lettres (A-F)",
          onPress: () =>
            setSettings((prev) => ({
              ...prev,
              defaultGradeScale: "letter",
            })),
        },
        { text: "Annuler", style: "cancel" },
      ],
    );
  };

  const handleAboutInfo = () => {
    Alert.alert("Information", "Mentions légales et conditions d'utilisation");
  };

  const handleSupport = () => {
    Alert.alert(
      "Support",
      "Pour obtenir de l'aide, contactez : support@c-management.fr",
    );
  };

  return {
    handleLogout,
    handleClearData,
    handleExportData,
    handleGradeScaleChange,
    handleAboutInfo,
    handleSupport,
  };
}
