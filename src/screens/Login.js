import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Switch, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Login({ navigation }) {
  const [role, setRole] = useState('student');
  const [isDark, setIsDark] = useState(false); // Theme state

  const handleLogin = () => {
    if (role === 'student') {
      navigation.navigate('StudentDashboard');
    } else {
      navigation.navigate('StaffDashboard');
    }
  };

  // Define theme colors
  const theme = {
    background: isDark ? '#121212' : '#f0f4f7',
    text: isDark ? '#fff' : '#333',
    inputBackground: isDark ? '#1e1e1e' : '#fff',
    placeholder: isDark ? '#aaa' : '#555',
    buttonBackground: '#3478f6',
    buttonText: '#fff',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Theme Toggle - Top Right */}
      <View style={styles.topRight}>
        <Switch value={isDark} onValueChange={() => setIsDark(!isDark)} />
      </View>

      {/* App Name */}
      <Text style={[styles.title, { color: theme.text }]}>Smart Attendance System</Text>

      {/* Input Fields */}
      <TextInput
        placeholder="Username"
        placeholderTextColor={theme.placeholder}
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={theme.placeholder}
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
      />

      {/* Role Picker */}
      <Text style={{ color: theme.text, marginTop: 10 }}>Login as:</Text>
      <View style={[styles.pickerContainer, { backgroundColor: theme.inputBackground }]}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={{ color: theme.text }}
          dropdownIconColor={theme.text}
        >
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Staff" value="staff" />
        </Picker>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBackground }]}
        onPress={handleLogin}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  topRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: {
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
