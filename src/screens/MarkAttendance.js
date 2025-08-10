import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Alert, Text } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { TouchableOpacity } from 'react-native';

export default function MarkAttendance() {
  const [loading, setLoading] = useState(false);

  const handleAttendance = async () => {
    setLoading(true);
    const rnBiometrics = new ReactNativeBiometrics();

    try {
      const fingerprint = await rnBiometrics.simplePrompt({ promptMessage: 'Fingerprint Check' });
      if (!fingerprint.success) throw new Error('Fingerprint failed');

      // Simulated Face Recognition
      const faceSuccess = await mockFaceRecognition(); // replace with actual
      if (!faceSuccess) throw new Error('Face Recognition failed');

      Alert.alert('Success', 'Attendance marked with fingerprint and face ID!');
    } catch (err) {
      Alert.alert('Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const mockFaceRecognition = () => new Promise(resolve => setTimeout(() => resolve(true), 1500));

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f7' }}>
  {loading ? (
    <ActivityIndicator size="large" color="#3478f6" />
  ) : (
    <TouchableOpacity onPress={handleAttendance} style={{
      backgroundColor: '#3478f6', padding: 15, borderRadius: 10
    }}>
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Mark Attendance</Text>
    </TouchableOpacity>
  )}
</View>

  );
}
