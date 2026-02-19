import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

export default function Chat({ route, navigation }) {
  // Read params passed from Start screen
  const { name = "Chat", backgroundColor = "#fff" } = route.params || {};

  // GiftedChat reads messages from this state
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Set the header title to the user's name
    navigation.setOptions({ title: name });

    // Add at least two static messages on load:
    // 1) A "system" message (we use a special user object to represent system)
    // 2) A user message
    setMessages([
      {
        _id: "sys-1",
        text: "✅ You’ve entered the chat.",
        createdAt: new Date(),
        user: {
          _id: "system",
          name: "System",
        },
      },
      {
        _id: "user-1",
        text: `Hey ${name || "there"}! Welcome 👋`,
        createdAt: new Date(),
        user: {
          _id: "bot",
          name: "Chat Bot",
        },
      },
    ]);
  }, [navigation, name]);

  // Called whenever the user sends a new message
  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  return (
    // KeyboardAvoidingView prevents the keyboard from covering the input toolbar
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust if needed
    >
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        // This identifies messages sent by the current user
        user={{ _id: 1, name }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});