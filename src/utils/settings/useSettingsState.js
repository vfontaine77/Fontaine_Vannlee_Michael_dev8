import { useState } from "react";
import { Alert } from "react-native";

export function useSettingsState() {
  const [userProfile, setUserProfile] = useState({
    name: "Marie Dubois",
    email: "marie.dubois@college-exemple.fr",
    role: "Professeure Principal",
    phone: "+33 6 12 34 56 78",
    avatar: null,
    institution: "Collège Jean Moulin",
  });

  const [settings, setSettings] = useState({
    theme: "dark", // 'light', 'dark', 'system'
    notifications: true,
    pushNotifications: true,
    emailNotifications: true,
    autoSync: true,
    offlineMode: false,
    defaultGradeScale: "20", // '20', '100', 'letter'
    defaultWeights: {
      devoirs: 40,
      examens: 60,
    },
    language: "fr",
    autoBackup: true,
    rememberLogin: true,
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWeightsModal, setShowWeightsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState({ ...userProfile });
  const [editingWeights, setEditingWeights] = useState({
    ...settings.defaultWeights,
  });

  const handleSaveProfile = () => {
    setUserProfile({ ...editingProfile });
    setShowProfileModal(false);
    Alert.alert("Succès", "Profil mis à jour avec succès");
  };

  const handleSaveWeights = () => {
    if (editingWeights.devoirs + editingWeights.examens !== 100) {
      Alert.alert("Erreur", "La somme des coefficients doit égaler 100%");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      defaultWeights: { ...editingWeights },
    }));
    setShowWeightsModal(false);
    Alert.alert("Succès", "Coefficients mis à jour avec succès");
  };

  const openProfileModal = () => {
    setEditingProfile({ ...userProfile });
    setShowProfileModal(true);
  };

  const openWeightsModal = () => {
    setEditingWeights({ ...settings.defaultWeights });
    setShowWeightsModal(true);
  };

  return {
    userProfile,
    settings,
    setSettings,
    showProfileModal,
    setShowProfileModal,
    showWeightsModal,
    setShowWeightsModal,
    showAboutModal,
    setShowAboutModal,
    editingProfile,
    setEditingProfile,
    editingWeights,
    setEditingWeights,
    handleSaveProfile,
    handleSaveWeights,
    openProfileModal,
    openWeightsModal,
  };
}
