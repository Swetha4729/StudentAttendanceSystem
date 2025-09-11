import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import StudentDashboard from './src/screens/StudentDashboard';
import StaffDashboard from './src/screens/StaffDashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
          <Stack.Screen name="StaffDashboard" component={StaffDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
