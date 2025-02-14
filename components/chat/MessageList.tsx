import { FlatList, StyleSheet } from "react-native";
import { Message } from "@/contexts/ChatContext";
import { ChatMessage } from "./ChatMessage";

interface Props {
  messages: Message[];
  onContentSizeChange: () => void;
}

export function MessageList({ messages, onContentSizeChange }: Props) {
  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => <ChatMessage message={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.messageList}
      showsVerticalScrollIndicator={true}
      style={{ flex: 1 }}
      onContentSizeChange={onContentSizeChange}
    />
  );
}

const styles = StyleSheet.create({
  messageList: {
    padding: 15,
    justifyContent: "flex-end",
  },
});
