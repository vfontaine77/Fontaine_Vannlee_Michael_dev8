import React from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { X } from "lucide-react-native";

export function WeightsModal({
  visible,
  onClose,
  editingWeights,
  setEditingWeights,
  onSave,
}) {
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
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#1A1A1A",
            borderRadius: 24,
            padding: 20,
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
              Coefficients par défaut
            </Text>
            <TouchableOpacity onPress={onClose}>
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
                Devoirs et contrôles (%):
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
                value={editingWeights.devoirs.toString()}
                onChangeText={(text) =>
                  setEditingWeights((prev) => ({
                    ...prev,
                    devoirs: parseInt(text) || 0,
                  }))
                }
                keyboardType="numeric"
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
                Examens (%):
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
                value={editingWeights.examens.toString()}
                onChangeText={(text) =>
                  setEditingWeights((prev) => ({
                    ...prev,
                    examens: parseInt(text) || 0,
                  }))
                }
                keyboardType="numeric"
              />
            </View>

            <View
              style={{
                backgroundColor: "#2A1810",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color:
                    editingWeights.devoirs + editingWeights.examens === 100
                      ? "#4CAF50"
                      : "#F39C12",
                  fontWeight: "600",
                }}
              >
                Total: {editingWeights.devoirs + editingWeights.examens}%
                {editingWeights.devoirs + editingWeights.examens !== 100 &&
                  " (doit égaler 100%)"}
              </Text>
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
        </View>
      </View>
    </Modal>
  );
}
