/**
 * Écran Détail d'une Classe - Gestion complète d'une classe
 * Permet de gérer les élèves, notes, présences et informations de la classe
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  BookOpen,
  BarChart3,
  Calendar,
  UserPlus,
  Edit3,
  FileText,
  Clock,
  Phone,
  Mail,
  Star,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  X,
} from "lucide-react-native";
import { Image } from "expo-image";

export default function ClassDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("students"); // 'students', 'grades', 'attendance'
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
  });

  useEffect(() => {
    loadClassData();
  }, [id]);

  const loadClassData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Données simulées de la classe
      const mockClassData = {
        id: parseInt(id),
        name: "3ème A",
        level: "3ème",
        subject: "Toutes matières",
        studentCount: 28,
        capacity: 30,
        averageGrade: 13.5,
        nextExam: "2025-01-20",
        color: "#4ECDC4",
        teacher: "Marie Dubois",
        classroom: "Salle 201",
        schedule: [
          { day: "Lundi", time: "08h00 - 09h00", subject: "Mathématiques" },
          { day: "Lundi", time: "14h00 - 15h00", subject: "Français" },
          { day: "Mardi", time: "10h00 - 11h00", subject: "Histoire-Géo" },
          { day: "Mercredi", time: "09h00 - 10h00", subject: "Sciences" },
          { day: "Jeudi", time: "15h00 - 16h00", subject: "Anglais" },
        ],
      };

      const mockStudents = [
        {
          id: 1,
          firstName: "Emma",
          lastName: "Martin",
          avatar: null,
          averageGrade: 15.2,
          attendance: 96,
          lastGrade: 16,
          lastGradeSubject: "Mathématiques",
          guardian: {
            name: "Sophie Martin",
            phone: "+33 6 12 34 56 78",
            email: "sophie.martin@email.com",
          },
          status: "excellent",
        },
        {
          id: 2,
          firstName: "Lucas",
          lastName: "Dubois",
          avatar: null,
          averageGrade: 12.8,
          attendance: 88,
          lastGrade: 14,
          lastGradeSubject: "Français",
          guardian: {
            name: "Pierre Dubois",
            phone: "+33 6 87 65 43 21",
            email: "pierre.dubois@email.com",
          },
          status: "good",
        },
        {
          id: 3,
          firstName: "Léa",
          lastName: "Bernard",
          avatar: null,
          averageGrade: 9.5,
          attendance: 82,
          lastGrade: 8,
          lastGradeSubject: "Sciences",
          guardian: {
            name: "Anne Bernard",
            phone: "+33 6 23 45 67 89",
            email: "anne.bernard@email.com",
          },
          status: "needs-attention",
        },
        {
          id: 4,
          firstName: "Nathan",
          lastName: "Leroy",
          avatar: null,
          averageGrade: 14.7,
          attendance: 94,
          lastGrade: 17,
          lastGradeSubject: "Histoire-Géo",
          guardian: {
            name: "Marc Leroy",
            phone: "+33 6 98 76 54 32",
            email: "marc.leroy@email.com",
          },
          status: "excellent",
        },
        {
          id: 5,
          firstName: "Chloé",
          lastName: "Moreau",
          avatar: null,
          averageGrade: 11.2,
          attendance: 90,
          lastGrade: 12,
          lastGradeSubject: "Anglais",
          guardian: {
            name: "Julie Moreau",
            phone: "+33 6 45 67 89 12",
            email: "julie.moreau@email.com",
          },
          status: "good",
        },
      ];

      setClassData(mockClassData);
      setStudents(mockStudents);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      setLoading(false);
      Alert.alert("Erreur", "Impossible de charger les données de la classe");
    }
  };

  const handleAddStudent = async () => {
    if (
      !newStudent.firstName ||
      !newStudent.lastName ||
      !newStudent.guardianName
    ) {
      Alert.alert("Erreur", "Veuillez remplir les champs obligatoires");
      return;
    }

    try {
      const studentData = {
        id: students.length + 1,
        ...newStudent,
        avatar: null,
        averageGrade: 0,
        attendance: 100,
        lastGrade: null,
        lastGradeSubject: null,
        guardian: {
          name: newStudent.guardianName,
          phone: newStudent.guardianPhone,
          email: newStudent.guardianEmail,
        },
        status: "new",
      };

      setStudents([...students, studentData]);
      setShowAddStudentModal(false);
      setNewStudent({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        guardianName: "",
        guardianPhone: "",
        guardianEmail: "",
      });

      Alert.alert("Succès", "Élève ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      Alert.alert("Erreur", "Impossible d'ajouter l'élève");
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status) => {
    const colors = {
      excellent: "#4CAF50",
      good: "#D4AF37",
      "needs-attention": "#E63946",
      new: "#9B59B6",
    };
    return colors[status] || "#888888";
  };

  const getStatusLabel = (status) => {
    const labels = {
      excellent: "Excellent",
      good: "Bien",
      "needs-attention": "À suivre",
      new: "Nouveau",
    };
    return labels[status] || "Indéfini";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "excellent":
        return Star;
      case "good":
        return TrendingUp;
      case "needs-attention":
        return AlertCircle;
      default:
        return Users;
    }
  };

  const StudentCard = ({ student }) => {
    const StatusIcon = getStatusIcon(student.status);

    return (
      <TouchableOpacity
        onPress={() => router.push(`/(tabs)/student/${student.id}`)}
        style={{
          backgroundColor: "#1A1A1A",
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "#333333",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Avatar */}
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: getStatusColor(student.status) + "20",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
            borderWidth: 2,
            borderColor: getStatusColor(student.status),
          }}
        >
          {student.avatar ? (
            <Image
              source={{ uri: student.avatar }}
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
              }}
            />
          ) : (
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: getStatusColor(student.status),
              }}
            >
              {student.firstName.charAt(0)}
              {student.lastName.charAt(0)}
            </Text>
          )}
        </View>

        {/* Informations */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#FFFFFF",
                flex: 1,
              }}
            >
              {student.firstName} {student.lastName}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <StatusIcon color={getStatusColor(student.status)} size={14} />
              <Text
                style={{
                  fontSize: 12,
                  color: getStatusColor(student.status),
                  marginLeft: 4,
                  fontWeight: "600",
                }}
              >
                {getStatusLabel(student.status)}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BarChart3 color="#888888" size={12} />
              <Text
                style={{
                  fontSize: 12,
                  color: "#888888",
                  marginLeft: 4,
                }}
              >
                Moy: {student.averageGrade.toFixed(1)}/20
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Calendar color="#888888" size={12} />
              <Text
                style={{
                  fontSize: 12,
                  color: "#888888",
                  marginLeft: 4,
                }}
              >
                {student.attendance}% présence
              </Text>
            </View>

            {student.lastGrade && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FileText color="#888888" size={12} />
                <Text
                  style={{
                    fontSize: 12,
                    color: "#888888",
                    marginLeft: 4,
                  }}
                >
                  Dernier: {student.lastGrade}/20 ({student.lastGradeSubject})
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const TabButton = ({ label, isActive, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: isActive ? "#D4AF37" : "#1A1A1A",
        borderWidth: 1,
        borderColor: isActive ? "#D4AF37" : "#333333",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: isActive ? "#000000" : "#CCCCCC",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const AddStudentModal = () => (
    <Modal
      visible={showAddStudentModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddStudentModal(false)}
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
              Nouvel Élève
            </Text>
            <TouchableOpacity onPress={() => setShowAddStudentModal(false)}>
              <X color="#888888" size={24} />
            </TouchableOpacity>
          </View>

          <View style={{ gap: 16 }}>
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
                  Prénom *
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
                  value={newStudent.firstName}
                  onChangeText={(text) =>
                    setNewStudent((prev) => ({ ...prev, firstName: text }))
                  }
                  placeholder="Prénom"
                  placeholderTextColor="#666666"
                />
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
                  Nom *
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
                  value={newStudent.lastName}
                  onChangeText={(text) =>
                    setNewStudent((prev) => ({ ...prev, lastName: text }))
                  }
                  placeholder="Nom"
                  placeholderTextColor="#666666"
                />
              </View>
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
                Date de naissance
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
                value={newStudent.dateOfBirth}
                onChangeText={(text) =>
                  setNewStudent((prev) => ({ ...prev, dateOfBirth: text }))
                }
                placeholder="JJ/MM/AAAA"
                placeholderTextColor="#666666"
              />
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#D4AF37",
                marginTop: 8,
              }}
            >
              Responsable légal
            </Text>

            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#CCCCCC",
                  marginBottom: 8,
                }}
              >
                Nom du responsable *
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
                value={newStudent.guardianName}
                onChangeText={(text) =>
                  setNewStudent((prev) => ({ ...prev, guardianName: text }))
                }
                placeholder="Nom du parent/tuteur"
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
                Téléphone
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
                value={newStudent.guardianPhone}
                onChangeText={(text) =>
                  setNewStudent((prev) => ({ ...prev, guardianPhone: text }))
                }
                placeholder="+33 6 12 34 56 78"
                placeholderTextColor="#666666"
                keyboardType="phone-pad"
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
                Email
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
                value={newStudent.guardianEmail}
                onChangeText={(text) =>
                  setNewStudent((prev) => ({ ...prev, guardianEmail: text }))
                }
                placeholder="email@exemple.fr"
                placeholderTextColor="#666666"
                keyboardType="email-address"
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
              onPress={() => setShowAddStudentModal(false)}
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
              onPress={handleAddStudent}
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

  if (!classData) {
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
        <Text style={{ color: "#E63946", fontSize: 16 }}>
          Classe introuvable
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

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: "#000000",
          borderBottomWidth: 1,
          borderBottomColor: "#333333",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              padding: 8,
              marginRight: 12,
            }}
          >
            <ArrowLeft color="#D4AF37" size={24} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#D4AF37",
              }}
            >
              {classData.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#CCCCCC",
                marginTop: 2,
              }}
            >
              {classData.studentCount} élèves • Salle {classData.classroom}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowAddStudentModal(true)}
            style={{
              backgroundColor: "#D4AF37",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <UserPlus color="#000000" size={16} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#000000",
              }}
            >
              Ajouter
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistiques de la classe */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 16,
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
          <BarChart3 color={classData.color} size={24} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#FFFFFF",
              marginTop: 8,
            }}
          >
            {classData.averageGrade.toFixed(1)}
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
          <Users color="#4ECDC4" size={24} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#FFFFFF",
              marginTop: 8,
            }}
          >
            {Math.round((classData.studentCount / classData.capacity) * 100)}%
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
          <Calendar color="#F39C12" size={24} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#FFFFFF",
              marginTop: 8,
            }}
          >
            92%
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#888888",
              textAlign: "center",
            }}
          >
            Présence
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          marginBottom: 16,
          gap: 8,
        }}
      >
        <TabButton
          label="Élèves"
          isActive={selectedTab === "students"}
          onPress={() => setSelectedTab("students")}
        />
        <TabButton
          label="Notes"
          isActive={selectedTab === "grades"}
          onPress={() => setSelectedTab("grades")}
        />
        <TabButton
          label="Présences"
          isActive={selectedTab === "attendance"}
          onPress={() => setSelectedTab("attendance")}
        />
      </View>

      {/* Contenu des tabs */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {selectedTab === "students" && (
          <>
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
                placeholder="Rechercher un élève..."
                placeholderTextColor="#666666"
              />
            </View>

            {/* Liste des élèves */}
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}

            {filteredStudents.length === 0 && searchQuery && (
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
                  Aucun élève trouvé{"\n"}pour "{searchQuery}"
                </Text>
              </View>
            )}
          </>
        )}

        {selectedTab === "grades" && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 40,
            }}
          >
            <FileText color="#666666" size={48} />
            <Text
              style={{
                fontSize: 16,
                color: "#888888",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              Gestion des notes{"\n"}Fonctionnalité à venir
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/grade-editor")}
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
                Ajouter une note
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedTab === "attendance" && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 40,
            }}
          >
            <Calendar color="#666666" size={48} />
            <Text
              style={{
                fontSize: 16,
                color: "#888888",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              Suivi des présences{"\n"}Fonctionnalité à venir
            </Text>
          </View>
        )}
      </ScrollView>

      <AddStudentModal />
    </View>
  );
}
