import React, { createContext, useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  timestamp: number;
  attachment?: {
    type: "image";
    uri: string;
  };
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (
    content: string,
    attachment?: Message["attachment"]
  ) => Promise<void>;
  pickImage: () => Promise<string | null>;
  clearChat: () => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const pickImage = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission required");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled) {
        return result.assets[0].uri;
      }
    } catch (error) {
      console.error("Image picker error:", error);
    }
    return null;
  }, []);

  const sendMessage = useCallback(
    async (content: string, attachment?: Message["attachment"]) => {
      const timestamp = Date.now();
      const userMessage: Message = {
        id: `user-${timestamp}`,
        role: "user",
        content,
        timestamp,
        attachment,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const aiMessage: Message = {
          id: `ai-${timestamp + 1}`,
          role: "assistant",
          content: "",
          timestamp: timestamp + 1,
          isStreaming: true,
        };
        setMessages((prev) => [...prev, aiMessage]);

        const response = attachment
          ? `I see you've shared an image. Here's my response about: "${content}"`
          : `This is a streaming response to: "${content}"`;

        const tokens = response.split(" ");

        for (const token of tokens) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessage.id
                ? { ...msg, content: msg.content + token + " " }
                : msg
            )
          );
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessage.id ? { ...msg, isStreaming: false } : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
        pickImage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
