/**
 * Écran Paramètres - Configuration de l'application C-management
 * Permet de gérer les préférences utilisateur, paramètres système et configuration
 */
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Shield,
  Database,
  Download,
  Trash2,
  LogOut,
  Info,
  Mail,
  BarChart3,
  FileText,
  Smartphone,
} from "lucide-react-native";
import { SettingSection } from "@/components/Settings/SettingSection";
import { SettingRow } from "@/components/Settings/SettingRow";
import { ProfileSection } from "@/components/Settings/ProfileSection";
import { ProfileModal } from "@/components/Settings/ProfileModal";
import { WeightsModal } from "@/components/Settings/WeightsModal";
import { AboutModal } from "@/components/Settings/AboutModal";
import { useSettingsState } from "@/utils/settings/useSettingsState";
import { useSettingsHandlers } from "@/utils/settings/useSettingsHandlers";
import { APP_CONFIG, SDK_REQUIREMENTS } from "@/utils/constants";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
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
  } = useSettingsState();

  const {
    handleLogout,
    handleClearData,
    handleExportData,
    handleGradeScaleChange,
    handleAboutInfo,
    handleSupport,
  } = useSettingsHandlers();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
      }}
    >
      <StatusBar style="light" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#D4AF37",
              marginBottom: 8,
            }}
          >
            Paramètres
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#CCCCCC",
            }}
          >
            Configuration de C-management
          </Text>
        </View>

        {/* Profile Section */}
        <SettingSection title="Profil">
          <ProfileSection
            userProfile={userProfile}
            onPress={openProfileModal}
          />
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="Apparence">
          <SettingRow
            title="Thème"
            subtitle="Mode sombre activé"
            icon={settings.theme === "dark" ? Moon : Sun}
            rightComponent={
              <Switch
                value={settings.theme === "dark"}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    theme: value ? "dark" : "light",
                  }))
                }
                thumbColor={settings.theme === "dark" ? "#D4AF37" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#D4AF37" }}
              />
            }
            showChevron={false}
            isLast={true}
          />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications">
          <SettingRow
            title="Notifications push"
            subtitle="Alertes en temps réel"
            icon={Bell}
            rightComponent={
              <Switch
                value={settings.pushNotifications}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    pushNotifications: value,
                  }))
                }
                thumbColor={settings.pushNotifications ? "#D4AF37" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#D4AF37" }}
              />
            }
            showChevron={false}
          />
          <SettingRow
            title="Notifications email"
            subtitle="Recevoir les résumés par email"
            icon={Mail}
            rightComponent={
              <Switch
                value={settings.emailNotifications}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    emailNotifications: value,
                  }))
                }
                thumbColor={settings.emailNotifications ? "#D4AF37" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#D4AF37" }}
              />
            }
            showChevron={false}
            isLast={true}
          />
        </SettingSection>

        {/* Academic Settings */}
        <SettingSection title="Paramètres académiques">
          <SettingRow
            title="Barème par défaut"
            subtitle={`Notes sur ${settings.defaultGradeScale}`}
            icon={BarChart3}
            onPress={() => handleGradeScaleChange(setSettings)}
          />
          <SettingRow
            title="Coefficients par défaut"
            subtitle={`Devoirs: ${settings.defaultWeights.devoirs}% • Examens: ${settings.defaultWeights.examens}%`}
            icon={SettingsIcon}
            onPress={openWeightsModal}
            isLast={true}
          />
        </SettingSection>

        {/* Data & Sync */}
        <SettingSection title="Données & Synchronisation">
          <SettingRow
            title="Synchronisation automatique"
            subtitle="Synchroniser avec le serveur"
            icon={Database}
            rightComponent={
              <Switch
                value={settings.autoSync}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    autoSync: value,
                  }))
                }
                thumbColor={settings.autoSync ? "#D4AF37" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#D4AF37" }}
              />
            }
            showChevron={false}
          />
          <SettingRow
            title="Exporter les données"
            subtitle="Télécharger en CSV"
            icon={Download}
            onPress={handleExportData}
          />
          <SettingRow
            title="Effacer les données locales"
            subtitle="Supprimer toutes les données"
            icon={Trash2}
            onPress={handleClearData}
            isLast={true}
          />
        </SettingSection>

        {/* Security */}
        <SettingSection title="Sécurité">
          <SettingRow
            title="Se souvenir de la connexion"
            subtitle="Connexion automatique"
            icon={Shield}
            rightComponent={
              <Switch
                value={settings.rememberLogin}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    rememberLogin: value,
                  }))
                }
                thumbColor={settings.rememberLogin ? "#D4AF37" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#D4AF37" }}
              />
            }
            showChevron={false}
            isLast={true}
          />
        </SettingSection>

        {/* About & Support */}
        <SettingSection title="À propos">
          <SettingRow
            title="Version de l'app"
            subtitle={`${APP_CONFIG.version} (Expo SDK ${SDK_REQUIREMENTS.expo})`}
            icon={Smartphone}
            onPress={() => setShowAboutModal(true)}
          />
          <SettingRow
            title="Informations légales"
            subtitle="Mentions légales et CGU"
            icon={FileText}
            onPress={handleAboutInfo}
          />
          <SettingRow
            title="Contact & Support"
            subtitle="Obtenir de l'aide"
            icon={Info}
            onPress={handleSupport}
            isLast={true}
          />
        </SettingSection>

        {/* Logout */}
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: "#E63946",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOut color="#FFFFFF" size={20} style={{ marginRight: 8 }} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#FFFFFF",
              }}
            >
              Se déconnecter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        editingProfile={editingProfile}
        setEditingProfile={setEditingProfile}
        onSave={handleSaveProfile}
      />
      <WeightsModal
        visible={showWeightsModal}
        onClose={() => setShowWeightsModal(false)}
        editingWeights={editingWeights}
        setEditingWeights={setEditingWeights}
        onSave={handleSaveWeights}
      />
      <AboutModal
        visible={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
    </View>
  );
}
