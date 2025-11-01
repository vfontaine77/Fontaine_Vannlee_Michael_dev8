import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { User, ChevronRight } from "lucide-react-native";
import { Image } from "expo-image";

export function ProfileSection({ userProfile, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#333333",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 16,
        }}
      >
        {userProfile.avatar ? (
          <Image
            source={{ uri: userProfile.avatar }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
          />
        ) : (
          <User color="#888888" size={24} />
        )}
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
          {userProfile.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#4ECDC4",
            marginBottom: 2,
          }}
        >
          {userProfile.role}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#888888",
          }}
        >
          {userProfile.institution}
        </Text>
      </View>
      <ChevronRight color="#666666" size={20} />
    </TouchableOpacity>
  );
}
