import React, { useEffect, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

export default function Chat({ route, navigation, db }) {
  // Read params passed from Start screen
  const { userId, name = "Anonymous", backgroundColor = "#fff" } = route.params || {};

  // GiftedChat reads messages from this state
  const [messages, setMessages] = useState([]);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({ title: name || "Chat" });

    // Real-time listener for messages, newest first
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          _id: doc.id,
          ...data,
          createdAt: data.createdAt?.toMillis
            ? new Date(data.createdAt.toMillis())
            : new Date(),
        };
      });

      setMessages(newMessages);
    });

    // Clean up the listener when leaving the screen
    return () => unsubscribe();
  }, [db, navigation, name]);

  // Save sent messages to Firestore
  const onSend = (newMessages = []) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        // This is what your peer does: use safe-area inset instead of a hard-coded 100
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => onSend(newMessages)}
          user={{ _id: String(userId || "unknown-user"), name: name || "Anonymous" }}
          alwaysShowSend
          // This is a common “can’t tap input” fix:
          listViewProps={{ keyboardShouldPersistTaps: "handled" }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});