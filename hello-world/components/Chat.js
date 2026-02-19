import React, { useEffect, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";




export default function Chat({ route, navigation, db, isConnected }) {
  // Read params passed from Start screen
  const { userId, name = "Anonymous", backgroundColor = "#fff" } = route.params || {};
  // GiftedChat reads messages from this state
  const [messages, setMessages] = useState([]);
  const insets = useSafeAreaInsets();


  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log("Error caching messages:", error.message);
    }
  };

  const loadCachedMessages = async () => {
    try {
      const cached = (await AsyncStorage.getItem("messages")) || "[]";
      const parsed = JSON.parse(cached);
      setMessages(parsed);
    } catch (error) {
      console.log("Error loading cached messages:", error.message);
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: name || "Chat" });
    let unsubscribe;

    if (isConnected === true) {
      // Real-time listener for messages (newest first)
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            _id: data._id || doc.id,
            ...data,
            // Firestore Timestamp -> Date for GiftedChat
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          };
        });

        setMessages(newMessages);
        cacheMessages(newMessages);
      });
    } else if (isConnected === false) {
      loadCachedMessages();
    }

    // Cleanup listener (avoid memory leaks)
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, navigation, name, isConnected]);

  const onSend = (newMessages = []) => {
    if (isConnected !== true) return;
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Hide the input when offline so users can’t send messages
  const renderInputToolbar = (props) => {
    if (isConnected === true) return <InputToolbar {...props} />;
    return null;
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
          renderInputToolbar={renderInputToolbar}
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