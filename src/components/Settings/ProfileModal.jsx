import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { User, Camera, X } from "lucide-react-native";
import { Image } from "expo-image";

export function ProfileModal({
  visible,
  onClose,
  editingProfile,
  setEditingProfile,
  onSave,
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
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
              Modifier le profil
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#888888" size={24} />
            </TouchableOpacity>
          </View>

          {/* Photo de profil */}
          <View
            style={{
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#333333",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              {editingProfile.avatar ? (
                <Image
                  source={{ uri: editingProfile.avatar }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                  }}
                />
              ) : (
                <User color="#888888" size={40} />
              )}
            </View>
            <TouchableOpacity
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
              <Camera color="#000000" size={16} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#000000",
                }}
              >
                Changer la photo
              </Text>
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
                Nom complet
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
                value={editingProfile.name}
                onChangeText={(text) =>
                  setEditingProfile((prev) => ({ ...prev, name: text }))
                }
                placeholder="Votre nom complet"
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
                value={editingProfile.email}
                onChangeText={(text) =>
                  setEditingProfile((prev) => ({ ...prev, email: text }))
                }
                placeholder="votre.email@exemple.fr"
                placeholderTextColor="#666666"
                keyboardType="email-address"
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
                value={editingProfile.phone}
                onChangeText={(text) =>
                  setEditingProfile((prev) => ({ ...prev, phone: text }))
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
                Rôle
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
                value={editingProfile.role}
                onChangeText={(text) =>
                  setEditingProfile((prev) => ({ ...prev, role: text }))
                }
                placeholder="Votre rôle"
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
                Établissement
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
                value={editingProfile.institution}
                onChangeText={(text) =>
                  setEditingProfile((prev) => ({ ...prev, institution: text }))
                }
                placeholder="Nom de votre établissement"
                placeholderTextColor="#666666"
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
              onPress={onClose}
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
              onPress={onSave}
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
                Sauvegarder
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
