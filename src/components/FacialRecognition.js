import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const FaceRecognition = () => {
  const startFaceRecognition = async () => {
    // Mock function (replace with actual face recognition logic)
    console.log("Face Recognition in progress...");
  };

  useEffect(() => {
    startFaceRecognition();
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Facial Recognition</Text>
    </View>
  );
};

export default FaceRecognition;
