import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const VideoPlayerScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { url } = route.params; // Receiving Cloudinary URL from ChatBot

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.closeButton, { top: insets.top + 10 }]} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeText}>✕ Close</Text>
      </TouchableOpacity>
      
      <Video
        source={{ uri: url }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        useNativeControls
        style={styles.video}
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