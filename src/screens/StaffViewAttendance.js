import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ViewAttendance = ({ route }) => {
  // Sample data - replace with your actual data fetching logic
  const classData = {
    className: "III CSE A",
    totalClasses: 20,
    students: [
      { 
        id: "101", 
        name: "John Doe", 
        attended: 18,
        percentage: 90 
      },
      { 
        id: "102", 
        name: "Jane Smith", 
        attended: 15,
        percentage: 75 
      },
      { 
        id: "103", 
        name: "Alex Johnson", 
        attended: 12,
        percentage: 60 
      },
      { 
        id: "104", 
        name: "Sarah Williams", 
        attended: 20,
        percentage: 100 
      },
      { 
        id: "105", 
        name: "Mike Brown", 
        attended: 10,
        percentage: 50 
      },
    ]
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 80) return '#4CAF50'; // Green
    if (percentage >= 60) return '#FFC107'; // Amber
    return '#F44336'; // Red
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{classData.className}</Text>
        <Text style={styles.subHeader}>Total Classes: {classData.totalClasses}</Text>
      </View>

      {/* Student List */}
      <ScrollView style={styles.scrollContainer}>
        {classData.students.map((student) => (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentId}>#{student.id}</Text>
            </View>
            
            <View style={styles.attendanceInfo}>
              <Text style={styles.attendanceText}>
                {student.attended}/{classData.totalClasses} classes
              </Text>
              
              <View style={styles.percentageContainer}>
                <View style={[styles.percentageBar, { 
                  width: `${student.percentage}%`,
                  backgroundColor: getStatusColor(student.percentage)
                }]} />
                <Text style={styles.percentageText}>
                  {student.percentage}%
                </Text>
              </View>
            </View>
          
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  scrollContainer: {
    padding: 15,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  studentId: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  attendanceInfo: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  attendanceText: {
    fontSize: 14,
    color: '#666',
  },
  percentageContainer: {
    width: 100,
    height: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  percentageBar: {
    height: '100%',
    borderRadius: 10,
  },
  percentageText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ViewAttendance;