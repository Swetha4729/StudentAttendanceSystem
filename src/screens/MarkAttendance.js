import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Switch
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

// Mock WiFi info
const mockWifiInfo = {
  isEnabled: true,
  connectedSSID: 'Classroom_WiFi',
  expectedSSID: 'Classroom_WiFi',
};

export default function MarkAttendance({ route }) {
  const { username } = route.params;
  const [loading, setLoading] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const modalSlide = useRef(new Animated.Value(height)).current;

  // Theme colors
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const theme = {
    background: isDarkTheme ? '#121212' : '#f5f9ff',
    cardBackground: isDarkTheme ? '#1e1e2e' : '#ffffff',
    text: isDarkTheme ? '#ffffff' : '#333333',
    primary: isDarkTheme ? '#BB86FC' : '#4e7eff',
    success: isDarkTheme ? '#4ade80' : '#16a34a',
    error: isDarkTheme ? '#f87171' : '#dc2626',
    switchTrack: isDarkTheme ? '#767577' : '#a0c4ff',
    switchThumb: isDarkTheme ? '#4e7eff' : '#f4f3f4',
  };

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const openModal = () => {
    setShowVerificationModal(true);
    Animated.timing(modalSlide, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.back(1)),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalSlide, {
      toValue: height,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setShowVerificationModal(false));
  };

  const checkWifiAndStart = () => {
    animateButtonPress();
    
    if (!mockWifiInfo.isEnabled) {
      Alert.alert(
        'WiFi is off',
        'Please turn on WiFi to mark attendance.',
        [{ text: 'OK', style: 'cancel' }]
      );
      return;
    }

    if (mockWifiInfo.connectedSSID !== mockWifiInfo.expectedSSID) {
      Alert.alert(
        'Wrong WiFi Connection',
        `You are connected to "${mockWifiInfo.connectedSSID}". Please connect to: "${mockWifiInfo.expectedSSID}".`,
        [{ text: 'OK', style: 'cancel' }]
      );
      return;
    }

    setVerificationMethod(null);
    setAttendanceStatus(null);
    openModal();
  };

  const submitAttendance = async (status) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      Alert.alert('Submission Error', error.message);
      return null;
    }
  };

  const performVerification = async (method) => {
    setVerificationMethod(method);
    setLoading(true);
    closeModal();

    setTimeout(async () => {
      setLoading(false);
      const success = Math.random() > 0.3; // mock result
      const status = success ? 'present' : 'absent';

      await submitAttendance(status);

      if (success) {
        Alert.alert(
          'Verification Successful',
          `${method === 'face' ? 'Face' : 'Fingerprint'} verification passed. Attendance marked present.`,
          [{ text: 'OK', onPress: () => setAttendanceStatus('success') }]
        );
      } else {
        Alert.alert(
          'Verification Failed',
          `${method === 'face' ? 'Face' : 'Fingerprint'} did not match. Attendance marked absent.`,
          [{ text: 'OK', onPress: () => setAttendanceStatus('fail') }]
        );
      }
    }, 2000);
  };

  return (
    <Animated.View style={[styles.container, { 
      backgroundColor: theme.background,
      opacity: fadeAnim 
    }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.text }]}>
          Mark Your Attendance
        </Text>
        <View style={styles.themeToggle}>
          <Icon 
            name={isDarkTheme ? 'nights-stay' : 'wb-sunny'} 
            size={24} 
            color={theme.primary} 
          />
          <Switch
            value={isDarkTheme}
            onValueChange={() => setIsDarkTheme(!isDarkTheme)}
            thumbColor={theme.switchThumb}
            trackColor={{ false: theme.switchTrack, true: theme.switchTrack }}
          />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Icon 
          name="how-to-reg" 
          size={80} 
          color={theme.primary} 
          style={styles.mainIcon}
        />
        <Text style={[styles.instructionText, { color: theme.text }]}>
          Make sure you're connected to classroom WiFi before marking attendance
        </Text>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={[styles.markButton, { backgroundColor: theme.primary }]}
            onPress={checkWifiAndStart}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.markButtonText}>
                <Icon name="touch-app" size={20} color="#fff" /> Mark Attendance
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Current WiFi Status */}
        <View style={[styles.wifiStatus, { backgroundColor: theme.cardBackground }]}>
          <Icon 
            name={mockWifiInfo.isEnabled ? 'wifi' : 'wifi-off'} 
            size={24} 
            color={mockWifiInfo.connectedSSID === mockWifiInfo.expectedSSID ? theme.success : theme.error} 
          />
          <Text style={[styles.wifiText, { color: theme.text }]}>
            {mockWifiInfo.isEnabled 
              ? `Connected to: ${mockWifiInfo.connectedSSID}`
              : 'WiFi is disabled'}
          </Text>
        </View>
      </View>

      {/* Verification Modal */}
      <Modal 
        visible={showVerificationModal} 
        transparent 
        animationType="none" // We handle animation manually
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View 
            style={[
              styles.modalContent, 
              { 
                backgroundColor: theme.cardBackground,
                transform: [{ translateY: modalSlide }] 
              }
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Verify Your Identity
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.text }]}>
              Choose a verification method to mark attendance
            </Text>

            <TouchableOpacity
              style={[styles.verificationButton, { backgroundColor: theme.primary }]}
              onPress={() => performVerification('face')}
            >
              <Icon name="face" size={28} color="#fff" />
              <Text style={styles.verificationText}>Face Recognition</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.verificationButton, { backgroundColor: theme.primary }]}
              onPress={() => performVerification('fingerprint')}
            >
              <Icon name="fingerprint" size={28} color="#fff" />
              <Text style={styles.verificationText}>Fingerprint Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: theme.primary }]}
              onPress={closeModal}
            >
              <Text style={[styles.cancelText, { color: theme.primary }]}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Status Message */}
      {attendanceStatus && (
        <Animated.View 
          style={[
            styles.statusContainer,
            { 
              backgroundColor: attendanceStatus === 'success' ? theme.success : theme.error,
              opacity: fadeAnim
            }
          ]}
        >
          <Icon 
            name={attendanceStatus === 'success' ? 'check-circle' : 'error'} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.statusText}>
            {attendanceStatus === 'success' 
              ? 'Attendance marked successfully!' 
              : 'Attendance marked as absent'}
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  mainIcon: {
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
    lineHeight: 24,
  },
  markButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4e7eff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 30,
  },
  markButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    marginLeft: 10,
  },
  wifiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  wifiText: {
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: 40,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 30,
    textAlign: 'center',
  },
  verificationButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 10,
  },
  verificationText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    fontWeight: '600',
    fontSize: 16,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});