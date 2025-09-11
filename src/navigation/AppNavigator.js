import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import StudentDashboard from '../screens/StudentDashboard';
import StaffDashboard from '../screens/StaffDashboard';
import ViewAttendance from '../screens/ViewAttendance';
import MarkAttendance from '../screens/MarkAttendance';
import ModifyAttendance from '../screens/ModifyAttendance';
import StaffViewAttendance from '../screens/StaffViewAttendance';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
      <Stack.Screen name="StaffDashboard" component={StaffDashboard} />
      <Stack.Screen name="ViewAttendance" component={ViewAttendance} />
      <Stack.Screen name="MarkAttendance" component={MarkAttendance} />
      <Stack.Screen name="ModifyAttendance" component={ModifyAttendance} />
      <Stack.Screen name="StaffViewAttendance" component={StaffViewAttendance} />
    </Stack.Navigator>
  );
}
