import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";

export function SettingRow({
  title,
  subtitle,
  icon: Icon,
  onPress,
  rightComponent,
  showChevron = true,
  isLast = false,
  backgroundColor = "transparent",
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: "#333333",
      }}
    >
      <Icon color="#D4AF37" size={20} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#FFFFFF",
            marginBottom: subtitle ? 2 : 0,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontSize: 14,
              color: "#888888",
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent && (
        <View style={{ marginRight: 8 }}>{rightComponent}</View>
      )}
      {showChevron && <ChevronRight color="#666666" size={20} />}
    </TouchableOpacity>
  );
}
