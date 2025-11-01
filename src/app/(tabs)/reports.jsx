/**
 * Écran Reports - Génération et gestion des bulletins scolaires
 * Permet de générer, personnaliser et exporter les bulletins de notes avec QR codes
 */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  FileText,
  Download,
  Share2,
  QrCode,
  Filter,
  Calendar,
  User,
  GraduationCap,
  BarChart3,
  Eye,
  Send,
  Printer,
  Search,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react-native";

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all"); // 'all', 'trimestre1', 'trimestre2', 'trimestre3'
  const [selectedClass, setSelectedClass] = useState("all");
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const [newReport, setNewReport] = useState({
    title: "",
    period: "trimestre1",
    class: "",
    includeGrades: true,
    includeComments: true,
    includeAttendance: true,
    includeCharts: true,
    template: "standard",
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Données simulées de bulletins
      const mockReports = [
        {
          id: 1,
          title: "Bulletin 1er Trimestre - 3ème A",
          period: "Trimestre 1 2024-2025",
          class: "3ème A",
          studentsCount: 30,
          status: "completed",
          createdDate: "2024-12-15",
          sentDate: "2024-12-20",
          downloadCount: 45,
          qrCode: "https://example.com/qr/bulletin1",
          averageGrade: 14.2,
          template: "standard",
        },
        {
          id: 2,
          title: "Bulletin 1er Trimestre - 4ème B",
          period: "Trimestre 1 2024-2025",
          class: "4ème B",
          studentsCount: 28,
          status: "completed",
          createdDate: "2024-12-14",
          sentDate: "2024-12-19",
          downloadCount: 38,
          qrCode: "https://example.com/qr/bulletin2",
          averageGrade: 13.8,
          template: "standard",
        },
        {
          id: 3,
          title: "Bulletin 2ème Trimestre - 3ème A",
          period: "Trimestre 2 2024-2025",
          class: "3ème A",
          studentsCount: 30,
          status: "generating",
          createdDate: "2025-01-10",
          sentDate: null,
          downloadCount: 0,
          qrCode: null,
          averageGrade: null,
          template: "detailed",
        },
        {
          id: 4,
          title: "Bulletin 1er Trimestre - 5ème A",
          period: "Trimestre 1 2024-2025",
          class: "5ème A",
          studentsCount: 25,
          status: "draft",
          createdDate: "2024-12-10",
          sentDate: null,
          downloadCount: 0,
          qrCode: null,
          averageGrade: 15.1,
          template: "minimal",
        },
      ];

      setReports(mockReports);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des bulletins:", error);
      setLoading(false);
      Alert.alert("Erreur", "Impossible de charger les bulletins");
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.class.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPeriod =
      selectedPeriod === "all" ||
      report.period.toLowerCase().includes(selectedPeriod);
    const matchesClass =
      selectedClass === "all" || report.class === selectedClass;

    return matchesSearch && matchesPeriod && matchesClass;
  });

  const handleGenerateReport = async () => {
    if (!newReport.title || !newReport.class) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const reportData = {
        id: reports.length + 1,
        title: newReport.title,
        period: getPeriodLabel(newReport.period),
        class: newReport.class,
        studentsCount: 30, // Simulé
        status: "generating",
        createdDate: new Date().toISOString().split("T")[0],
        sentDate: null,
        downloadCount: 0,
        qrCode: null,
        averageGrade: null,
        template: newReport.template,
      };

      setReports([reportData, ...reports]);
      setShowGenerateModal(false);
      setNewReport({
        title: "",
        period: "trimestre1",
        class: "",
        includeGrades: true,
        includeComments: true,
        includeAttendance: true,
        includeCharts: true,
        template: "standard",
      });

      Alert.alert("Succès", "Génération du bulletin lancée !");

      // Simuler la génération
      setTimeout(() => {
        setReports((prev) =>
          prev.map((r) =>
            r.id === reportData.id
              ? {
                  ...r,
                  status: "completed",
                  qrCode: `https://example.com/qr/bulletin${r.id}`,
                  averageGrade: 14.5,
                }
              : r,
          ),
        );
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      Alert.alert("Erreur", "Impossible de générer le bulletin");
    }
  };

  const handleShareReport = async (report) => {
    try {
      await Share.share({
        message: `Bulletin ${report.title} - Classe ${report.class}\nMoyenne: ${report.averageGrade}/20\nTélécharger: ${report.qrCode}`,
        title: "Bulletin scolaire",
        url: report.qrCode,
      });
    } catch (error) {
      console.error("Erreur lors du partage:", error);
      Alert.alert("Erreur", "Impossible de partager le bulletin");
    }
  };

  const handleDownloadReport = async (report) => {
    Alert.alert(
      "Téléchargement",
      `Le bulletin ${report.title} va être téléchargé.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Télécharger",
          onPress: () => {
            // Simuler le téléchargement
            Alert.alert("Succès", "Bulletin téléchargé avec succès !");
          },
        },
      ],
    );
  };

  const getPeriodLabel = (period) => {
    const labels = {
      trimestre1: "Trimestre 1 2024-2025",
      trimestre2: "Trimestre 2 2024-2025",
      trimestre3: "Trimestre 3 2024-2025",
    };
    return labels[period] || period;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "#4CAF50",
      generating: "#F39C12",
      draft: "#888888",
      error: "#E63946",
    };
    return colors[status] || "#888888";
  };

  const getStatusLabel = (status) => {
    const labels = {
      completed: "Terminé",
      generating: "En cours...",
      draft: "Brouillon",
      error: "Erreur",
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "generating":
        return Clock;
      case "error":
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const ReportCard = ({ report }) => {
    const StatusIcon = getStatusIcon(report.status);

    return (
      <View
        style={{
          backgroundColor: "#1A1A1A",
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#333333",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            {/* En-tête */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  backgroundColor: "#D4AF37",
                  borderRadius: 8,
                  padding: 6,
                  marginRight: 12,
                }}
              >
                <FileText color="#000000" size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    marginBottom: 2,
                  }}
                >
                  {report.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#CCCCCC",
                  }}
                >
                  {report.period} • {report.studentsCount} élèves
                </Text>
              </View>
            </View>

            {/* Statut */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <StatusIcon color={getStatusColor(report.status)} size={16} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: getStatusColor(report.status),
                  marginLeft: 6,
                }}
              >
                {getStatusLabel(report.status)}
              </Text>
            </View>

            {/* Informations */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Calendar color="#888888" size={14} />
                <Text
                  style={{
                    fontSize: 12,
                    color: "#888888",
                    marginLeft: 4,
                  }}
                >
                  Créé le {formatDate(report.createdDate)}
                </Text>
              </View>

              {report.averageGrade && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <BarChart3 color="#888888" size={14} />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#888888",
                      marginLeft: 4,
                    }}
                  >
                    Moyenne: {report.averageGrade}/20
                  </Text>
                </View>
              )}

              {report.downloadCount > 0 && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Download color="#888888" size={14} />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#888888",
                      marginLeft: 4,
                    }}
                  >
                    {report.downloadCount} téléchargements
                  </Text>
                </View>
              )}
            </View>

            {/* QR Code disponible */}
            {report.qrCode && (
              <View
                style={{
                  backgroundColor: "#2A1810",
                  borderRadius: 8,
                  padding: 8,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <QrCode color="#F39C12" size={16} />
                <Text
                  style={{
                    fontSize: 12,
                    color: "#F39C12",
                    fontWeight: "600",
                    marginLeft: 6,
                  }}
                >
                  QR Code de vérification disponible
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", gap: 8 }}>
            {report.status === "completed" && (
              <>
                <TouchableOpacity
                  onPress={() => handleDownloadReport(report)}
                  style={{
                    backgroundColor: "#D4AF37",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Download color="#000000" size={14} />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: "#000000",
                    }}
                  >
                    Télécharger
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleShareReport(report)}
                  style={{
                    backgroundColor: "#4ECDC4",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Share2 color="#000000" size={14} />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: "#000000",
                    }}
                  >
                    Partager
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {report.status === "draft" && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#9B59B6",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Eye color="#FFFFFF" size={14} />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#FFFFFF",
                  }}
                >
                  Prévisualiser
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/student/${report.id}`)}
            style={{
              backgroundColor: "#333333",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#FFFFFF",
              }}
            >
              Détails
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const GenerateModal = () => (
    <Modal
      visible={showGenerateModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowGenerateModal(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <ScrollView
          style={{
            backgroundColor: "#1A1A1A",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "80%",
          }}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FFFFFF",
              }}
            >
              Nouveau Bulletin
            </Text>
            <TouchableOpacity onPress={() => setShowGenerateModal(false)}>
              <Text style={{ color: "#888888", fontSize: 24 }}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 16 }}>
            {/* Titre */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#CCCCCC",
                  marginBottom: 8,
                }}
              >
                Titre du bulletin *
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#000000",
                  borderWidth: 1,
                  borderColor: "#333333",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
                value={newReport.title}
                onChangeText={(text) =>
                  setNewReport((prev) => ({ ...prev, title: text }))
                }
                placeholder="Ex: Bulletin 2ème Trimestre - 3ème A"
                placeholderTextColor="#666666"
              />
            </View>

            {/* Période et Classe */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#CCCCCC",
                    marginBottom: 8,
                  }}
                >
                  Période
                </Text>
                <View
                  style={{
                    backgroundColor: "#000000",
                    borderWidth: 1,
                    borderColor: "#333333",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
                    {getPeriodLabel(newReport.period)}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#CCCCCC",
                    marginBottom: 8,
                  }}
                >
                  Classe *
                </Text>
                <TextInput
                  style={{
                    backgroundColor: "#000000",
                    borderWidth: 1,
                    borderColor: "#333333",
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                  value={newReport.class}
                  onChangeText={(text) =>
                    setNewReport((prev) => ({ ...prev, class: text }))
                  }
                  placeholder="3ème A"
                  placeholderTextColor="#666666"
                />
              </View>
            </View>

            {/* Template */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#CCCCCC",
                  marginBottom: 8,
                }}
              >
                Modèle de bulletin
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {[
                  {
                    key: "standard",
                    label: "Standard",
                    desc: "Notes et moyennes",
                  },
                  {
                    key: "detailed",
                    label: "Détaillé",
                    desc: "Avec graphiques",
                  },
                  { key: "minimal", label: "Minimal", desc: "Simplifié" },
                ].map((template) => (
                  <TouchableOpacity
                    key={template.key}
                    onPress={() =>
                      setNewReport((prev) => ({
                        ...prev,
                        template: template.key,
                      }))
                    }
                    style={{
                      backgroundColor:
                        newReport.template === template.key
                          ? "#D4AF37"
                          : "#333333",
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 12,
                      flex: 1,
                      minWidth: "30%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color:
                          newReport.template === template.key
                            ? "#000000"
                            : "#FFFFFF",
                        textAlign: "center",
                        marginBottom: 2,
                      }}
                    >
                      {template.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color:
                          newReport.template === template.key
                            ? "#666666"
                            : "#888888",
                        textAlign: "center",
                      }}
                    >
                      {template.desc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Options d'inclusion */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#CCCCCC",
                  marginBottom: 12,
                }}
              >
                Contenu à inclure
              </Text>
              <View style={{ gap: 8 }}>
                {[
                  {
                    key: "includeGrades",
                    label: "Notes et moyennes",
                    icon: BarChart3,
                  },
                  {
                    key: "includeComments",
                    label: "Commentaires professeurs",
                    icon: FileText,
                  },
                  {
                    key: "includeAttendance",
                    label: "Données de présence",
                    icon: Calendar,
                  },
                  {
                    key: "includeCharts",
                    label: "Graphiques statistiques",
                    icon: BarChart3,
                  },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() =>
                      setNewReport((prev) => ({
                        ...prev,
                        [option.key]: !prev[option.key],
                      }))
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: newReport[option.key]
                        ? "#1A2A1A"
                        : "#1A1A1A",
                      borderWidth: 1,
                      borderColor: newReport[option.key]
                        ? "#4CAF50"
                        : "#333333",
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <option.icon
                      color={newReport[option.key] ? "#4CAF50" : "#888888"}
                      size={16}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: newReport[option.key] ? "#4CAF50" : "#CCCCCC",
                        marginLeft: 12,
                        flex: 1,
                      }}
                    >
                      {option.label}
                    </Text>
                    <CheckCircle
                      color={newReport[option.key] ? "#4CAF50" : "#333333"}
                      size={20}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 24,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowGenerateModal(false)}
              style={{
                flex: 1,
                backgroundColor: "#333333",
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#FFFFFF",
                }}
              >
                Annuler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGenerateReport}
              style={{
                flex: 1,
                backgroundColor: "#D4AF37",
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#000000",
                }}
              >
                Générer
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
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
              Bulletins
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#CCCCCC",
                marginTop: 4,
              }}
            >
              {filteredReports.length} bulletin
              {filteredReports.length !== 1 ? "s" : ""}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowGenerateModal(true)}
            style={{
              backgroundColor: "#D4AF37",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Plus color="#000000" size={20} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#000000",
              }}
            >
              Nouveau
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View
          style={{
            backgroundColor: "#1A1A1A",
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#333333",
          }}
        >
          <Search color="#666666" size={20} />
          <TextInput
            style={{
              flex: 1,
              paddingVertical: 16,
              paddingHorizontal: 12,
              fontSize: 16,
              color: "#FFFFFF",
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher un bulletin..."
            placeholderTextColor="#666666"
          />
        </View>

        {/* Filtres */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 24,
            gap: 8,
          }}
        >
          {[
            { key: "all", label: "Tous" },
            { key: "trimestre1", label: "T1" },
            { key: "trimestre2", label: "T2" },
            { key: "trimestre3", label: "T3" },
          ].map((period) => (
            <TouchableOpacity
              key={period.key}
              onPress={() => setSelectedPeriod(period.key)}
              style={{
                backgroundColor:
                  selectedPeriod === period.key ? "#D4AF37" : "#1A1A1A",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor:
                  selectedPeriod === period.key ? "#D4AF37" : "#333333",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: selectedPeriod === period.key ? "#000000" : "#CCCCCC",
                }}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Statistiques rapides */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 24,
            gap: 12,
          }}
        >
          <View
            style={{
              backgroundColor: "#1A1A1A",
              borderRadius: 12,
              padding: 16,
              flex: 1,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#333333",
            }}
          >
            <CheckCircle color="#4CAF50" size={24} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#FFFFFF",
                marginTop: 8,
              }}
            >
              {reports.filter((r) => r.status === "completed").length}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#888888",
                textAlign: "center",
              }}
            >
              Terminés
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#1A1A1A",
              borderRadius: 12,
              padding: 16,
              flex: 1,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#333333",
            }}
          >
            <Clock color="#F39C12" size={24} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#FFFFFF",
                marginTop: 8,
              }}
            >
              {reports.filter((r) => r.status === "generating").length}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#888888",
                textAlign: "center",
              }}
            >
              En cours
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#1A1A1A",
              borderRadius: 12,
              padding: 16,
              flex: 1,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#333333",
            }}
          >
            <Download color="#4ECDC4" size={24} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#FFFFFF",
                marginTop: 8,
              }}
            >
              {reports.reduce((sum, r) => sum + r.downloadCount, 0)}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#888888",
                textAlign: "center",
              }}
            >
              Téléchargés
            </Text>
          </View>
        </View>

        {/* Liste des bulletins */}
        {filteredReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}

        {filteredReports.length === 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 40,
            }}
          >
            {searchQuery ? (
              <>
                <Search color="#666666" size={48} />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#888888",
                    marginTop: 16,
                    textAlign: "center",
                  }}
                >
                  Aucun bulletin trouvé{"\n"}pour "{searchQuery}"
                </Text>
              </>
            ) : (
              <>
                <FileText color="#666666" size={48} />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#888888",
                    marginTop: 16,
                    textAlign: "center",
                  }}
                >
                  Aucun bulletin généré{"\n"}Créez votre premier bulletin
                </Text>
                <TouchableOpacity
                  onPress={() => setShowGenerateModal(true)}
                  style={{
                    backgroundColor: "#D4AF37",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 12,
                    marginTop: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#000000",
                    }}
                  >
                    Générer un bulletin
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>

      <GenerateModal />
    </View>
  );
}
