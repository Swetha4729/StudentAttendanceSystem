import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function StudentDashboard({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>👩‍🎓 Student Dashboard</Text>

      <TouchableOpacity style={globalStyles.cardButton} onPress={() => navigation.navigate('ViewAttendance')}>
        <Text style={globalStyles.cardText}>📊 View Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.cardButton} onPress={() => navigation.navigate('MarkAttendance')}>
        <Text style={globalStyles.cardText}>🧬 Mark Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}
