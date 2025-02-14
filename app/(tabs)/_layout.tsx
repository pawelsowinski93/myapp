import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Image } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ThemedView";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, logout, userProfile } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => {
        router.replace("/login");
      }, 0);
    }
  }, [isAuthenticated]);

  const renderHeaderRight = () => (
    <Pressable
      onPress={logout}
      style={styles.headerButton}
      accessibilityLabel="Logout"
    >
      <IconSymbol
        name="rectangle.portrait.and.arrow.right"
        size={24}
        color={Colors[colorScheme ?? "light"].text}
      />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <ThemedView style={styles.headerLeft}>
      {userProfile?.avatarUri ? (
        <Image
          source={{ uri: userProfile.avatarUri }}
          style={styles.headerAvatar}
        />
      ) : (
        <IconSymbol
          name="person.circle.fill"
          size={24}
          color={Colors[colorScheme ?? "light"].text}
        />
      )}
    </ThemedView>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: Platform.OS === "ios" ? 100 : 64,
        },
        headerRight: renderHeaderRight,
        headerLeft: renderHeaderLeft,
        headerTitleAlign: "center",
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          borderTopWidth: 1,
        },
        tabBarAccessibilityLabel: "Navigation bar",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 15,
    padding: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  headerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
});
