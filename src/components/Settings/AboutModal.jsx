import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { APP_CONFIG, SDK_REQUIREMENTS } from "@/utils/constants";

export function AboutModal({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
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
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: "#D4AF37",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#000000",
              }}
            >
              C
            </Text>
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#D4AF37",
              marginBottom: 8,
            }}
          >
            C-management
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#CCCCCC",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Version {APP_CONFIG.version}
            {"\n"}
            Expo SDK {SDK_REQUIREMENTS.expo} (Requis){"\n"}
            Application de gestion scolaire
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#888888",
              textAlign: "center",
              marginBottom: 24,
              lineHeight: 20,
            }}
          >
            Développé avec React Native et Expo SDK {SDK_REQUIREMENTS.expo}
            {"\n"}
            Design ultra-élégant en Noir & Or{"\n"}
            {APP_CONFIG.copyright}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: "#D4AF37",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#000000",
              }}
            >
              Fermer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
