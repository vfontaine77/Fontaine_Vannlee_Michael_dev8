import React from "react";
import { View, Text } from "react-native";

export function SettingSection({ title, children }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#D4AF37",
          marginBottom: 16,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: "#1A1A1A",
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#333333",
        }}
      >
        {children}
      </View>
    </View>
  );
}
