/**
 * Écran Calendrier - Gestion des événements académiques
 * Permet de visualiser, ajouter et gérer les événements, examens et planifications
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
import { useRouter } from "expo-router";
import { Calendar, Agenda } from "react-native-calendars";
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  Users,
  BookOpen,
  AlertCircle,
  X,
  Edit3,
  Trash2,
  Bell,
  Filter,
} from "lucide-react-native";

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' ou 'agenda'
  const [events, setEvents] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "exam", // 'exam', 'meeting', 'homework', 'vacation', 'other'
    time: "",
    location: "",
    class: "",
    subject: "",
    date: selectedDate,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    // Mettre à jour les dates marquées quand les événements changent
    const marked = {};
    Object.keys(events).forEach((date) => {
      const dayEvents = events[date];
      if (dayEvents && dayEvents.length > 0) {
        const eventColors = {
          exam: "#E63946",
          meeting: "#4ECDC4",
          homework: "#F39C12",
          vacation: "#2ECC71",
          other: "#9B59B6",
        };

        // Prendre la couleur du premier événement ou mélanger les couleurs
        const primaryType = dayEvents[0].type;
        marked[date] = {
          marked: true,
          dotColor: eventColors[primaryType],
          selectedColor: date === selectedDate ? "#D4AF37" : undefined,
          selected: date === selectedDate,
        };
      }
    });

    // S'assurer que la date sélectionnée est marquée
    if (!marked[selectedDate]) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: "#D4AF37",
      };
    }

    setMarkedDates(marked);
  }, [events, selectedDate]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Données simulées d'événements
      const mockEvents = {
        "2025-01-15": [
          {
            id: 1,
            title: "Examen Mathématiques",
            description: "Examen trimestriel de mathématiques pour la 3ème A",
            type: "exam",
            time: "08:00",
            location: "Salle 201",
            class: "3ème A",
            subject: "Mathématiques",
            duration: 120,
          },
        ],
        "2025-01-18": [
          {
            id: 2,
            title: "Réunion Parents",
            description: "Rencontre parents-professeurs 3ème A",
            type: "meeting",
            time: "18:00",
            location: "Salle de conférence",
            class: "3ème A",
            subject: "",
            duration: 90,
          },
        ],
        "2025-01-20": [
          {
            id: 3,
            title: "Devoir Français",
            description: "Remise du devoir de dissertation",
            type: "homework",
            time: "14:00",
            location: "Salle 103",
            class: "2nde B",
            subject: "Français",
          },
          {
            id: 4,
            title: "Examen Physique",
            description: "Contrôle de physique-chimie",
            type: "exam",
            time: "10:00",
            location: "Lab Sciences",
            class: "1ère S",
            subject: "Physique-Chimie",
            duration: 90,
          },
        ],
        "2025-01-22": [
          {
            id: 5,
            title: "Remise des bulletins",
            description: "Distribution des bulletins du 1er trimestre",
            type: "other",
            time: "16:00",
            location: "Hall principal",
            class: "Toutes classes",
            subject: "",
          },
        ],
        "2025-01-25": [
          {
            id: 6,
            title: "Vacances scolaires",
            description: "Début des vacances d'hiver",
            type: "vacation",
            time: "",
            location: "",
            class: "Toutes classes",
            subject: "",
          },
        ],
      };

      setEvents(mockEvents);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      setLoading(false);
      Alert.alert("Erreur", "Impossible de charger les événements");
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      Alert.alert("Erreur", "Veuillez remplir au moins le titre et la date");
      return;
    }

    try {
      const eventId = Date.now();
      const eventData = {
        ...newEvent,
        id: eventId,
      };

      const updatedEvents = { ...events };
      if (!updatedEvents[newEvent.date]) {
        updatedEvents[newEvent.date] = [];
      }
      updatedEvents[newEvent.date].push(eventData);

      setEvents(updatedEvents);
      setShowAddModal(false);
      setNewEvent({
        title: "",
        description: "",
        type: "exam",
        time: "",
        location: "",
        class: "",
        subject: "",
        date: selectedDate,
      });

      Alert.alert("Succès", "Événement ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      Alert.alert("Erreur", "Impossible d'ajouter l'événement");
    }
  };

  const handleDeleteEvent = (eventId, eventDate) => {
    Alert.alert(
      "Supprimer l'événement",
      "Êtes-vous sûr de vouloir supprimer cet événement ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const updatedEvents = { ...events };
            updatedEvents[eventDate] = updatedEvents[eventDate].filter(
              (e) => e.id !== eventId,
            );
            if (updatedEvents[eventDate].length === 0) {
              delete updatedEvents[eventDate];
            }
            setEvents(updatedEvents);
            setShowEventDetail(false);
          },
        },
      ],
    );
  };

  const getEventTypeColor = (type) => {
    const colors = {
      exam: "#E63946",
      meeting: "#4ECDC4",
      homework: "#F39C12",
      vacation: "#2ECC71",
      other: "#9B59B6",
    };
    return colors[type] || "#888888";
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "exam":
        return AlertCircle;
      case "meeting":
        return Users;
      case "homework":
        return BookOpen;
      case "vacation":
        return CalendarDays;
      default:
        return Clock;
    }
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      exam: "Examen",
      meeting: "Réunion",
      homework: "Devoir",
      vacation: "Vacances",
      other: "Autre",
    };
    return labels[type] || "Événement";
  };

  const EventCard = ({ event, date }) => {
    const IconComponent = getEventTypeIcon(event.type);
    const color = getEventTypeColor(event.type);

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedEvent({ ...event, date });
          setShowEventDetail(true);
        }}
        style={{
          backgroundColor: "#1A1A1A",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: color,
          borderWidth: 1,
          borderColor: "#333333",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <IconComponent
                color={color}
                size={16}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: color,
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {getEventTypeLabel(event.type)}
              </Text>
              {event.time && (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#888888",
                    marginLeft: 8,
                  }}
                >
                  • {event.time}
                </Text>
              )}
            </View>

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

            {event.description && (
              <Text
                style={{
                  fontSize: 14,
                  color: "#CCCCCC",
                  marginBottom: 8,
                  lineHeight: 18,
                }}
              >
                {event.description}
              </Text>
            )}

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {event.class && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Users color="#888888" size={12} />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#888888",
                      marginLeft: 4,
                    }}
                  >
                    {event.class}
                  </Text>
                </View>
              )}

              {event.location && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MapPin color="#888888" size={12} />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#888888",
                      marginLeft: 4,
                    }}
                  >
                    {event.location}
                  </Text>
                </View>
              )}

              {event.subject && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <BookOpen color="#888888" size={12} />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#888888",
                      marginLeft: 4,
                    }}
                  >
                    {event.subject}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const AddEventModal = () => (
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
              Nouvel Événement
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X color="#888888" size={24} />
            </TouchableOpacity>
          </View>

          <View style={{ gap: 16 }}>
            {/* Type d'événement */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#CCCCCC",
                  marginBottom: 8,
                }}
              >
                Type d'événement
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {["exam", "meeting", "homework", "vacation", "other"].map(
                  (type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setNewEvent((prev) => ({ ...prev, type }))}
                      style={{
                        backgroundColor:
                          newEvent.type === type
                            ? getEventTypeColor(type)
                            : "#333333",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: newEvent.type === type ? "#FFFFFF" : "#CCCCCC",
                        }}
                      >
                        {getEventTypeLabel(type)}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View>

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
                Titre *
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
                value={newEvent.title}
                onChangeText={(text) =>
                  setNewEvent((prev) => ({ ...prev, title: text }))
                }
                placeholder="Titre de l'événement"
                placeholderTextColor="#666666"
              />
            </View>

            {/* Description */}
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
                value={newEvent.description}
                onChangeText={(text) =>
                  setNewEvent((prev) => ({ ...prev, description: text }))
                }
                placeholder="Description détaillée..."
                placeholderTextColor="#666666"
                multiline
              />
            </View>

            {/* Heure et lieu */}
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
                  Heure
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
                  value={newEvent.time}
                  onChangeText={(text) =>
                    setNewEvent((prev) => ({ ...prev, time: text }))
                  }
                  placeholder="14:30"
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
                  Lieu
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
                  value={newEvent.location}
                  onChangeText={(text) =>
                    setNewEvent((prev) => ({ ...prev, location: text }))
                  }
                  placeholder="Salle 201"
                  placeholderTextColor="#666666"
                />
              </View>
            </View>

            {/* Classe et Matière */}
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
                  Classe
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
                  value={newEvent.class}
                  onChangeText={(text) =>
                    setNewEvent((prev) => ({ ...prev, class: text }))
                  }
                  placeholder="3ème A"
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
                  Matière
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
                  value={newEvent.subject}
                  onChangeText={(text) =>
                    setNewEvent((prev) => ({ ...prev, subject: text }))
                  }
                  placeholder="Mathématiques"
                  placeholderTextColor="#666666"
                />
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
              onPress={handleAddEvent}
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

  const EventDetailModal = () => (
    <Modal
      visible={showEventDetail}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowEventDetail(false)}
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
          }}
        >
          {selectedEvent && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {React.createElement(getEventTypeIcon(selectedEvent.type), {
                    color: getEventTypeColor(selectedEvent.type),
                    size: 24,
                    style: { marginRight: 12 },
                  })}
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#FFFFFF",
                    }}
                  >
                    {selectedEvent.title}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowEventDetail(false)}>
                  <X color="#888888" size={24} />
                </TouchableOpacity>
              </View>

              <View style={{ gap: 16 }}>
                <View
                  style={{
                    backgroundColor:
                      getEventTypeColor(selectedEvent.type) + "20",
                    borderLeftWidth: 4,
                    borderLeftColor: getEventTypeColor(selectedEvent.type),
                    padding: 16,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: getEventTypeColor(selectedEvent.type),
                      marginBottom: 4,
                    }}
                  >
                    {getEventTypeLabel(selectedEvent.type)}
                  </Text>
                  {selectedEvent.description && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#CCCCCC",
                        lineHeight: 18,
                      }}
                    >
                      {selectedEvent.description}
                    </Text>
                  )}
                </View>

                {/* Détails */}
                <View style={{ gap: 12 }}>
                  {selectedEvent.time && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Clock
                        color="#888888"
                        size={16}
                        style={{ marginRight: 12 }}
                      />
                      <Text style={{ color: "#CCCCCC", fontSize: 14 }}>
                        {selectedEvent.time}
                      </Text>
                    </View>
                  )}

                  {selectedEvent.location && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MapPin
                        color="#888888"
                        size={16}
                        style={{ marginRight: 12 }}
                      />
                      <Text style={{ color: "#CCCCCC", fontSize: 14 }}>
                        {selectedEvent.location}
                      </Text>
                    </View>
                  )}

                  {selectedEvent.class && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Users
                        color="#888888"
                        size={16}
                        style={{ marginRight: 12 }}
                      />
                      <Text style={{ color: "#CCCCCC", fontSize: 14 }}>
                        {selectedEvent.class}
                      </Text>
                    </View>
                  )}

                  {selectedEvent.subject && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <BookOpen
                        color="#888888"
                        size={16}
                        style={{ marginRight: 12 }}
                      />
                      <Text style={{ color: "#CCCCCC", fontSize: 14 }}>
                        {selectedEvent.subject}
                      </Text>
                    </View>
                  )}
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
                  onPress={() =>
                    handleDeleteEvent(selectedEvent.id, selectedEvent.date)
                  }
                  style={{
                    flex: 1,
                    backgroundColor: "#E63946",
                    paddingVertical: 16,
                    borderRadius: 12,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Trash2 color="#FFFFFF" size={16} />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#FFFFFF",
                    }}
                  >
                    Supprimer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#D4AF37",
                    paddingVertical: 16,
                    borderRadius: 12,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Edit3 color="#000000" size={16} />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#000000",
                    }}
                  >
                    Modifier
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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

      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
        }}
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
              Calendrier
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#CCCCCC",
                marginTop: 4,
              }}
            >
              Événements académiques
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setNewEvent((prev) => ({ ...prev, date: selectedDate }));
              setShowAddModal(true);
            }}
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

        {/* Calendrier */}
        <Calendar
          current={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            calendarBackground: "#1A1A1A",
            textSectionTitleColor: "#CCCCCC",
            selectedDayBackgroundColor: "#D4AF37",
            selectedDayTextColor: "#000000",
            todayTextColor: "#D4AF37",
            dayTextColor: "#FFFFFF",
            textDisabledColor: "#666666",
            monthTextColor: "#FFFFFF",
            indicatorColor: "#D4AF37",
            textDayFontWeight: "500",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "600",
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
            arrowColor: "#D4AF37",
          }}
          style={{
            borderRadius: 12,
            marginBottom: 20,
          }}
        />
      </View>

      {/* Événements du jour sélectionné */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
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
            {events[selectedDate] ? events[selectedDate].length : 0} événement
            {events[selectedDate]?.length !== 1 ? "s" : ""} le {selectedDate}
          </Text>
        </View>

        {events[selectedDate] ? (
          events[selectedDate].map((event) => (
            <EventCard key={event.id} event={event} date={selectedDate} />
          ))
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 40,
            }}
          >
            <CalendarDays color="#666666" size={48} />
            <Text
              style={{
                fontSize: 16,
                color: "#888888",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              Aucun événement prévu{"\n"}pour cette date
            </Text>
            <TouchableOpacity
              onPress={() => {
                setNewEvent((prev) => ({ ...prev, date: selectedDate }));
                setShowAddModal(true);
              }}
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
                Ajouter un événement
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <AddEventModal />
      <EventDetailModal />
    </View>
  );
}
