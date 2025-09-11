import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function ModifyAttendance({ navigation, route }) {
  // Data State
  const { currentPeriod = 1 } = route.params || {};
  const [selectedClass, setSelectedClass] = useState({
    id: "math101",
    name: "Mathematics 101",
    students: [
      { rollNo: "101", name: "John Doe", status: "present" },
      { rollNo: "102", name: "Jane Smith", status: "absent" },
      { rollNo: "103", name: "Alex Johnson", status: "od" }
    ]
  });
  const [classroom, setClassroom] = useState('10101');
  const [dropdownFor, setDropdownFor] = useState(null);
  const dropdownHeight = useRef(new Animated.Value(0)).current;

  // Status colors
  const statusColors = {
    present: '#4CAF50',
    absent: '#F44336',
    od: '#FF9800',
    leave: '#E91E63'
  };

  const toggleDropdown = (rollNo) => {
    if (dropdownFor === rollNo) {
      Animated.timing(dropdownHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setDropdownFor(null));
    } else {
      setDropdownFor(rollNo);
      Animated.timing(dropdownHeight, {
        toValue: 140,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const updateStatus = (rollNo, status) => {
    const updatedStudents = selectedClass.students.map(student => 
      student.rollNo === rollNo ? { ...student, status } : student
    );
    setSelectedClass({...selectedClass, students: updatedStudents});
    toggleDropdown(rollNo);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present': return { name: 'check-circle', color: statusColors.present };
      case 'absent': return { name: 'cancel', color: statusColors.absent };
      case 'od': return { name: 'assignment', color: statusColors.od };
      case 'leave': return { name: 'beach-access', color: statusColors.leave };
      default: return { name: 'help', color: '#9E9E9E' };
    }
  };

  return (
    <LinearGradient 
      colors={['#f5f9ff', '#e0e9ff']} 
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Period {currentPeriod}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Class Info Card */}
        <View style={styles.classCard}>
          <View style={styles.classHeader}>
            <Text style={styles.className}>{selectedClass.name}</Text>
          </View>
          
          <View style={styles.classroomRow}>
          <View style={styles.classroomInputContainer}>
            <Icon name="meeting-room" size={20} color="#666" style={styles.roomIcon} />
            <TextInput
              style={styles.classroomInput}
              value={classroom}
              onChangeText={setClassroom}
              placeholder="Room Number"
            />
          </View>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => Alert.alert('Saved', `Room updated to ${classroom}`)}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        </View>

        {/* Students List */}
        <View style={styles.sectionHeader}>
          <Icon name="people" size={20} color="#4e7eff" />
          <Text style={styles.sectionTitle}>
            Students ({selectedClass.students.length})
          </Text>
        </View>

        {selectedClass.students.map(student => {
          const statusIcon = getStatusIcon(student.status);
          
          return (
            <View key={student.rollNo} style={styles.studentContainer}>
              <TouchableOpacity
                style={[
                  styles.studentCard,
                  { borderLeftColor: statusColors[student.status] || '#4e7eff' }
                ]}
                onPress={() => toggleDropdown(student.rollNo)}
              >
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.rollNo}>#{student.rollNo}</Text>
                </View>
                <Icon name={statusIcon.name} size={24} color={statusIcon.color} />
              </TouchableOpacity>

              {dropdownFor === student.rollNo && (
                <Animated.View 
                  style={[
                    styles.dropdown,
                    { height: dropdownHeight }
                  ]}
                >
                  {Object.entries(statusColors).map(([status, color]) => (
                    <TouchableOpacity 
                      key={status}
                      style={styles.dropdownItem}
                      onPress={() => updateStatus(student.rollNo, status)}
                    >
                      <Icon 
                        name={getStatusIcon(status).name} 
                        size={20} 
                        color={color} 
                      />
                      <Text style={styles.dropdownText}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        {status === 'od' ? ' (On Duty)' : ''}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
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
    paddingLeft: 170,
    padding: 20,
    paddingTop: 30,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  classCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  className: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
  },
  classroomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  classroomInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
   roomIcon: {
    marginRight: 8,
  },
  classroomInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0, 
  },
  saveButton: {
    backgroundColor: '#4e7eff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80, // Ensure minimum width
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  studentContainer: {
    marginBottom: 8,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 1,
    borderLeftWidth: 4,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  rollNo: {
    fontSize: 14,
    color: '#666',
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
    elevation: 2,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});