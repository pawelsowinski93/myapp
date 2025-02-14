import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserProfile {
  name: string;
  email: string;
  avatarUri?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load saved user data on mount
  useEffect(() => {
    loadSavedUser();
  }, []);

  const loadSavedUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("userProfile");
      if (savedUser) {
        setUserProfile(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error loading saved user:", error);
    }
  };

  const login = async (email: string, password: string) => {
    if (email === "test@example.com" && password === "password123") {
      const profile = {
        name: "Test User",
        email: email,
      };
      setIsAuthenticated(true);
      setUserProfile(profile);
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
      return true;
    }
    return false;
  };

  const updateProfile = useCallback(async (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = prev ? { ...prev, ...profile } : null;
      if (updated) {
        AsyncStorage.setItem("userProfile", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    await AsyncStorage.removeItem("userProfile");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
