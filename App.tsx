import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View, Alert} from "react-native";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';

const SERVER_URL = 'http://44.202.160.166:3000/upload/';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const saveVideo = async (videoUri:string) => {
    try {
      const newUri = FileSystem.documentDirectory + `my_video.mp4`;
      await FileSystem.moveAsync({ from: videoUri, to: newUri });
      setVideoUri(newUri);
      console.log('Video saved at:', newUri);
      return newUri;
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const uploadVideo = async (videoUri: string) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: videoUri,
        name: 'video.mp4',
        type: 'video/mp4',
      });
  
      const uploadResponse = await fetch(SERVER_URL, {
        method: "POST",
        body: formData,
        headers: {'Content-Type': 'multipart/form-data'},
      });
  
      const data = await uploadResponse.json();
      console.log("Upload success:", data);
      Alert.alert("Success", "Video uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Error", "Failed to upload video.");
    }
  };
  
  const recordVideo = async () => {
    if (recording) {
      setRecording(false);
      ref.current?.stopRecording();
      return;
    }
  
    setRecording(true);
    const video = await ref.current?.recordAsync();
    const new_uri = await saveVideo(video.uri);
    await uploadVideo(new_uri);
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        mode="video"
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.shutterContainer}>
          <View style={[{width: 32}]}></View>
          <Pressable onPress={recordVideo}>
            {({ pressed }) => (
              <View style={[styles.shutterBtn,{ opacity: pressed ? 0.5 : 1}]}>
                <View style={[styles.shutterBtnInner, {backgroundColor: recording ? "white" : "red"}]}/>
              </View>
            )}
          </Pressable>
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </CameraView>
    );
  };

  const renderVideo = () => {
    return (
      <View>
        <Video
          source={{ uri: videoUri }}
          style={{ width: 300, height: 200 }}
          useNativeControls
          shouldPlay
        />
        <Button onPress={() => setVideoUri(null)} title="Take another video" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {videoUri ? renderVideo() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});