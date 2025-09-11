import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  Switch,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Modal
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { LineChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

// Simulate fetching from backend API
async function fetchAttendanceFromDB() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalPercentage: 88,
        monthlyData: [85, 90, 78, 95, 88, 92],
        monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        dayWiseData: {
          '2025-08-10': ['Present', 'Present', 'Absent', 'Present', 'Present', 'Present', 'Absent', 'Present'],
          '2025-08-09': ['Absent', 'Absent', 'Absent', 'Present', 'Present', 'Present', 'Present', 'Absent'],
          '2025-08-08': ['Present', 'Present', 'Present', 'Present', 'Absent', 'Absent', 'Present', 'Present'],
          '2025-08-07': ['Present', 'Absent', 'Absent', 'Present', 'Present', 'Present', 'Absent', 'Present'],
        },
        semesterStartDate: '2025-08-01',
      });
    }, 1000);
  });
}

function getDatesArray(start, end) {
  const arr = [];
  let dt = new Date(start);
  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

function formatDateLabel(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ViewAttendance() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({
    totalPercentage: 0,
    monthlyData: [],
    monthLabels: [],
    dayWiseData: {},
    semesterStartDate: null,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    async function loadAttendance() {
      setLoading(true);
      try {
        const data = await fetchAttendanceFromDB();
        setAttendance(data);
        
        const todayStr = new Date().toISOString().slice(0, 10);
        if (data.dayWiseData[todayStr]) setSelectedDate(todayStr);
        else {
          const allDates = Object.keys(data.dayWiseData).sort().reverse();
          if (allDates.length) setSelectedDate(allDates[0]);
        }
        
        // Start animations
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(slideUpAnim, {
            toValue: 0,
            tension: 10,
            friction: 6,
            useNativeDriver: true,
          })
        ]).start();
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
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
    present: isDarkTheme ? '#4ade80' : '#16a34a',
    absent: isDarkTheme ? '#f87171' : '#dc2626',
  };

  const today = new Date();
  const semesterStart = attendance.semesterStartDate ? new Date(attendance.semesterStartDate) : new Date(today);
  const allDays = getDatesArray(semesterStart, today)
    .map(d => d.toISOString().slice(0, 10))
    .reverse();

  const selectedDayPeriods = attendance.dayWiseData[selectedDate] || [];

  const handleDateChange = (date) => {
    const dateStr = date.toISOString().slice(0, 10);
    if (attendance.dayWiseData[dateStr] || allDays.includes(dateStr)) {
      setSelectedDate(dateStr);
    }
    setShowDatePicker(false);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.icon} />
        <Text style={{ marginTop: 10, color: theme.text }}>Loading attendance...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { 
      backgroundColor: theme.background,
      opacity: fadeAnim 
    }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Total Attendance Card */}
        <Animated.View 
          style={[
            styles.card, 
            { 
              backgroundColor: theme.cardBackground,
              transform: [{ translateY: slideUpAnim }],
              padding: 16,
            }
          ]}
        >
          <LinearGradient
            colors={theme.headerGradient}
            style={[StyleSheet.absoluteFill, { opacity: 0.1 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.attendanceHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              <Icon name="assessment" size={18} color={theme.icon} /> Overall
            </Text>
            <View style={styles.percentageContainer}>
              <Text style={[styles.percentageText, { color: theme.cardText }]}>
                {attendance.totalPercentage}%
              </Text>
              <View style={styles.percentageBarContainer}>
                <View 
                  style={[
                    styles.percentageBar, 
                    { 
                      width: `${attendance.totalPercentage}%`,
                      backgroundColor: theme.cardText,
                    }
                  ]}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Monthly Chart */}
        <Animated.View 
          style={[
            styles.card, 
            { 
              backgroundColor: theme.cardBackground,
              transform: [{ translateY: slideUpAnim }],
              padding: 16,
            }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            <Icon name="trending-up" size={18} color={theme.icon} /> Monthly Trend
          </Text>
          <LineChart
            data={{
              labels: attendance.monthLabels,
              datasets: [{ data: attendance.monthlyData }],
            }}
            width={width - 48}
            height={180}
            chartConfig={{
              backgroundGradientFrom: theme.cardBackground,
              backgroundGradientTo: theme.cardBackground,
              decimalPlaces: 0,
              color: (opacity = 1) => theme.cardText,
              labelColor: (opacity = 1) => theme.text,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: theme.cardText,
              },
            }}
            bezier
            style={styles.chart}
            withVerticalLines={false}
            withHorizontalLines={false}
          />
        </Animated.View>

        {/* Day Selector */}
        <Animated.View 
          style={[
            styles.card, 
            { 
              backgroundColor: theme.cardBackground,
              transform: [{ translateY: slideUpAnim }],
              padding: 16,
            }
          ]}
        >
          <View style={styles.dateHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              <Icon name="calendar-today" size={18} color={theme.icon} /> Daily
            </Text>
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
            >
              <Icon name="calendar-month" size={20} color={theme.icon} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysContainer}
          >
            {allDays.map((dayStr) => {
              const isSelected = dayStr === selectedDate;
              const dayLabel = formatDateLabel(new Date(dayStr));
              const dayData = attendance.dayWiseData[dayStr] || [];
              const presentCount = dayData.filter(s => s === 'Present').length;
              const totalPeriods = dayData.length;
              const dayPercentage = totalPeriods > 0 ? Math.round((presentCount / totalPeriods) * 100) : 0;
              
              return (
                <TouchableOpacity
                  key={dayStr}
                  style={[
                    styles.dayCard,
                    {
                      backgroundColor: isSelected ? theme.cardText : theme.cardBackground,
                      borderColor: theme.cardText,
                    }
                  ]}
                  onPress={() => setSelectedDate(dayStr)}
                >
                  <Text style={[
                    styles.dayCardText, 
                    { 
                      color: isSelected ? theme.cardBackground : theme.text,
                      fontWeight: isSelected ? '600' : '400'
                    }
                  ]}>
                    {dayLabel}
                  </Text>
                  {totalPeriods > 0 && (
                    <Text style={[
                      styles.dayPercentage,
                      { 
                        color: isSelected ? theme.cardBackground : theme.cardText,
                        opacity: isSelected ? 0.9 : 0.7
                      }
                    ]}>
                      {dayPercentage}%
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Day Details */}
        {selectedDate && (
          <Animated.View 
            style={[
              styles.card, 
              { 
                backgroundColor: theme.cardBackground,
                transform: [{ translateY: slideUpAnim }],
                padding: 16,
              }
            ]}
          >
            <View style={styles.dayDetailsHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                <Icon name="list-alt" size={18} color={theme.icon} /> Details
              </Text>
              <Text style={[styles.selectedDateText, { color: theme.text }]}>
                {formatDateLabel(new Date(selectedDate))}
              </Text>
            </View>
            
            {selectedDayPeriods.length === 0 ? (
              <Text style={[styles.noDataText, { color: theme.text }]}>
                No attendance recorded for this day
              </Text>
            ) : (
              <View style={styles.periodsGrid}>
                {selectedDayPeriods.map((status, idx) => (
                  <View 
                    key={idx} 
                    style={[
                      styles.periodCard,
                      { 
                        backgroundColor: status === 'Present' ? theme.present : theme.absent,
                        opacity: 0.9
                      }
                    ]}
                  >
                    <Text style={styles.periodNumber}>Period {idx + 1}</Text>
                    <Icon 
                      name={status === 'Present' ? 'check-circle' : 'cancel'} 
                      size={20} 
                      color="#fff" 
                    />
                    <Text style={styles.periodStatus}>{status}</Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>

      {showDatePicker && (
  <DatePicker
    modal
    open={showDatePicker}
    date={selectedDate ? new Date(selectedDate) : new Date()}
    mode="date"
    onConfirm={(date) => {
      setShowDatePicker(false);
      handleDateChange(date);
    }}
    onCancel={() => {
      setShowDatePicker(false);
    }}
    maximumDate={new Date()}
    minimumDate={semesterStart}
    theme={isDarkTheme ? 'dark' : 'light'}
  />
)}

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIcon: {
    marginRight: 8,
  },
  logo: {
    width: 80,
    height: 50,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  percentageContainer: {
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  percentageBarContainer: {
    height: 6,
    width: 120,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  percentageBar: {
    height: '100%',
    borderRadius: 3,
  },
  chart: {
    borderRadius: 8,
    marginTop: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  datePickerButton: {
    padding: 6,
  },
  daysContainer: {
    paddingVertical: 4,
  },
  dayCard: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 60,
  },
  dayCardText: {
    fontSize: 12,
  },
  dayPercentage: {
    fontSize: 10,
    marginTop: 2,
  },
  dayDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedDateText: {
    fontSize: 14,
    opacity: 0.8,
  },
  periodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  periodCard: {
    width: '48%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodNumber: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 4,
  },
  periodStatus: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
    marginTop: 4,
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 12,
    opacity: 0.7,
  },
  iosPickerContainer: {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  backgroundColor: 'white',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 10,
},
iosPickerHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 16,
},
iosPickerButton: {
  fontSize: 16,
  fontWeight: '600',
  padding: 8,
},
iosPicker: {
  width: '100%',
},
});