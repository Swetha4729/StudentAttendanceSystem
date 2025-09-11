import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Switch, 
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

async function getUserName() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Swetha'); 
    }, 1000);
  });
}

export default function StudentDashboard({ navigation, route }) {
  const username = route?.params?.username;
  const [userName, setUserName] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(headerTranslateY, {
        toValue: 0,
        tension: 10,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start();

    // Fetch username
    async function fetchUserName() {
      const name = await getUserName();
      setUserName(name);
    }
    fetchUserName();
  }, []);

  const toggleTheme = () => setIsDarkTheme(prev => !prev);

  // Theme colors
  const theme = {
    background: isDarkTheme ? '#121212' : '#f5f9ff',
    headerGradient: isDarkTheme 
      ? ['#2c3e50', '#4ca1af'] 
      : ['#4e7eff', '#6a8eff'],
    cardBackground: isDarkTheme ? '#1e1e2e' : '#ffffff',
    text: isDarkTheme ? '#ffffff' : '#333333',
    cardText: isDarkTheme ? '#a0c4ff' : '#4e7eff',
    icon: isDarkTheme ? '#bb86fc' : '#4e7eff',
    shadow: isDarkTheme ? '#00000040' : '#4e7eff20',
    switchTrack: isDarkTheme ? '#767577' : '#a0c4ff',
    switchThumb: isDarkTheme ? '#4e7eff' : '#f4f3f4',
  };

  // Create animated values for each card
  const card1Scale = useRef(new Animated.Value(1)).current;
  const card2Scale = useRef(new Animated.Value(1)).current;

  const handleCardPressIn = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPressOut = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { 
      backgroundColor: theme.background,
      opacity: fadeAnim 
    }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.themeContainer}>
          <Icon 
            name={isDarkTheme ? 'nights-stay' : 'wb-sunny'} 
            size={24} 
            color={theme.icon} 
            style={styles.themeIcon}
          />
          <Switch
            value={isDarkTheme}
            onValueChange={toggleTheme}
            thumbColor={theme.switchThumb}
            trackColor={{ false: theme.switchTrack, true: theme.switchTrack }}
          />
        </View>
      </View>

      {/* Dashboard Header */}
      <Animated.View style={[
        styles.dashboardHeader, 
        { 
          transform: [{ translateY: headerTranslateY }],
        }
      ]}>
        <LinearGradient
          colors={theme.headerGradient}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Text style={[styles.title, { color: theme.text }]}>
          <Icon name="school" size={26} color={theme.text} /> Student Dashboard
        </Text>
        {userName ? (
          <Text style={[styles.subtitle, { color: theme.text }]}>
            Welcome back, {userName}!
          </Text>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.text} />
            <Text style={[styles.subtitle, { color: theme.text }]}>
              Loading your profile...
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Cards Container */}
      <View style={styles.cardsContainer}>
        {/* View Attendance Card */}
        <Animated.View style={{ 
          transform: [{ scale: card1Scale }],
          width: width * 0.9
        }}>
          <TouchableOpacity
            style={[
              styles.cardButton, 
              { 
                backgroundColor: theme.cardBackground,
                shadowColor: theme.shadow,
              }
            ]}
            onPress={() => navigation.navigate('ViewAttendance', { username })}
            onPressIn={() => handleCardPressIn(card1Scale)}
            onPressOut={() => handleCardPressOut(card1Scale)}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <Icon name="bar-chart" size={32} color={theme.cardText} />
              <Text style={[styles.cardText, { color: theme.cardText }]}>
                View Attendance
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Mark Attendance Card */}
        <Animated.View style={{ 
          transform: [{ scale: card2Scale }],
          width: width * 0.9
        }}>
          <TouchableOpacity
            style={[
              styles.cardButton, 
              { 
                backgroundColor: theme.cardBackground,
                shadowColor: theme.shadow,
              }
            ]}
            onPress={() => navigation.navigate('MarkAttendance', { username })}
            onPressIn={() => handleCardPressIn(card2Scale)}
            onPressOut={() => handleCardPressOut(card2Scale)}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <Icon name="edit" size={32} color={theme.cardText} />
              <Text style={[styles.cardText, { color: theme.cardText }]}>
                Mark Attendance
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.text }]}>
          Have a productive day! <Icon name="wb-sunny" size={16} color={theme.icon} />
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'flex-start',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 10,
  },
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIcon: {
    marginRight: 8,
  },
  logo: { 
    width: 100, 
    height: 60,
  },
  dashboardHeader: {
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 20,
    elevation: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.9,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
    gap: 20,
  },
  cardButton: {
    paddingVertical: 25,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
  },
  footer: { 
    marginBottom: 20, 
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.8,
  },
});