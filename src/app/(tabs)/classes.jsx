/**
 * Écran Classes - Gestion des classes et étudiants
 * Permet de visualiser, ajouter et gérer les classes et leurs élèves
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
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  Users,
  Plus,
  Search,
  BookOpen,
  ChevronRight,
  GraduationCap,
  UserPlus,
  Filter,
  X,
  Edit3,
} from "lucide-react-native";
import { Image } from "expo-image";

const { width: screenWidth } = Dimensions.get("window");

export default function ClassesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClass, setNewClass] = useState({
    name: "",
    level: "",
    subject: "",
    capacity: "",
  });

  // Charger les classes
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      // Simulation des données - remplacer par des appels API réels
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockClasses = [
        {
          id: 1,
          name: "6ème A",
          level: "6ème",
          subject: "Toutes matières",
          studentCount: 28,
          capacity: 30,
          averageGrade: 13.5,
          nextExam: "2025-01-20",
          color: "#4ECDC4",
        },
        {
          id: 2,
          name: "5ème B",
          level: "5ème",
          subject: "Toutes matières",
          studentCount: 25,
          capacity: 30,
          averageGrade: 14.2,
          nextExam: "2025-01-18",
          color: "#FF6B6B",
        },
        {
          id: 3,
          name: "4ème A",
          level: "4ème",
          subject: "Toutes matières",
          studentCount: 32,
          capacity: 35,
          averageGrade: 12.8,
          nextExam: "2025-01-22",
          color: "#9B59B6",
        },
        {
          id: 4,
          name: "3ème A",
          level: "3ème",
          subject: "Toutes matières",
          studentCount: 30,
          capacity: 32,
          averageGrade: 15.1,
          nextExam: "2025-01-15",
          color: "#F39C12",
        },
        {
          id: 5,
          name: "Mathématiques Spé",
          level: "Terminale",
          subject: "Mathématiques",
          studentCount: 18,
          capacity: 25,
          averageGrade: 16.3,
          nextExam: "2025-01-25",
          color: "#2ECC71",
        },
        {
          id: 6,
          name: "Physique-Chimie",
          level: "1ère",
          subject: "Sciences",
          studentCount: 22,
          capacity: 25,
          averageGrade: 13.9,
          nextExam: "2025-01-19",
          color: "#E74C3C",
        },
      ];

      setClasses(mockClasses);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des classes:", error);
      setLoading(false);
      Alert.alert("Erreur", "Impossible de charger les classes");
    }
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddClass = async () => {
    if (!newClass.name || !newClass.level || !newClass.capacity) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      // Simulation d'ajout - remplacer par appel API
      const newClassData = {
        id: classes.length + 1,
        name: newClass.name,
        level: newClass.level,
        subject: newClass.subject || "Toutes matières",
        studentCount: 0,
        capacity: parseInt(newClass.capacity),
        averageGrade: 0,
        nextExam: null,
        color: "#D4AF37",
      };

      setClasses([...classes, newClassData]);
      setShowAddModal(false);
      setNewClass({ name: "", level: "", subject: "", capacity: "" });
      Alert.alert("Succès", "Classe ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      Alert.alert("Erreur", "Impossible d'ajouter la classe");
    }
  };

  const ClassCard = ({ classData }) => {
    const fillPercentage = (classData.studentCount / classData.capacity) * 100;
    const isNearFull = fillPercentage >= 90;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/(tabs)/class/${classData.id}`)}
        style={{
          backgroundColor: "#1A1A1A",
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#333333",
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        {/* Header de la carte */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View
              style={{
                backgroundColor: classData.color,
                borderRadius: 8,
                padding: 8,
                marginRight: 12,
              }}
            >
              <BookOpen color="#FFFFFF" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  marginBottom: 2,
                }}
              >
                {classData.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#CCCCCC",
                }}
              >
                {classData.subject}
              </Text>
            </View>
          </View>
          <ChevronRight color="#888888" size={20} />
        </View>

        {/* Statistiques */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: isNearFull ? "#E63946" : "#D4AF37",
              }}
            >
              {classData.studentCount}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#888888",
                textAlign: "center",
              }}
            >
              Élèves
            </Text>
          </View>
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color:
                  classData.averageGrade >= 15
                    ? "#4CAF50"
                    : classData.averageGrade >= 12
                      ? "#D4AF37"
                      : "#E63946",
              }}
            >
              {classData.averageGrade > 0
                ? classData.averageGrade.toFixed(1)
                : "-"}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#888888",
                textAlign: "center",
              }}
            >
              Moyenne
            </Text>
          </View>
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#4ECDC4",
              }}
            >
              {Math.round(fillPercentage)}%
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#888888",
                textAlign: "center",
              }}
            >
              Rempli
            </Text>
          </View>
        </View>

        {/* Barre de progression */}
        <View
          style={{
            height: 4,
            backgroundColor: "#333333",
            borderRadius: 2,
            marginBottom: 12,
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${Math.min(fillPercentage, 100)}%`,
              backgroundColor: isNearFull ? "#E63946" : classData.color,
              borderRadius: 2,
            }}
          />
        </View>

        {/* Info supplémentaire */}
        {classData.nextExam && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#888888",
              }}
            >
              Prochain examen: {classData.nextExam}
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/(tabs)/class/${classData.id}`)}
              style={{
                backgroundColor: "#D4AF37",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#000000",
                }}
              >
                Gérer
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const AddClassModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddModal(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: "#1A1A1A",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 20,
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 20,
            minHeight: "50%",
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
              Nouvelle Classe
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X color="#888888" size={24} />
            </TouchableOpacity>
          </View>

          <View style={{ gap: 16 }}>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#CCCCCC",
                  marginBottom: 8,
                }}
              >
                Nom de la classe *
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
                value={newClass.name}
                onChangeText={(text) =>
                  setNewClass((prev) => ({ ...prev, name: text }))
                }
                placeholder="Ex: 6ème A, Terminale S1..."
                placeholderTextColor="#666666"
              />
            </View>

            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#CCCCCC",
                  marginBottom: 8,
                }}
              >
                Niveau *
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
                value={newClass.level}
                onChangeText={(text) =>
                  setNewClass((prev) => ({ ...prev, level: text }))
                }
                placeholder="Ex: 6ème, 5ème, Terminale..."
                placeholderTextColor="#666666"
              />
            </View>

            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#CCCCCC",
                  marginBottom: 8,
                }}
              >
                Matière principale
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
                value={newClass.subject}
                onChangeText={(text) =>
                  setNewClass((prev) => ({ ...prev, subject: text }))
                }
                placeholder="Ex: Mathématiques, Français..."
                placeholderTextColor="#666666"
              />
            </View>

            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#CCCCCC",
                  marginBottom: 8,
                }}
              >
                Capacité maximale *
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
                value={newClass.capacity}
                onChangeText={(text) =>
                  setNewClass((prev) => ({ ...prev, capacity: text }))
                }
                placeholder="Ex: 30"
                placeholderTextColor="#666666"
                keyboardType="numeric"
              />
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
              onPress={() => setShowAddModal(false)}
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
              onPress={handleAddClass}
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
                Ajouter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
              Classes
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#CCCCCC",
                marginTop: 4,
              }}
            >
              {filteredClasses.length} classe
              {filteredClasses.length !== 1 ? "s" : ""}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
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
              Ajouter
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
            marginBottom: 20,
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
            placeholder="Rechercher une classe..."
            placeholderTextColor="#666666"
          />
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
            <GraduationCap color="#4ECDC4" size={24} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#FFFFFF",
                marginTop: 8,
              }}
            >
              {classes.reduce((sum, cls) => sum + cls.studentCount, 0)}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#888888",
                textAlign: "center",
              }}
            >
              Total élèves
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
            <Users color="#D4AF37" size={24} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#FFFFFF",
                marginTop: 8,
              }}
            >
              {classes.length}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#888888",
                textAlign: "center",
              }}
            >
              Classes actives
            </Text>
          </View>
        </View>

        {/* Liste des classes */}
        {filteredClasses.map((classData) => (
          <ClassCard key={classData.id} classData={classData} />
        ))}

        {filteredClasses.length === 0 && searchQuery && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 40,
            }}
          >
            <Search color="#666666" size={48} />
            <Text
              style={{
                fontSize: 16,
                color: "#888888",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              Aucune classe trouvée pour "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>

      <AddClassModal />
    </View>
  );
}
