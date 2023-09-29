import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ButtonGroup } from 'react-native-elements';
import { nanoid } from 'nanoid';
import * as Clipboard from 'expo-clipboard';

const days = [
  { label: 'Пн', value: 'Понедельник' },
  { label: 'Вт', value: 'Вторник' },
  { label: 'Ср', value: 'Среда' },
  { label: 'Чт', value: 'Четверг' },
  { label: 'Пт', value: 'Пятница' },
  { label: 'Сб', value: 'Суббота' },
  { label: 'Вс', value: 'Воскресенье' },
];

const Item = ({ item, onEdit }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.day}>{item.subject}</Text>
      <Text style={styles.time}>{item.time}</Text>
      <Text style={styles.subject}>Преподаватель: {item.teacher}</Text>
      <Text style={styles.subject}>Аудитория: {item.classroom}</Text>
      <TouchableOpacity onPress={() => onEdit(item)} style={styles.editButton}>
        <Text style={styles.editButtonText}>Редактировать</Text>
      </TouchableOpacity>
    </View>
  );
};

const Schedule = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [editingLesson, setEditingLesson] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newLesson, setNewLesson] = useState({ day: '', subject: '' });
  const [startHour, setStartHour] = useState('09');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('10');
  const [endMinute, setEndMinute] = useState('30');
  const [teacher, setTeacher] = useState('');
  const [classroom, setClassroom] = useState('');
  const [addScheduleModalVisible, setAddScheduleModalVisible] = useState(false);

  const [lessons, setLessons] = useState([]);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [getScheduleModalVisible, setGetScheduleModalVisible] = useState(false);
  const [editingLessonData, setEditingLessonData] = useState({
    subject: '',
    startHour: '09',
    startMinute: '00',
    endHour: '10',
    endMinute: '30',
    teacher: '',
    classroom: '',
  });
  const [shareCode, setShareCode] = useState('');
  const [loadedSchedule, setLoadedSchedule] = useState(null);
  const [loadCode, setLoadCode] = useState('');

  useEffect(() => {
    fetch('http://212.192.134.23/schedule')
      .then((response) => {
        console.log('Response:', response);
        return response.json();
      })
      .then((data) => setLessons(data))
      .catch((error) => console.error(error));
  }, []);

  const openAddScheduleModal = () => {
    setEditingLesson(null);
    setModalVisible(true);
  };

  const openGetScheduleModal = () => {
    setEditingLesson(null);
    setAddScheduleModalVisible(true);
  };

  const initialSchedule = {
    Понедельник: [],
    Вторник: [],
    Среда: [],
    Четверг: [],
    Пятница: [],
    Суббота: [],
    Воскресенье: [],
  };

  const saveLesson = () => {
    if (
      selectedDayIndex !== null &&
      editingLessonData.startHour &&
      editingLessonData.startMinute &&
      editingLessonData.endHour &&
      editingLessonData.endMinute &&
      editingLessonData.subject
    ) {
      const time = `${editingLessonData.startHour}:${editingLessonData.startMinute} - ${editingLessonData.endHour}:${editingLessonData.endMinute}`;
      const lessonData = {
        id: editingLesson ? editingLesson.id : Math.random().toString(),
        day: days[selectedDayIndex].value,
        time,
        subject: editingLessonData.subject,
        teacher: editingLessonData.teacher,
        classroom: editingLessonData.classroom,
      };

      if (editingLesson) {
        const updatedLessons = lessons.map((lesson) =>
          lesson.id === editingLesson.id ? lessonData : lesson
        );
        setLessons(updatedLessons);
      } else {
        setLessons([...lessons, lessonData]);
      }

      closeModal();
      console.log('Занятие сохранено:', lessonData);
    }
  };

  const closeModal = () => {
    setEditingLesson(null);
    setModalVisible(false);
    clearForm();
  };

  const clearForm = () => {
    setEditingLessonData({
      subject: '',
      startHour: '09',
      startMinute: '00',
      endHour: '10',
      endMinute: '30',
      teacher: '',
      classroom: '',
    });
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setModalVisible(true);

    if (lesson) {
      setEditingLessonData({
        day: lesson.day,
        subject: lesson.subject,
        startHour: lesson.time.split(' ')[0].split(':')[0],
        startMinute: lesson.time.split(' ')[0].split(':')[1],
        endHour: lesson.time.split(' ')[2].split(':')[0],
        endMinute: lesson.time.split(' ')[2].split(':')[1],
        teacher: lesson.teacher,
        classroom: lesson.classroom,
      });
    } else {
      clearForm();
    }
  };

  const generateShareCode = () => {
    const timestamp = Date.now();
    const randomValue = Math.floor(Math.random() * 100000);
    const code = timestamp.toString(36) + randomValue.toString(36);
    setShareCode(code);
  };

  const loadScheduleByCode = () => {
    fetch(`http://212.192.134.23/share/${loadCode}`)
      .then((response) => response.json())
      .then((data) => {
        const newSchedule = { ...initialSchedule };

        data.forEach((lesson) => {
          if (lesson.day in newSchedule) {
            newSchedule[lesson.day].push(lesson);
          }
        });

        setLessons(data);

        setLoadedSchedule(newSchedule);
      })
      .catch((error) => console.error(error));
  };

  const copyShareCode = () => {
    if (shareCode) {
      Clipboard.setString(shareCode);
      alert('Код скопирован в буфер обмена');
    }
  };

  const closeAddScheduleModal = () => {
    setAddScheduleModalVisible(false);
    clearForm();
  };

  const createNewSchedule = () => {
    fetch('http://212.192.134.23/create-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scheduleData: lessons }),
    })
      .then((response) => response.json())
      .then((data) => {
        setShareCode(data.code);
      })
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.container}>
      <ButtonGroup
        onPress={(index) => setSelectedDayIndex(index)}
        selectedIndex={selectedDayIndex}
        buttons={days.map((day) => day.label)}
        containerStyle={styles.buttonGroupContainer}
        textStyle={styles.buttonGroupText}
        selectedButtonStyle={styles.selectedButton}
        selectedTextStyle={styles.selectedButtonText}
      />

      <Text style={styles.selectedDayText}>
        Выбран день: {days[selectedDayIndex].value}
      </Text>

      <FlatList
        data={
          loadedSchedule && loadedSchedule[days[selectedDayIndex].value]
            ? loadedSchedule[days[selectedDayIndex].value]
            : lessons.filter((lesson) => lesson.day === days[selectedDayIndex].value)
        }
        renderItem={({ item }) => <Item item={item} onEdit={openEditModal} />}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={openAddScheduleModal} style={styles.addButton}>
          <Text style={styles.addButtonText}>Добавить занятие</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={openGetScheduleModal} style={styles.addButtonSmall}>
          <Text style={styles.addButtonText}>Расписание +</Text>
        </TouchableOpacity> */}
      </View>

      {/* Модальное окно "Добавить/Редактировать расписание" */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {editingLesson ? 'Редактировать занятие' : 'Добавить новое занятие'}
          </Text>
          <Picker
            selectedValue={selectedDayIndex}
            onValueChange={(index) => setSelectedDayIndex(index)}
            style={styles.defaultPicker}
          >
            {days.map((day, index) => (
              <Picker.Item label={day.value} value={index} key={day.value} />
            ))}
          </Picker>

          <Text style={styles.label}>Начальное время:</Text>
          <View style={styles.timePicker}>
            <Picker
              selectedValue={editingLessonData.startHour}
              onValueChange={(itemValue) =>
                setEditingLessonData((prevData) => ({
                  ...prevData,
                  startHour: itemValue,
                }))
              }
              style={[styles.defaultPicker, { width: '30%' }]}
            >
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, '0');
                return <Picker.Item label={hour} value={hour} key={hour} />;
              })}
            </Picker>
            <Picker
              selectedValue={editingLessonData.startMinute}
              onValueChange={(itemValue) =>
                setEditingLessonData((prevData) => ({
                  ...prevData,
                  startMinute: itemValue,
                }))
              }
              style={[styles.defaultPicker, { width: '30%' }]}
            >
              {Array.from({ length: 60 }, (_, i) => {
                const minute = i.toString().padStart(2, '0');
                return <Picker.Item label={minute} value={minute} key={minute} />;
              })}
            </Picker>
          </View>
          <Text style={styles.label}>Конечное время:</Text>
          <View style={styles.timePicker}>
            <Picker
              selectedValue={editingLessonData.endHour}
              onValueChange={(itemValue) =>
                setEditingLessonData((prevData) => ({
                  ...prevData,
                  endHour: itemValue,
                }))
              }
              style={[styles.defaultPicker, { width: '30%' }]}
            >
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, '0');
                return <Picker.Item label={hour} value={hour} key={hour} />;
              })}
            </Picker>
            <Picker
              selectedValue={editingLessonData.endMinute}
              onValueChange={(itemValue) =>
                setEditingLessonData((prevData) => ({
                  ...prevData,
                  endMinute: itemValue,
                }))
              }
              style={[styles.defaultPicker, { width: '30%' }]}
            >
              {Array.from({ length: 60 }, (_, i) => {
                const minute = i.toString().padStart(2, '0');
                return <Picker.Item label={minute} value={minute} key={minute} />;
              })}
            </Picker>
          </View>
          <TextInput
            placeholder="Предмет"
            onChangeText={(text) =>
              setEditingLessonData((prevData) => ({
                ...prevData,
                subject: text,
              }))
            }
            style={styles.input}
            value={editingLessonData.subject}
          />
          <TextInput
            placeholder="ФИО преподавателя"
            onChangeText={(text) =>
              setEditingLessonData((prevData) => ({
                ...prevData,
                teacher: text,
              }))
            }
            style={styles.input}
            value={editingLessonData.teacher}
          />
          <TextInput
            placeholder="Аудитория"
            onChangeText={(text) =>
              setEditingLessonData((prevData) => ({
                ...prevData,
                classroom: text,
              }))
            }
            style={styles.input}
            value={editingLessonData.classroom}
          />

          <TouchableOpacity onPress={saveLesson} style={editingLesson ? styles.saveButton : styles.saveButton}>
            <Text style={editingLesson ? styles.saveButtonText : styles.saveButtonText}>
              {editingLesson ? 'Сохранить' : 'Добавить'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Модальное окно "Поделиться расписанием" */}
      {/* <Modal
        visible={addScheduleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddScheduleModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={generateShareCode} style={styles.loadButton}>
            <Text style={styles.saveButtonText}>Поделиться расписанием</Text>
          </TouchableOpacity>

          <Text style={styles.shareCodeText}>{shareCode}</Text>

          <TouchableOpacity onPress={copyShareCode} style={styles.loadButton}>
            <Text style={styles.saveButtonText}>Копировать код</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Введите код для загрузки расписания"
            onChangeText={(text) => setLoadCode(text)}
            style={styles.input}
            value={loadCode}
          />

          <TouchableOpacity onPress={loadScheduleByCode} style={styles.loadButton}>
            <Text style={styles.saveButtonText}>Загрузить расписание</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeAddScheduleModal} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 5,
    textAlign: 'center',
  },
  buttonGroupContainer: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  buttonGroupText: {
    color: '#007BFF',
  },
  selectedButton: {
    backgroundColor: '#007BFF',
  },
  selectedButtonText: {
    color: 'white',
  },
  selectedContainer: {
    backgroundColor: '#007BFF',
  },
  selectedButton: {
    color: '#fff',
  },
  loadButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  marginBottom: 10, 
  },
  saveButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  marginBottom: 10, 
  },
  saveButtonText: {
    color: 'white', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 2,
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  time: {
    fontSize: 16,
    color: '#000',
  },
  subject: {
    fontSize: 14,
    color: '#555',
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 40, 
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  defaultPicker: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#DDDDDD',
    marginBottom: 20,
    paddingLeft: 15,
    backgroundColor: 'white',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#DDDDDD',
    marginBottom: 20,
    paddingLeft: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10, 
    flex: 1, 
    marginRight: 5, 
  },
  addButtonSmall: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10, 
    flex: 1, 
    marginLeft: 5, 
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDayText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },

  editButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  editButtonText: {
    color: 'white',
  },
});

export default Schedule;
