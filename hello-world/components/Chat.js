import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

export default function Chat({ route, navigation }) {
  const { name = "Chat", backgroundColor = "#fff" } = route.params || {};

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>Chat screen (UI coming next exercise)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    color: "#000",
  },
});