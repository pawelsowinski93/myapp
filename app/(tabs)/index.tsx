import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { Message, useChat } from "@/contexts/ChatContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function ChatScreen() {
  const { messages, isLoading, sendMessage, pickImage } = useChat();
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [isRecording, setIsRecording] = useState(false);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImagePick = async () => {
    const uri = await pickImage();
    if (uri) {
      setSelectedImage(uri);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    try {
      const content = input;
      const attachment = selectedImage
        ? { type: "image" as const, uri: selectedImage }
        : undefined;

      setInput("");
      setSelectedImage(null);
      await sendMessage(content, attachment);
    } catch (error) {
      Alert.alert("Error", "Failed to send message. Please try again.");
      console.error("Send message error:", error);
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      alert(
        "Voice recording requires a native development build. This is a demo mode."
      );
      setTimeout(() => setIsRecording(false), 2000);
    } catch (error) {
      console.error(error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <>
      {item.attachment?.type === "image" && (
        <Image
          source={{ uri: item.attachment.uri }}
          style={styles.attachedImage}
        />
      )}
      <ThemedView
        style={[
          styles.message,
          item.role === "user" ? styles.userMessage : styles.aiMessage,
        ]}
      >
        <ThemedText style={{ color: "#fff" }}>{item.content}</ThemedText>
        {item.isStreaming && (
          <ThemedText style={styles.streamingIndicator}>▋</ThemedText>
        )}
      </ThemedView>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={true}
        style={{ flex: 1 }}
        onContentSizeChange={scrollToBottom}
      />
      {selectedImage && (
        <ThemedView style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <Pressable
            onPress={() => setSelectedImage(null)}
            style={styles.removePreview}
          >
            <ThemedText
              style={{
                color: "#fff",
                fontSize: 12,
              }}
            >
              ✕
            </ThemedText>
          </Pressable>
        </ThemedView>
      )}
      <ThemedView style={styles.inputContainer}>
        <Pressable onPress={handleImagePick} style={styles.attachButton}>
          <IconSymbol size={20} name="photo" color="#fff" />
        </Pressable>

        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          style={[styles.micButton, isRecording && styles.micButtonRecording]}
        >
          <IconSymbol
            size={20}
            name={isRecording ? "mic.fill" : "mic"}
            color={isRecording ? "#ff0000" : "#fff"}
          />
        </Pressable>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          multiline
        />

        <Pressable
          onPress={handleSend}
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
          disabled={isLoading}
        >
          <IconSymbol
            size={20}
            name={isLoading ? "ellipsis" : "arrow.up.circle.fill"}
            color="#000"
          />
        </Pressable>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
    backgroundColor: "#212121E6",
    color: "#fff",
  },
  messageList: {
    padding: 15,
    justifyContent: "flex-end",
    color: "#fff",
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "80%",
    color: "#fff",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#303030",
    color: "#fff",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#303030",
    borderRadius: 10,
    margin: 6,
    color: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#303030",
    color: "#fff",
    marginRight: 10,
  },
  sendButton: {
    justifyContent: "center",
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#fff",
    color: "#000",
  },
  sendButtonDisabled: {
    opacity: 0.5,
    color: "#000",
  },
  sendButtonText: {
    color: "#000",
  },
  streamingIndicator: {
    marginLeft: 4,
    opacity: 0.5,
    color: "#fff",
  },
  attachedImage: {
    width: 160,
    height: 100,
    borderRadius: 10,
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  previewContainer: {
    padding: 10,
    backgroundColor: "#303030",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removePreview: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  attachButton: {
    padding: 10,
    justifyContent: "center",
  },
  micButton: {
    padding: 10,
    justifyContent: "center",
  },
  micButtonRecording: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 20,
  },
});
