import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function ProfileScreen() {
  const { userProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name || "");
  const [email, setEmail] = useState(userProfile?.email || "");

  const handleSave = () => {
    updateProfile({ name, email });
    setIsEditing(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      updateProfile({ avatarUri: result.assets[0].uri });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <Pressable onPress={pickImage} style={styles.avatarContainer}>
          {userProfile?.avatarUri ? (
            <Image
              source={{ uri: userProfile.avatarUri }}
              style={styles.avatar}
            />
          ) : (
            <ThemedView style={styles.avatarPlaceholder}>
              <IconSymbol name="person.fill" size={40} color="#666" />
            </ThemedView>
          )}
          <ThemedView style={styles.editAvatarButton}>
            <IconSymbol name="camera.fill" size={12} color="#fff" />
          </ThemedView>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.form}>
        <ThemedView style={styles.field}>
          <ThemedText style={styles.label}>Name</ThemedText>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#666"
            />
          ) : (
            <ThemedText style={styles.value}>{userProfile?.name}</ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.field}>
          <ThemedText style={styles.label}>Email</ThemedText>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <ThemedText style={styles.value}>{userProfile?.email}</ThemedText>
          )}
        </ThemedView>

        <Pressable
          style={styles.button}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          <ThemedText style={styles.buttonText}>
            {isEditing ? "Save Changes" : "Edit Profile"}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#303030",
    alignItems: "center",
    justifyContent: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    padding: 20,
    width: "100%",
  },
  field: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: "#000",
    padding: 8,
  },
  input: {
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#666",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    minHeight: 40,
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
