import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
  Alert,
  Linking,
  Image
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Login({ navigation }) {
  const [role, setRole] = useState('student');
  const [isDark, setIsDark] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false
  });
  
  // Animation refs
  const buttonScale = useRef(new Animated.Value(1)).current;
  const roleButtonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.easeOut,
        useNativeDriver: true
      })
    ]).start();
  };

  const animateRoleButton = () => {
    Animated.sequence([
      Animated.timing(roleButtonScale, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(roleButtonScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.easeOut,
        useNativeDriver: true
      })
    ]).start();
  };

  useEffect(() => {
  navigation.setOptions({
    headerLeft: () => (
      <Animated.View style={{ opacity: fadeAnim, marginLeft: 10 }}>
        <Image
          source={require('../assets/logo.png')}
          style={{ width: 90, height: 50, resizeMode: 'contain' }}
        />
      </Animated.View>
    ),
    headerTitle: () => (
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#fff' : '#000', textAlign: 'center' }}>
          Login
        </Text>
      </Animated.View>
    ),
    headerRight: () => (
      <Animated.View style={[styles.themeContainer, { opacity: fadeAnim }]}>
        <Icon 
          name={isDark ? 'nights-stay' : 'wb-sunny'} 
          size={24} 
          color={isDark ? '#BB86FC' : '#6200EE'} 
          style={styles.themeIcon}
        />
        <Switch
          value={isDark}
          onValueChange={() => setIsDark(!isDark)}
          thumbColor={isDark ? '#4e7eff' : '#f4f3f4'}
          trackColor={{ false: '#a0c4ff', true: '#a0c4ff' }}
        />
      </Animated.View>
    ),
    headerStyle: {
      backgroundColor: isDark ? '#121212' : '#f0f4f7',
    },
    headerTitleAlign: 'center',
    headerTitleContainerStyle: {
      left: 40,
      right: 40,
    },
  });
}, [navigation, isDark, fadeAnim]);

  const validateField = (name, value) => {
    if (name === 'username') {
      setErrors({
        ...errors,
        username: value.trim() ? '' : 'Username is required'
      });
    } else if (name === 'password') {
      if (!value.trim()) {
        setErrors({
          ...errors,
          password: 'Password is required'
        });
      } else if (value.length < 8) {
        setErrors({
          ...errors,
          password: 'Password must be 8 characters'
        });
      } else {
        setErrors({
          ...errors,
          password: ''
        });
      }
    }
  };

  const handleLogin = () => {
    validateField('username', username);
    validateField('password', password);

    if (errors.username || errors.password || !username.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);
    animateButton();
    
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'student') {
        navigation.navigate('StudentDashboard', { username, rememberMe });
      } else {
        navigation.navigate('StaffDashboard', { username, rememberMe });
      }
    }, 1500);
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    animateRoleButton();
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password?",
      "Please contact your system administrator to reset your password.",
      [
        { text: "OK", style: "default" },
        { 
          text: "Contact Admin", 
          onPress: () => Linking.openURL('mailto:admin@yourschool.edu?subject=Password Reset Request')
        }
      ]
    );
  };

  const theme = {
    background: isDark ? '#121212' : '#f0f4f7',
    text: isDark ? '#fff' : '#333',
    inputBackground: isDark ? '#1e1e1e' : '#fff',
    placeholder: isDark ? '#aaa' : '#555',
    buttonBackground: '#3478f6',
    buttonText: '#fff',
    errorText: '#ff4444',
    roleActive: isDark ? '#BB86FC' : '#6200EE',
    roleInactive: isDark ? '#2c2c2c' : '#f5f5f5',
    iconColor: isDark ? '#BB86FC' : '#6200EE',
    rememberActive: isDark ? '#BB86FC' : '#6200EE',
    rememberInactive: isDark ? '#333' : '#ddd',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {/* Background layers */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }]} />
      <LinearGradient
        colors={isDark ? ['#121212', '#1e1e1e'] : ['#f0f4f7', '#e0e9f1']}
        style={[StyleSheet.absoluteFill, { opacity: 0.9 }]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        pointerEvents="none"
      />
      
      {/* Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: 'transparent' }]}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.centerContent, { opacity: fadeAnim }]}>
          <Text style={[styles.title, { color: theme.text }]}>Smart Attendance System</Text>
          
          {/* Username Input */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Icon name="person" size={18} color={isFocused.username ? theme.iconColor : theme.placeholder} />
              <Text style={[styles.label, { color: isFocused.username ? theme.iconColor : theme.placeholder }]}>
                Username
              </Text>
            </View>
            <TextInput
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                validateField('username', text);
              }}
              placeholder="Enter your username"
              placeholderTextColor={theme.placeholder}
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.inputBackground, 
                  color: theme.text,
                  borderColor: isFocused.username ? theme.iconColor : errors.username ? theme.errorText : '#ddd',
                  borderWidth: isFocused.username || errors.username ? 1.5 : 1,
                }
              ]}
              onFocus={() => setIsFocused({...isFocused, username: true})}
              onBlur={() => {
                setIsFocused({...isFocused, username: false});
                validateField('username', username);
              }}
            />
            {errors.username ? (
              <View style={styles.errorContainer}>
                <Icon name="error" size={14} color={theme.errorText} />
                <Text style={[styles.errorText, { color: theme.errorText }]}>{errors.username}</Text>
              </View>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Icon name="lock" size={18} color={isFocused.password ? theme.iconColor : theme.placeholder} />
              <Text style={[styles.label, { color: isFocused.password ? theme.iconColor : theme.placeholder }]}>
                Password
              </Text>
            </View>
            <View style={[
              styles.passwordContainer, 
              { 
                backgroundColor: theme.inputBackground,
                borderColor: isFocused.password ? theme.iconColor : errors.password ? theme.errorText : '#ddd',
                borderWidth: isFocused.password || errors.password ? 1.5 : 1,
              }
            ]}>
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  validateField('password', text);
                }}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                placeholderTextColor={theme.placeholder}
                style={[
                  styles.passwordInput, 
                  { 
                    color: theme.text,
                  }
                ]}
                onFocus={() => setIsFocused({...isFocused, password: true})}
                onBlur={() => {
                  setIsFocused({...isFocused, password: false});
                  validateField('password', password);
                }}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={showPassword ? 'visibility-off' : 'visibility'} 
                  size={22} 
                  color={theme.placeholder} 
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <View style={styles.errorContainer}>
                <Icon name="error" size={14} color={theme.errorText} />
                <Text style={[styles.errorText, { color: theme.errorText }]}>{errors.password}</Text>
              </View>
            ) : null}
          </View>

          {/* Remember Me and Forgot Password */}
          <View style={styles.rememberForgotContainer}>
            <View style={styles.rememberContainer}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: theme.rememberInactive, true: theme.rememberActive }}
                thumbColor={rememberMe ? '#fff' : '#f4f3f4'}
              />
              <Text style={{ color: theme.text, marginLeft: 10 }}>Remember me</Text>
            </View>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={{ color: theme.iconColor }}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.loginAsText, { color: theme.text }]}>Login as:</Text>
          
          {/* Role Selection */}
          <View style={styles.roleContainer}>
            {[
              { id: 'student', label: 'Student', icon: 'school' },
              { id: 'staff', label: 'Staff', icon: 'work' }
            ].map((item) => (
              <Animated.View 
                key={item.id}
                style={{ 
                  transform: [{ scale: role === item.id ? roleButtonScale : 1 }],
                  flex: 1,
                  marginHorizontal: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleRoleChange(item.id)}
                  style={[
                    styles.roleButton,
                    { 
                      backgroundColor: role === item.id ? theme.roleActive : theme.roleInactive,
                      shadowColor: role === item.id ? theme.roleActive : 'transparent',
                    }
                  ]}
                >
                  <Icon 
                    name={item.icon} 
                    size={24} 
                    color={role === item.id ? '#fff' : theme.text} 
                    style={{ marginRight: 8 }} 
                  />
                  <Text style={{ 
                    color: role === item.id ? '#fff' : theme.text, 
                    fontWeight: 'bold' 
                  }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.button, { 
                backgroundColor: theme.buttonBackground,
                opacity: (errors.username || errors.password || !username.trim() || !password.trim()) ? 0.6 : 1
              }]}
              onPress={handleLogin}
              disabled={isLoading || !!errors.username || !!errors.password}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={[styles.buttonText, { color: theme.buttonText }]}>Login</Text>
                  <Icon name="arrow-forward" size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  centerContent: { 
    paddingHorizontal: 20,
  },
  themeContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 10,
},
themeIcon: {
  marginRight: 8,
},
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 70,
    marginTop: 0,
  },
  inputContainer: {
    marginBottom: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  input: { 
    marginVertical: 5, 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    paddingVertical: 14, 
    fontSize: 16,
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 5,
    paddingRight: 15,
    borderWidth: 1,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 5,
  },
  roleContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25,
  },
  roleButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  loginAsText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  button: { 
    marginTop: 25, 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: { 
    fontWeight: 'bold', 
    fontSize: 16,
    marginRight: 8,
  },
});