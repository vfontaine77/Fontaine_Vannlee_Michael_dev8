/**
 * Écran d'accueil - Dashboard principal de C-management
 * Affiche les statistiques rapides et les accès rapides aux fonctionnalités principales
 */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Mic,
  FileText,
  Clock,
  TrendingUp,
  Bell,
  ChevronRight,
} from "lucide-react-native";
import { Image } from "expo-image";

const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalClasses: 0,
    averageGrade: 0,
    nextEvents: [],
    recentRecordings: [],
    unreadNotifications: 0,
    loading: true,
  });

  // Charger les données du dashboard
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulation des données - remplacer par des appels API réels
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDashboardData({
        totalStudents: 234,
        totalClasses: 12,
        averageGrade: 14.2,
        nextEvents: [
          {
            id: 1,
            title: "Examen Mathématiques",
            date: "2025-01-15",
            type: "exam",
          },
          {
            id: 2,
            title: "Réunion Parents 3ème A",
            date: "2025-01-18",
            type: "meeting",
          },
          {
            id: 3,
            title: "Remise des bulletins",
            date: "2025-01-22",
            type: "delivery",
          },
        ],
        recentRecordings: [
          {
            id: 1,
            subject: "Physique",
            class: "2nde B",
            duration: "45 min",
            date: "Hier",
          },
          {
            id: 2,
            subject: "Histoire",
            class: "3ème A",
            duration: "38 min",
            date: "Avant-hier",
          },
        ],
        unreadNotifications: 5,
        loading: false,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      setDashboardData((prev) => ({ ...prev, loading: false }));
      Alert.alert(
        "Erreur",
        "Impossible de charger les données du tableau de bord",
      );
    }
  };

  const QuickActionCard = ({ title, icon: Icon, color, onPress, subtitle }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#1A1A1A",
        borderRadius: 16,
        padding: 20,
        margin: 6,
        flex: 1,
        minHeight: 120,
        borderWidth: 1,
        borderColor: "#D4AF37",
        shadowColor: "#D4AF37",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      <Icon color={color} size={28} style={{ marginBottom: 12 }} />
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#FFFFFF",
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontSize: 12,
            color: "#888888",
          }}
        >
          {subtitle}
        </Text>
      )}
      <ChevronRight
        color="#D4AF37"
        size={20}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
      />
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <View
      style={{
        backgroundColor: "#000000",
        borderRadius: 16,
        padding: 20,
        margin: 6,
        flex: 1,
        borderWidth: 1,
        borderColor: "#D4AF37",
        alignItems: "center",
      }}
    >
      <Icon color="#D4AF37" size={24} style={{ marginBottom: 8 }} />
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#FFFFFF",
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: "#CCCCCC",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      {trend && (
        <TrendingUp color="#4CAF50" size={16} style={{ marginTop: 4 }} />
      )}
    </View>
  );

  if (dashboardData.loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: insets.top,
        }}
      >
        <StatusBar style="light" />
        <Text style={{ color: "#D4AF37", fontSize: 16 }}>Chargement...</Text>
      </View>
    );
  }

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
        {/* Header avec logo */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#D4AF37",
                letterSpacing: 1,
              }}
            >
              C-management
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#CCCCCC",
                marginTop: 4,
              }}
            >
              Tableau de bord
            </Text>
          </View>

          {dashboardData.unreadNotifications > 0 && (
            <TouchableOpacity
              style={{
                position: "relative",
                padding: 12,
                backgroundColor: "#1A1A1A",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#D4AF37",
              }}
            >
              <Bell color="#D4AF37" size={24} />
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "#E63946",
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {dashboardData.unreadNotifications}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Statistiques rapides */}
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#FFFFFF",
              marginBottom: 16,
            }}
          >
            Statistiques rapides
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginHorizontal: -6,
            }}
          >
            <StatCard
              title="Élèves"
              value={dashboardData.totalStudents}
              icon={Users}
              trend={true}
            />
            <StatCard
              title="Classes"
              value={dashboardData.totalClasses}
              icon={BookOpen}
            />
            <StatCard
              title="Moyenne générale"
              value={dashboardData.averageGrade.toFixed(1)}
              icon={BarChart3}
              trend={true}
            />
          </View>
        </View>

        {/* Actions rapides */}
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#FFFFFF",
              marginBottom: 16,
            }}
          >
            Accès rapide
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginHorizontal: -6,
            }}
          >
            <QuickActionCard
              title="Mes Classes"
              icon={Users}
              color="#D4AF37"
              subtitle="Gérer les élèves"
              onPress={() => router.push("/(tabs)/classes")}
            />
            <QuickActionCard
              title="Calendrier"
              icon={Calendar}
              color="#4ECDC4"
              subtitle="Événements & Examens"
              onPress={() => router.push("/(tabs)/calendar")}
            />
            <QuickActionCard
              title="Statistiques"
              icon={BarChart3}
              color="#FF6B6B"
              subtitle="Graphiques détaillés"
              onPress={() => router.push("/(tabs)/statistics")}
            />
            <QuickActionCard
              title="Enregistrements"
              icon={Mic}
              color="#9B59B6"
              subtitle="Cours audio"
              onPress={() => router.push("/(tabs)/recordings")}
            />
          </View>
        </View>

        {/* Prochains événements */}
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#FFFFFF",
              marginBottom: 16,
            }}
          >
            Prochains événements
          </Text>
          {dashboardData.nextEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={{
                backgroundColor: "#1A1A1A",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                borderLeftWidth: 4,
                borderLeftColor:
                  event.type === "exam"
                    ? "#E63946"
                    : event.type === "meeting"
                      ? "#4ECDC4"
                      : "#D4AF37",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#FFFFFF",
                    marginBottom: 4,
                  }}
                >
                  {event.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#CCCCCC",
                  }}
                >
                  {event.date}
                </Text>
              </View>
              <Clock color="#888888" size={16} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Enregistrements récents */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#FFFFFF",
              marginBottom: 16,
            }}
          >
            Cours récents
          </Text>
          {dashboardData.recentRecordings.map((recording) => (
            <TouchableOpacity
              key={recording.id}
              style={{
                backgroundColor: "#1A1A1A",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => router.push("/(tabs)/recordings")}
            >
              <View
                style={{
                  backgroundColor: "#9B59B6",
                  borderRadius: 8,
                  padding: 8,
                  marginRight: 12,
                }}
              >
                <Mic color="#FFFFFF" size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#FFFFFF",
                    marginBottom: 2,
                  }}
                >
                  {recording.subject} - {recording.class}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#CCCCCC",
                  }}
                >
                  {recording.duration} • {recording.date}
                </Text>
              </View>
              <ChevronRight color="#888888" size={20} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
