import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const COLORS = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

export default function Start({ navigation }) {
  const [name, setName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(COLORS[0]);

  const handleEnterChat = () => {
    navigation.navigate("Chat", { name, backgroundColor });
  };

  return (
    <ImageBackground
      source={require("../assets/background-image.png")}
      resizeMode="cover"
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        <Text style={styles.appTitle}>Let&apos;s Chat</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor="#666"
          />

          <Text style={styles.chooseColorText}>Choose Background Color:</Text>

          <View style={styles.colorRow}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                accessibilityLabel={`Choose color ${color}`}
                onPress={() => setBackgroundColor(color)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  backgroundColor === color ? styles.selectedCircle : null,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleEnterChat}>
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  appTitle: {
    marginTop: 40,
    fontSize: 45,
    fontWeight: "600",
    color: "#fff",
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 18,
    borderRadius: 12,
    marginBottom: 30,
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  chooseColorText: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25, // half of 50 = circle
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCircle: {
    borderColor: "#333",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#757083",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});