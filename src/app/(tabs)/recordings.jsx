/**
 * Écran Enregistrements - Gestion des cours audio et fichiers
 * Permet d'enregistrer des cours audio, uploader des fichiers et organiser les contenus pédagogiques
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
  useAudioRecorder,
  useAudioRecorderState,
  requestRecordingPermissionsAsync,
  RecordingPresets,
  createAudioPlayer,
} from "expo-audio";
import { useUpload } from "@/utils/useUpload";
import {
  Mic,
  Square,
  Play,
  Pause,
  Upload,
  File,
  Clock,
  Users,
  BookOpen,
  Plus,
  X,
  Trash2,
  Search,
  Filter,
  Download,
  Folder,
  Volume2,
} from "lucide-react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function RecordingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [upload] = useUpload();

  const [recordings, setRecordings] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all"); // 'all', 'audio', 'files'

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [recordingMetadata, setRecordingMetadata] = useState({
    title: "",
    subject: "",
    class: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadRecordings();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        Alert.alert(
          "Permission requise",
          "L'accès au microphone est nécessaire pour enregistrer les cours",
        );
      }
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
    }
  };

  const loadRecordings = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Données simulées d'enregistrements
      const mockRecordings = [
        {
          id: 1,
          title: "Cours Mathématiques - Équations",
          subject: "Mathématiques",
          class: "3ème A",
          type: "audio",
          duration: 2340, // secondes
          size: "15.2 MB",
          date: "2025-01-10",
          description:
            "Cours sur les équations du second degré avec exercices pratiques",
          url: "https://example.com/audio1.mp3",
          transcription: null,
        },
        {
          id: 2,
          title: "Présentation Histoire - Révolution",
          subject: "Histoire",
          class: "2nde B",
          type: "file",
          fileType: "pdf",
          size: "8.5 MB",
          date: "2025-01-09",
          description: "Support de cours sur la Révolution française",
          url: "https://example.com/histoire.pdf",
          pages: 24,
        },
        {
          id: 3,
          title: "Cours Physique - Électricité",
          subject: "Physique",
          class: "1ère S",
          type: "audio",
          duration: 1980,
          size: "12.8 MB",
          date: "2025-01-08",
          description: "Introduction aux lois de l'électricité",
          url: "https://example.com/audio2.mp3",
          transcription: "Transcription disponible",
        },
        {
          id: 4,
          title: "Exercices Français - Grammaire",
          subject: "Français",
          class: "4ème A",
          type: "file",
          fileType: "docx",
          size: "2.1 MB",
          date: "2025-01-07",
          description: "Fiche d'exercices sur les propositions subordonnées",
          url: "https://example.com/francais.docx",
        },
        {
          id: 5,
          title: "Cours Anglais - Present Perfect",
          subject: "Anglais",
          class: "5ème B",
          type: "audio",
          duration: 1620,
          size: "10.5 MB",
          date: "2025-01-06",
          description: "Explication du present perfect avec exemples",
          url: "https://example.com/audio3.mp3",
        },
      ];

      setRecordings(mockRecordings);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des enregistrements:", error);
      setLoading(false);
      Alert.alert("Erreur", "Impossible de charger les enregistrements");
    }
  };

  const filteredRecordings = recordings.filter((recording) => {
    const matchesSearch =
      recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recording.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recording.class.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "audio" && recording.type === "audio") ||
      (selectedFilter === "files" && recording.type === "file");

    return matchesSearch && matchesFilter;
  });

  const startRecording = () => {
    setRecordingMetadata({
      title: "",
      subject: "",
      class: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setShowRecordModal(true);
  };

  const handleRecord = async () => {
    try {
      if (recorderState.isRecording) {
        await recorder.stop();
      } else {
        await recorder.prepareToRecordAsync();
        recorder.record();
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      Alert.alert("Erreur", "Impossible de contrôler l'enregistrement");
    }
  };

  const saveRecording = async () => {
    if (
      !recordingMetadata.title ||
      !recordingMetadata.subject ||
      !recordingMetadata.class
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      // Upload de l'enregistrement
      const uploadResult = await upload({
        reactNativeAsset: {
          uri: recorder.uri,
          name: `recording_${Date.now()}.mp3`,
          mimeType: "audio/mp3",
        },
      });

      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      const newRecording = {
        id: recordings.length + 1,
        ...recordingMetadata,
        type: "audio",
        duration: Math.floor(recorderState.currentTime),
        size: "0.0 MB", // Sera calculé côté serveur
        url: uploadResult.url,
        transcription: null,
      };

      setRecordings([newRecording, ...recordings]);
      setShowRecordModal(false);
      Alert.alert("Succès", "Enregistrement sauvegardé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      Alert.alert("Erreur", "Impossible de sauvegarder l'enregistrement");
    }
  };

  const playRecording = async (recording) => {
    if (currentPlayer) {
      currentPlayer.pause();
      currentPlayer.remove();
    }

    if (playingId === recording.id) {
      setPlayingId(null);
      setCurrentPlayer(null);
      return;
    }

    try {
      const player = createAudioPlayer(recording.url);
      setCurrentPlayer(player);
      setPlayingId(recording.id);
      player.play();

      const checkStatus = setInterval(() => {
        if (!player.playing && player.currentTime > 0) {
          setPlayingId(null);
          setCurrentPlayer(null);
          clearInterval(checkStatus);
        }
      }, 100);
    } catch (error) {
      console.error("Erreur lors de la lecture:", error);
      Alert.alert("Erreur", "Impossible de lire l'enregistrement");
    }
  };

  const deleteRecording = (id) => {
    Alert.alert(
      "Supprimer l'enregistrement",
      "Êtes-vous sûr de vouloir supprimer cet enregistrement ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            setRecordings(recordings.filter((r) => r.id !== id));
            if (playingId === id) {
              currentPlayer?.pause();
              currentPlayer?.remove();
              setPlayingId(null);
              setCurrentPlayer(null);
            }
          },
        },
      ],
    );
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return "📄";
      case "docx":
        return "📝";
      case "pptx":
        return "📊";
      case "xlsx":
        return "📈";
      default:
        return "📎";
    }
  };

  const RecordingCard = ({ recording }) => (
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
          marginBottom: 12,
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
                backgroundColor:
                  recording.type === "audio" ? "#9B59B6" : "#4ECDC4",
                borderRadius: 8,
                padding: 6,
                marginRight: 12,
              }}
            >
              {recording.type === "audio" ? (
                <Volume2 color="#FFFFFF" size={16} />
              ) : (
                <File color="#FFFFFF" size={16} />
              )}
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
                {recording.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#4ECDC4",
                    fontWeight: "600",
                  }}
                >
                  {recording.subject}
                </Text>
                <Text style={{ fontSize: 12, color: "#666666" }}>•</Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#888888",
                  }}
                >
                  {recording.class}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          {recording.description && (
            <Text
              style={{
                fontSize: 14,
                color: "#CCCCCC",
                marginBottom: 12,
                lineHeight: 18,
              }}
            >
              {recording.description}
            </Text>
          )}

          {/* Métadonnées */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 12,
            }}
          >
            {recording.type === "audio" ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Clock color="#888888" size={14} style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 12, color: "#888888" }}>
                  {formatDuration(recording.duration)}
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 16, marginRight: 4 }}>
                  {getFileIcon(recording.fileType)}
                </Text>
                <Text style={{ fontSize: 12, color: "#888888" }}>
                  {recording.fileType?.toUpperCase()}
                </Text>
              </View>
            )}

            <Text style={{ fontSize: 12, color: "#666666" }}>
              {recording.size}
            </Text>

            <Text style={{ fontSize: 12, color: "#666666" }}>
              {formatDate(recording.date)}
            </Text>
          </View>

          {/* Transcription disponible */}
          {recording.transcription && (
            <View
              style={{
                backgroundColor: "#2A1810",
                borderRadius: 8,
                padding: 8,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#F39C12",
                  fontWeight: "600",
                }}
              >
                📝 Transcription disponible
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
          {recording.type === "audio" && (
            <TouchableOpacity
              onPress={() => playRecording(recording)}
              style={{
                backgroundColor:
                  playingId === recording.id ? "#E63946" : "#D4AF37",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              {playingId === recording.id ? (
                <Pause color="#FFFFFF" size={14} />
              ) : (
                <Play color="#000000" size={14} />
              )}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: playingId === recording.id ? "#FFFFFF" : "#000000",
                }}
              >
                {playingId === recording.id ? "Pause" : "Écouter"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: "#333333",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Download color="#FFFFFF" size={14} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#FFFFFF",
              }}
            >
              Télécharger
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => deleteRecording(recording.id)}
          style={{ padding: 8 }}
        >
          <Trash2 color="#E63946" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const RecordModal = () => (
    <Modal
      visible={showRecordModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowRecordModal(false)}
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
              Nouvel Enregistrement
            </Text>
            <TouchableOpacity onPress={() => setShowRecordModal(false)}>
              <X color="#888888" size={24} />
            </TouchableOpacity>
          </View>

          {/* Interface d'enregistrement */}
          <View
            style={{
              backgroundColor: "#000000",
              borderRadius: 16,
              padding: 24,
              alignItems: "center",
              marginBottom: 24,
              borderWidth: 2,
              borderColor: recorderState.isRecording ? "#E63946" : "#333333",
            }}
          >
            <TouchableOpacity
              onPress={handleRecord}
              style={{
                backgroundColor: recorderState.isRecording
                  ? "#E63946"
                  : "#D4AF37",
                borderRadius: 50,
                padding: 24,
                marginBottom: 16,
              }}
            >
              {recorderState.isRecording ? (
                <Square color="#FFFFFF" size={32} />
              ) : (
                <Mic color="#000000" size={32} />
              )}
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              {recorderState.isRecording
                ? "Enregistrement en cours..."
                : "Appuyez pour commencer"}
            </Text>

            {recorderState.isRecording && (
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#E63946",
                }}
              >
                {formatDuration(Math.floor(recorderState.currentTime))}
              </Text>
            )}
          </View>

          {/* Métadonnées */}
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
                Titre du cours *
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
                value={recordingMetadata.title}
                onChangeText={(text) =>
                  setRecordingMetadata((prev) => ({ ...prev, title: text }))
                }
                placeholder="Ex: Cours Mathématiques - Équations"
                placeholderTextColor="#666666"
              />
            </View>

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
                  Matière *
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
                  value={recordingMetadata.subject}
                  onChangeText={(text) =>
                    setRecordingMetadata((prev) => ({ ...prev, subject: text }))
                  }
                  placeholder="Mathématiques"
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
                  value={recordingMetadata.class}
                  onChangeText={(text) =>
                    setRecordingMetadata((prev) => ({ ...prev, class: text }))
                  }
                  placeholder="3ème A"
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
                Description
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
                  minHeight: 80,
                  textAlignVertical: "top",
                }}
                value={recordingMetadata.description}
                onChangeText={(text) =>
                  setRecordingMetadata((prev) => ({
                    ...prev,
                    description: text,
                  }))
                }
                placeholder="Description du contenu du cours..."
                placeholderTextColor="#666666"
                multiline
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
              onPress={() => setShowRecordModal(false)}
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
              onPress={saveRecording}
              disabled={recorderState.isRecording || !recorder.uri}
              style={{
                flex: 1,
                backgroundColor:
                  !recorderState.isRecording && recorder.uri
                    ? "#D4AF37"
                    : "#666666",
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color:
                    !recorderState.isRecording && recorder.uri
                      ? "#000000"
                      : "#CCCCCC",
                }}
              >
                Sauvegarder
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
              Cours
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#CCCCCC",
                marginTop: 4,
              }}
            >
              {filteredRecordings.length} enregistrement
              {filteredRecordings.length !== 1 ? "s" : ""}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => setShowUploadModal(true)}
              style={{
                backgroundColor: "#4ECDC4",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Upload color="#000000" size={16} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#000000",
                }}
              >
                Upload
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={startRecording}
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
              <Mic color="#000000" size={16} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#000000",
                }}
              >
                Enregistrer
              </Text>
            </TouchableOpacity>
          </View>
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
            placeholder="Rechercher un cours..."
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
            { key: "all", label: "Tous", icon: Folder },
            { key: "audio", label: "Audio", icon: Volume2 },
            { key: "files", label: "Fichiers", icon: File },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key)}
              style={{
                backgroundColor:
                  selectedFilter === filter.key ? "#D4AF37" : "#1A1A1A",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                borderWidth: 1,
                borderColor:
                  selectedFilter === filter.key ? "#D4AF37" : "#333333",
              }}
            >
              <filter.icon
                color={selectedFilter === filter.key ? "#000000" : "#CCCCCC"}
                size={14}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: selectedFilter === filter.key ? "#000000" : "#CCCCCC",
                }}
              >
                {filter.label}
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
            <Volume2 color="#9B59B6" size={24} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#FFFFFF",
                marginTop: 8,
              }}
            >
              {recordings.filter((r) => r.type === "audio").length}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#888888",
                textAlign: "center",
              }}
            >
              Enregistrements
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
            <File color="#4ECDC4" size={24} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#FFFFFF",
                marginTop: 8,
              }}
            >
              {recordings.filter((r) => r.type === "file").length}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#888888",
                textAlign: "center",
              }}
            >
              Fichiers
            </Text>
          </View>
        </View>

        {/* Liste des enregistrements */}
        {filteredRecordings.map((recording) => (
          <RecordingCard key={recording.id} recording={recording} />
        ))}

        {filteredRecordings.length === 0 && (
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
                  Aucun enregistrement trouvé{"\n"}pour "{searchQuery}"
                </Text>
              </>
            ) : (
              <>
                <Mic color="#666666" size={48} />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#888888",
                    marginTop: 16,
                    textAlign: "center",
                  }}
                >
                  Aucun cours enregistré{"\n"}Commencez par faire un
                  enregistrement
                </Text>
                <TouchableOpacity
                  onPress={startRecording}
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
                    Premier enregistrement
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>

      <RecordModal />
    </View>
  );
}
