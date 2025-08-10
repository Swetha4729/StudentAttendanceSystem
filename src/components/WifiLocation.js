import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import NetworkInfo from 'react-native-network-info';
import { globalStyles } from '../styles/globalStyles';

export default function WifiLocation() {
  const [ssid, setSsid] = useState('Fetching...');

  useEffect(() => {
    NetworkInfo.getSSID()
      .then(ssid => setSsid(ssid || 'Not Connected'))
      .catch(() => setSsid('Error fetching Wi-Fi info'));
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Connected Wi-Fi</Text>
      <Text>{ssid}</Text>
    </View>
  );
}
