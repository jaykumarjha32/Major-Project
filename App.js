import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";

import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import { Audio } from "expo-av";


const firebaseConfig = {
  ...
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const App = () => {
  const [bellRinging, setBellRinging] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require("./assets/beep.mp3")
      );
      setSound(sound);
    }

    loadSound();
    const bellRef = ref(db, "/drowsy");

    onValue(bellRef, (snapshot) => {
      const data = snapshot.val();
      setBellRinging(data);
    });

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [db, sound]);

  useEffect(() => {
    // Play the sound when bellRinging changes
    if (bellRinging && sound) {
      sound.playAsync().then(() => {
        // Repeat the sound if bellRinging is still true
        if (bellRinging) {
          sound.setPositionAsync(0); // Reset the position to the beginning
          sound.playAsync(); // Play the sound again
        }
      });
    }
  }, [bellRinging, sound]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{bellRinging ? "Bell is ringing!" : "Bell is silent"}</Text>
    </View>
  );
};

export default App;
