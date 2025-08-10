import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { globalStyles } from '../styles/globalStyles';

const FingerprintAuth = () => {
  useEffect(() => {
    const authenticate = async () => {
      try {
        await FingerprintScanner.authenticate({ description: 'Scan your fingerprint' });
        console.log('Authentication successful');
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    };

    authenticate();

    return () => FingerprintScanner.release();
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Fingerprint Authentication</Text>
    </View>
  );
};

export default FingerprintAuth;
