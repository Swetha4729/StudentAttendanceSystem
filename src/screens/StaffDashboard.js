import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function StaffDashboard({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>👨‍🏫 Staff Dashboard</Text>

      <TouchableOpacity style={globalStyles.cardButton} onPress={() => navigation.navigate('ViewAttendance')}>
        <Text style={globalStyles.cardText}>📈 View Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.cardButton} onPress={() => navigation.navigate('ModifyAttendance')}>
        <Text style={globalStyles.cardText}>✏️ Modify Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}
