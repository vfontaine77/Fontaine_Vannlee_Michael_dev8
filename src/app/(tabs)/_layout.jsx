/**
 * Layout de navigation principale avec tabs pour C-management
 * Application de gestion scolaire ultra-élégante en Noir & Or
 */
import { Tabs } from "expo-router";
import {
  Home,
  Users,
  Calendar,
  BarChart3,
  Mic,
  FileText,
  Settings,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000000", // Noir
          borderTopWidth: 1,
          borderColor: "#D4AF37", // Or
          paddingBottom: insets.bottom > 0 ? insets.bottom - 10 : 4,
          paddingTop: 8,
          height: insets.bottom > 0 ? 90 : 70,
        },
        tabBarActiveTintColor: "#D4AF37", // Or
        tabBarInactiveTintColor: "#666666",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Home color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="classes"
        options={{
          title: "Classes",
          tabBarIcon: ({ color, size }) => <Users color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendrier",
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistiques",
          tabBarIcon: ({ color, size }) => (
            <BarChart3 color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="recordings"
        options={{
          title: "Cours",
          tabBarIcon: ({ color, size }) => <Mic color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Bulletins",
          tabBarIcon: ({ color, size }) => <FileText color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Paramètres",
          tabBarIcon: ({ color, size }) => <Settings color={color} size={20} />,
        }}
      />

      {/* Routes cachées */}
      <Tabs.Screen
        name="student/[id]"
        options={{
          href: null, // Cache cet onglet
        }}
      />
      <Tabs.Screen
        name="class/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="grade-editor"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
