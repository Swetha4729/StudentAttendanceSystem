import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { TouchableOpacity } from 'react-native';

export default function ModifyAttendance() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Modify Attendance</Text>
      <TouchableOpacity style={globalStyles.cardButton} onPress={() => Alert.alert('Attendance Modified')}>
  <Text style={globalStyles.cardText}>Modify Sample Record</Text>
</TouchableOpacity>

    </View>
  );
}
