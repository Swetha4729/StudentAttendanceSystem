import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/Dashboard';
import ViewAttendance from '../screens/ViewAttendance';
import MarkAttendance from '../screens/MarkAttendance';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Dashboard') iconName = 'home';
            else if (route.name === 'View Attendance') iconName = 'bar-chart';
            else if (route.name === 'Mark Attendance') iconName = 'checkmark-circle';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="View Attendance" component={ViewAttendance} />
        <Tab.Screen name="Mark Attendance" component={MarkAttendance} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
