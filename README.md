# Let's Chat!

**Let's Chat!** is a React Native chat application built using Expo and Firebase. The app allows users to chat in real-time, share images, and send their location. It supports offline functionality by caching messages locally and reconnecting to Firebase when the network is restored.

## Table of Contents
- [Let's Chat!](#lets-chat)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies used](#technologies-used)
  - [Setup and Installation](#setup-and-installation)
    - [Installation](#installation)
    - [Firebase Setup](#firebase-setup)
    - [Running the App](#running-the-app)
  - [License](#license)

## Features
- Anonymous authentication using Firebase Auth
- Real-time chat powered by Firestore
- Offline support with AsyncStorage
- Image sharing via Firebase Storage
- Location sharing with react-native-maps
- Customizable chat background colors
- Network status detection with @react-native-community/netinfo

## Technologies used
- React Native (Expo)
- Firebase (Auth, Firestore, Storage)
- React Navigation
- Gifted Chat
- AsyncStorage


## Setup and Installation

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/RobAtD/lets-chat.git
   ```
2. Navigate into the project directory:
   ```
   cd lets-chat
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the Expo development server:
   ```
   npx expo start
   ```

### Firebase Setup
This project uses Firebase for authentication, database, and storage. To use it, follow these steps:

1. Create a Firebase project at Firebase Console.
2. Enable Authentication (Anonymous Sign-in).
3. Set up Firestore Database in test mode.
4. Enable Firebase Storage for image uploads.
5. Replace the firebaseConfig in App.js with your Firebase credentials.

### Running the App
1. Run the app using Expo on a physical device or emulator.
2. Enter your name and select a background color.
3. Click "Start Chatting" to navigate to the chat screen.
4. Send messages, share images, and send your location.

## License
This project is licensed under the MIT License.