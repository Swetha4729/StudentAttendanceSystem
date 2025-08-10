import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { globalStyles } from '../styles/globalStyles';

export default function ViewAttendance() {
  // Sample data – replace with your real data
  const monthlyData = [85, 90, 78, 95, 88, 92]; // Attendance per month %
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const dayWiseData = [
  {
    date: 'Aug 1',
    periods: ['Present', 'Present', 'Absent', 'Present', 'Present', 'Present', 'Absent', 'Present']
  },
  {
    date: 'Aug 2',
    periods: ['Absent', 'Absent', 'Absent', 'Present', 'Present', 'Present', 'Present', 'Absent']
  },
  // Add more days
];


  const totalPercentage = Math.round(
    (dayWiseData.filter((d) => d.status === 'Present').length / dayWiseData.length) * 100
  );

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      {/* Total Semester Attendance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Total Attendance</Text>
        <Text style={styles.percentageText}>{totalPercentage}%</Text>
      </View>

      {/* Month-wise Attendance Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Monthly Overview</Text>
        <LineChart
          data={{
            labels: monthLabels,
            datasets: [{ data: monthlyData }],
          }}
          width={350}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(52, 120, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#3478f6',
            },
          }}
          bezier
          style={{ borderRadius: 16 }}
        />
      </View>

      {/* Day-wise Attendance List */}
      <View style={styles.section}>
  <Text style={styles.sectionTitle}>🗓️ Day-wise Period Attendance</Text>

  {dayWiseData.map((day, index) => (
    <View key={index} style={styles.dayBlock}>
      <Text style={styles.dayText}>{day.date}</Text>
      
      {day.periods.map((status, periodIndex) => (
        <View key={periodIndex} style={styles.periodRow}>
          <Text style={styles.periodText}>Period {periodIndex + 1}</Text>
          <Text style={[styles.statusText, { color: status === 'Present' ? 'green' : 'red' }]}>
            {status}
          </Text>
        </View>
      ))}
    </View>
  ))}
</View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  percentageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3478f6',
    textAlign: 'center',
  },
  dayItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
  },
  dayText: {
    fontSize: 16,
  },
  status: {
    fontWeight: '600',
  },
  dayBlock: {
  backgroundColor: '#fff',
  padding: 15,
  borderRadius: 10,
  marginBottom: 20,
  elevation: 3,
},
periodRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 6,
  borderBottomColor: '#eee',
  borderBottomWidth: 1,
},
periodText: {
  fontSize: 15,
  color: '#333',
},
statusText: {
  fontSize: 15,
  fontWeight: '600',
},

});
