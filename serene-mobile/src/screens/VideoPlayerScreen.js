import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
// ⬅️ NEW: Import the modern expo-video tools
import { useVideoPlayer, VideoView } from 'expo-video';

const VideoPlayerScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { url } = route.params; // Receiving Cloudinary URL from ChatBot

  // ⬅️ NEW: Initialize the player hook
  const player = useVideoPlayer(url, (player) => {
    player.play(); // This replaces 'shouldPlay'
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.closeButton, { top: insets.top + 10 }]} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeText}>✕ Close</Text>
      </TouchableOpacity>
      
      {/* ⬅️ NEW: The VideoView component replacing expo-av */}
      <VideoView
        style={styles.video}
        player={player}
        contentFit="contain" // This entirely replaces ResizeMode.CONTAIN
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  video: { width: '100%', height: '80%' },
  closeButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  closeText: { color: '#fff', fontFamily: 'Quicksand-Bold' }
});

export default VideoPlayerScreen;