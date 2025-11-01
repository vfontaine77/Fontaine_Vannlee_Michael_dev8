/**
 * Écran Statistiques - Graphiques détaillés et analyses
 * Affiche des statistiques avancées avec graphiques interactifs sur les performances scolaires
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
import { LineGraph } from "react-native-graph";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Target,
  Award,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react-native";

const { width: screenWidth } = Dimensions.get("window");
const graphWidth = screenWidth - 40;

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedPeriod, setSelectedPeriod] = useState("trimestre");
  const [selectedMetric, setSelectedMetric] = useState("grades");
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    gradeEvolution: [],
    classComparison: [],
    subjectAnalysis: [],
    attendanceData: [],
    globalStats: {},
  });

  useEffect(() => {
    loadStatistics();
  }, [selectedPeriod, selectedMetric]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Données simulées pour les graphiques
      const mockData = {
        gradeEvolution: [
          { date: new Date("2024-09-01"), value: 12.5 },
          { date: new Date("2024-09-15"), value: 13.1 },
          { date: new Date("2024-10-01"), value: 13.8 },
          { date: new Date("2024-10-15"), value: 13.2 },
          { date: new Date("2024-11-01"), value: 14.5 },
          { date: new Date("2024-11-15"), value: 14.8 },
          { date: new Date("2024-12-01"), value: 15.2 },
          { date: new Date("2024-12-15"), value: 14.9 },
          { date: new Date("2025-01-01"), value: 15.5 },
        ],
        classComparison: [
          { name: "6ème A", average: 13.5, students: 28, color: "#4ECDC4" },
          { name: "5ème B", average: 14.2, students: 25, color: "#FF6B6B" },
          { name: "4ème A", average: 12.8, students: 32, color: "#9B59B6" },
          { name: "3ème A", average: 15.1, students: 30, color: "#F39C12" },
          { name: "Term S", average: 16.3, students: 18, color: "#2ECC71" },
        ],
        attendanceData: [
          { date: new Date("2024-09-01"), value: 92 },
          { date: new Date("2024-09-15"), value: 89 },
          { date: new Date("2024-10-01"), value: 95 },
          { date: new Date("2024-10-15"), value: 88 },
          { date: new Date("2024-11-01"), value: 93 },
          { date: new Date("2024-11-15"), value: 91 },
          { date: new Date("2024-12-01"), value: 87 },
          { date: new Date("2024-12-15"), value: 94 },
          { date: new Date("2025-01-01"), value: 96 },
        ],
        subjectAnalysis: [
          {
            subject: "Mathématiques",
            average: 14.2,
            trend: "up",
            improvement: 0.8,
          },
          { subject: "Français", average: 13.8, trend: "up", improvement: 0.3 },
          {
            subject: "Histoire-Géo",
            average: 15.1,
            trend: "down",
            improvement: -0.2,
          },
          { subject: "Sciences", average: 13.5, trend: "up", improvement: 1.2 },
          { subject: "Anglais", average: 14.9, trend: "up", improvement: 0.6 },
          {
            subject: "Arts Plastiques",
            average: 16.2,
            trend: "stable",
            improvement: 0.1,
          },
        ],
        globalStats: {
          totalStudents: 234,
          averageGrade: 14.2,
          attendanceRate: 92.5,
          improvementRate: 78,
          topPerformers: 45,
          needSupport: 23,
        },
      };

      setStatistics(mockData);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setLoading(false);
      Alert.alert("Erreur", "Impossible de charger les statistiques");
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <View
      style={{
        backgroundColor: "#1A1A1A",
        borderRadius: 16,
        padding: 20,
        margin: 6,
        flex: 1,
        borderWidth: 1,
        borderColor: "#333333",
        minWidth: (screenWidth - 48) / 2 - 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Icon color={color} size={24} />
        {trend && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {trend === "up" ? (
              <TrendingUp color="#4CAF50" size={16} />
            ) : trend === "down" ? (
              <TrendingDown color="#E63946" size={16} />
            ) : null}
          </View>
        )}
      </View>
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
          marginBottom: subtitle ? 4 : 0,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontSize: 10,
            color: color,
            fontWeight: "600",
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );

  const GraphContainer = ({ title, children, info }) => (
    <View
      style={{
        backgroundColor: "#1A1A1A",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#333333",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#FFFFFF",
          }}
        >
          {title}
        </Text>
        {info && (
          <Text
            style={{
              fontSize: 12,
              color: "#888888",
            }}
          >
            {info}
          </Text>
        )}
      </View>
      {children}
    </View>
  );

  const ClassComparisonBar = ({ classData }) => {
    const maxAverage = Math.max(
      ...statistics.classComparison.map((c) => c.average),
    );
    const barWidth = (classData.average / maxAverage) * 100;

    return (
      <View
        style={{
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#FFFFFF",
            }}
          >
            {classData.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: classData.color,
            }}
          >
            {classData.average.toFixed(1)}
          </Text>
        </View>
        <View
          style={{
            height: 8,
            backgroundColor: "#333333",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${barWidth}%`,
              backgroundColor: classData.color,
              borderRadius: 4,
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 12,
            color: "#888888",
            marginTop: 4,
          }}
        >
          {classData.students} élèves
        </Text>
      </View>
    );
  };

  const SubjectCard = ({ subject }) => (
    <View
      style={{
        backgroundColor: "#000000",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#333333",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
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
            {subject.subject}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#CCCCCC",
            }}
          >
            Moyenne: {subject.average.toFixed(1)}/20
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            {subject.trend === "up" ? (
              <TrendingUp color="#4CAF50" size={16} />
            ) : subject.trend === "down" ? (
              <TrendingDown color="#E63946" size={16} />
            ) : (
              <View
                style={{
                  width: 16,
                  height: 2,
                  backgroundColor: "#888888",
                }}
              />
            )}
            <Text
              style={{
                fontSize: 12,
                color:
                  subject.trend === "up"
                    ? "#4CAF50"
                    : subject.trend === "down"
                      ? "#E63946"
                      : "#888888",
                marginLeft: 4,
                fontWeight: "600",
              }}
            >
              {subject.improvement > 0 ? "+" : ""}
              {subject.improvement.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar style="light" />
        <RefreshCw color="#D4AF37" size={32} />
        <Text style={{ color: "#D4AF37", fontSize: 16, marginTop: 16 }}>
          Calcul des statistiques...
        </Text>
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
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#D4AF37",
              }}
            >
              Statistiques
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#CCCCCC",
                marginTop: 4,
              }}
            >
              Analyses détaillées
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#1A1A1A",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderWidth: 1,
              borderColor: "#D4AF37",
            }}
          >
            <Download color="#D4AF37" size={16} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#D4AF37",
              }}
            >
              Export
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filtres de période */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 24,
            gap: 8,
          }}
        >
          {["semaine", "mois", "trimestre", "année"].map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={{
                backgroundColor:
                  selectedPeriod === period ? "#D4AF37" : "#1A1A1A",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: selectedPeriod === period ? "#D4AF37" : "#333333",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: selectedPeriod === period ? "#000000" : "#FFFFFF",
                  textTransform: "capitalize",
                }}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Statistiques globales */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginHorizontal: -6,
            marginBottom: 20,
          }}
        >
          <StatCard
            title="Élèves total"
            value={statistics.globalStats.totalStudents}
            icon={Users}
            color="#4ECDC4"
          />
          <StatCard
            title="Moyenne générale"
            value={statistics.globalStats.averageGrade?.toFixed(1)}
            icon={Target}
            color="#D4AF37"
            trend="up"
          />
          <StatCard
            title="Taux présence"
            value={`${statistics.globalStats.attendanceRate}%`}
            icon={Calendar}
            color="#2ECC71"
            trend="up"
          />
          <StatCard
            title="En progression"
            value={`${statistics.globalStats.improvementRate}%`}
            icon={TrendingUp}
            color="#4CAF50"
            subtitle="des élèves"
          />
        </View>

        {/* Évolution des notes */}
        <GraphContainer
          title="Évolution de la moyenne générale"
          info="Notes sur 20"
        >
          <View style={{ height: 200, marginBottom: 16 }}>
            <LineGraph
              points={statistics.gradeEvolution}
              color="#D4AF37"
              animated={true}
              enablePanGesture={true}
              gradientFillColors={[
                "rgba(212, 175, 55, 0.2)",
                "rgba(212, 175, 55, 0)",
              ]}
              style={{ width: "100%", height: "100%" }}
              width={graphWidth - 40}
              height={200}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 12,
                  height: 3,
                  backgroundColor: "#D4AF37",
                  marginRight: 8,
                }}
              />
              <Text style={{ fontSize: 12, color: "#888888" }}>
                Moyenne des notes
              </Text>
            </View>
          </View>
        </GraphContainer>

        {/* Taux de présence */}
        <GraphContainer title="Taux de présence" info="Pourcentage">
          <View style={{ height: 180, marginBottom: 16 }}>
            <LineGraph
              points={statistics.attendanceData}
              color="#4ECDC4"
              animated={true}
              enablePanGesture={true}
              gradientFillColors={[
                "rgba(78, 205, 196, 0.2)",
                "rgba(78, 205, 196, 0)",
              ]}
              style={{ width: "100%", height: "100%" }}
              width={graphWidth - 40}
              height={180}
            />
          </View>
        </GraphContainer>

        {/* Comparaison des classes */}
        <GraphContainer title="Comparaison des classes">
          {statistics.classComparison.map((classData, index) => (
            <ClassComparisonBar key={index} classData={classData} />
          ))}
        </GraphContainer>

        {/* Analyse par matière */}
        <GraphContainer title="Performance par matière">
          {statistics.subjectAnalysis.map((subject, index) => (
            <SubjectCard key={index} subject={subject} />
          ))}
        </GraphContainer>

        {/* Alertes et recommandations */}
        <View
          style={{
            backgroundColor: "#1A1A1A",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#333333",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Award color="#F39C12" size={24} style={{ marginRight: 12 }} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#FFFFFF",
              }}
            >
              Points d'attention
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#2A1810",
              borderLeftWidth: 4,
              borderLeftColor: "#F39C12",
              padding: 16,
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#F39C12",
                marginBottom: 4,
              }}
            >
              Excellent progrès global
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#CCCCCC",
                lineHeight: 18,
              }}
            >
              78% des élèves sont en progression. La moyenne générale a augmenté
              de 0.8 point ce trimestre.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#1A1420",
              borderLeftWidth: 4,
              borderLeftColor: "#9B59B6",
              padding: 16,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#9B59B6",
                marginBottom: 4,
              }}
            >
              Attention requise
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#CCCCCC",
                lineHeight: 18,
              }}
            >
              23 élèves nécessitent un accompagnement renforcé. Considérer des
              sessions de soutien.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
