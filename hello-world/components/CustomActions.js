import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, sendMessage, storage, userId, isConnected }) => {
    const actionSheet = useActionSheet();

    const generateReference = (uri) => {
        const timeStamp = new Date().getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `images/${userId}-${timeStamp}-${imageName}`;
    };

    const uploadAndSendImage = async (imageURI) => {
        if (isConnected !== true) return;

        try {
            const uniqueRefString = generateReference(imageURI);
            const newUploadRef = ref(storage, uniqueRefString);
            const response = await fetch(imageURI);
            const blob = await response.blob();
            const snapshot = await uploadBytes(newUploadRef, blob);
            const imageURL = await getDownloadURL(snapshot.ref);


            onSend([{
                _id: `temp-img-${Date.now()}`,
                createdAt: new Date(),
                user: { _id: userId },
                image: imageURL,
            }]);
        } catch (error) {
            console.log("Upload error:", error.message);
            Alert.alert("Unable to send image. Please try again.");
        }
    };

    const pickImage = async () => {
        if (isConnected !== true) return;
        const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissions?.granted) {
            Alert.alert("Permission required", "Please allow access to your photo library.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            await uploadAndSendImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        if (isConnected !== true) return;
        const permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissions?.granted) {
            Alert.alert("Permission required", "Please allow access to your camera.");
            return;
        }
        const result = await ImagePicker.launchCameraAsync();
        if (!result.canceled) {
            await uploadAndSendImage(result.assets[0].uri);
        }
    };

    const getLocation = async () => {
        if (isConnected !== true) return;

        const permissions = await Location.requestForegroundPermissionsAsync();
        if (!permissions?.granted) {
            Alert.alert("Permission required", "Please allow location access.");
            return;
        }

        try {
            const location = await Location.getCurrentPositionAsync({});
            if (!location) {
                Alert.alert("Unable to fetch location.");
                return;
            }

            const message = {
                _id: `temp-loc-${Date.now()}`,
                createdAt: new Date(),
                user: { _id: userId },
                location: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                },
            };

            onSend([message]);
        } catch (error) {
            console.log("Location error:", error.message);
            Alert.alert("Unable to fetch location. Please try again.");
        }
    };

    const onActionPress = () => {
        const options = ["Select an image from library", "Take a photo", "Share location", "Cancel"];
        const cancelButtonIndex = options.length - 1;

        actionSheet.showActionSheetWithOptions(
            { options, cancelButtonIndex },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        await pickImage();
                        return;
                    case 1:
                        await takePhoto();
                        return;
                    case 2:
                        await getLocation();
                        return;
                    default:
                        return;
                }
            }
        );
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onActionPress}
            accessibilityLabel="More options"
            accessibilityHint="Opens menu to send an image, take a photo, or share location"
            accessibilityRole="button"
        >
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
};

export default CustomActions;

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: "#b2b2b2",
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: "#b2b2b2",
        fontWeight: "bold",
        fontSize: 10,
        backgroundColor: "transparent",
        textAlign: "center",
        lineHeight: 22,
    },
});