import { View, Button, StyleSheet, Text, FlatList, TouchableOpacity, Modal, TextInput } from "react-native"
import { Picker } from '@react-native-picker/picker'; 
import useHttp from '../hooks/http.hook'
import { useState, useEffect } from 'react';
import { ButtonGroup } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import * as Clipboard from 'expo-clipboard';

import { API_URL } from "@env"

const days = [
  { label: 'Пн', value: 'Понедельник' },
  { label: 'Вт', value: 'Вторник' },
  { label: 'Ср', value: 'Среда' },
  { label: 'Чт', value: 'Четверг' },
  { label: 'Пт', value: 'Пятница' },
  { label: 'Сб', value: 'Суббота' },
  { label: 'Вс', value: 'Воскресенье' },
];

const weekTypes = [ 'Числитель', 'Знаменатель']

const Item = ({ item, onEdit }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.day}>{item.name}</Text>
      <Text style={styles.time}>{item.startTime.split(':')[0] + ':' + item.startTime.split(':')[1]} - {item.endTime.split(':')[0] + ':' + item.endTime.split(':')[1]}</Text>
      <Text style={styles.subject}>Преподаватель: {item.teacher}</Text>
      <Text style={styles.subject}>Аудитория: {item.classroom}</Text>
      <TouchableOpacity onPress={() => onEdit(item)} style={styles.editButton}>
        <Text style={styles.editButtonText}>Редактировать</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function Schedule() {
  const { request } = useHttp()

  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0)
  const [lessonData, setLessonData] = useState({})
  const [lessonModalVisible, setLessonModalVisible] = useState(false)
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false)
  const [daySchedule, setDaySchedule] = useState()
  const [editing, setEditing] = useState()
  const [shareCode, setShareCode] = useState('');
  const [pullCode, setPullCode] = useState('');


  const loadDaySchedule = async (day, weekType) => {
    let token = await SecureStore.getItemAsync('authToken')
    if (token) {
      request(`${API_URL}/lesson?day=${day}&weekType=${weekType}`, 'GET', null, {'Authorization': `Bearer ${token}`})
      .then(res => {
        setDaySchedule(res)
      })
    }
  }

  const getShareCode = async () => {
    let token = await SecureStore.getItemAsync('authToken')
    if (token) {
      request(`${API_URL}/lesson/share`, 'GET', null, {'Authorization': `Bearer ${token}`})
      .then(res => {
        setShareCode(res)
      })
    }
  }

  const pullSchedule = async () => {
    let token = await SecureStore.getItemAsync('authToken')
    if (token) {
      request(`${API_URL}/lesson/pull`, 'POST', {shareCode: pullCode}, {'Authorization': `Bearer ${token}`})
      .then(res => {
        setScheduleModalVisible(false)
        loadDaySchedule(days[selectedDayIndex].value, weekTypes[selectedWeekIndex])
      })
    }
  }

  const openEditLesson = (item) => {
    setLessonData(item)
    setEditing(true)
    setLessonModalVisible(true)
  }
  
  const openAddNewLesson = () => {
    setLessonData({})
    setEditing(false)
    setLessonModalVisible(true)
  }

  const saveLesson = async () => {
    let token = await SecureStore.getItemAsync('authToken')
    if (token) {
      if (editing) {
        request(`${API_URL}/lesson/${lessonData.id}`, 'PUT',  {...lessonData, day: days[selectedDayIndex].value, weekType: weekTypes[selectedWeekIndex]}, {'Authorization': `Bearer ${token}`})
        .then(res => {
          setLessonModalVisible(false)
          loadDaySchedule(days[selectedDayIndex].value, weekTypes[selectedWeekIndex])
        })
      } else {
        request(`${API_URL}/lesson`, 'POST', {...lessonData, day: days[selectedDayIndex].value, weekType: weekTypes[selectedWeekIndex]}, {'Authorization': `Bearer ${token}`})
        .then(res => {
          setLessonModalVisible(false)
          loadDaySchedule(days[selectedDayIndex].value, weekTypes[selectedWeekIndex])
        })
      }
    }
  }

  const deleteLesson = async () => {
    let token = await SecureStore.getItemAsync('authToken')
    if (token) {
      if (editing) {
        request(`${API_URL}/lesson/${lessonData.id}`, 'DELETE',  null, {'Authorization': `Bearer ${token}`})
        .then(res => {
          setLessonModalVisible(false)
          loadDaySchedule(days[selectedDayIndex].value, weekTypes[selectedWeekIndex])
        })
      }
    }
  }

  useEffect(() => {
    loadDaySchedule(days[selectedDayIndex].value, weekTypes[selectedWeekIndex])
  }, [selectedDayIndex, selectedWeekIndex])

  return (
    <View style={styles.container}>

      <View style={{justifyContent: 'center', flexDirection: 'row'}}>
        <Picker
          selectedValue={selectedWeekIndex}
          onValueChange={(index) => setSelectedWeekIndex(index)}
          style={styles.defaultPicker}
        >
          {weekTypes.map((week, index) => (
            <Picker.Item label={week} value={index} key={week} />
          ))}
        </Picker>
      </View>

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
        data={daySchedule}
        renderItem={({ item }) => <Item item={item} onEdit={openEditLesson}/>}
        keyExtractor={(item) => item.id}
      />

      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={openAddNewLesson} style={styles.addButton}>
          <Text style={styles.addButtonText}>Добавить занятие</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
            setScheduleModalVisible(true)
          }} 
          style={styles.addButtonSmall}
        >
          <Text style={styles.addButtonText}>Расписание +</Text>
        </TouchableOpacity>
      </View>

      {/* Модальное окно "Добавить/Редактировать расписание" */}
      <Modal
        visible={lessonModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLessonModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {editing ? 'Редактировать занятие' : 'Добавить новое занятие'}
          </Text>

          <View style={styles.weekContainer}>
            {/* День недели */}
            <Picker
              selectedValue={selectedDayIndex}
              onValueChange={(index) => setSelectedDayIndex(index)}
              style={styles.defaultPicker}
            >
              {days.map((day, index) => (
                <Picker.Item label={day.value} value={index} key={day.value} />
              ))}
            </Picker>
            
            {/* Тип недели */}
            <Picker
              selectedValue={selectedWeekIndex}
              onValueChange={(index) => setSelectedWeekIndex(index)}
              style={styles.defaultPicker}
            >
              {weekTypes.map((week, index) => (
                <Picker.Item label={week} value={index} key={week} />
              ))}
            </Picker>
          </View>
          
          {/* Время */}
          <Text style={styles.label}>Начальное время:</Text>
          <View style={styles.timePicker}>
            <Picker
              selectedValue={lessonData.startTime?.split(':')[0]}
              onValueChange={(itemValue) => 
                setLessonData((prevData) => ({
                  ...prevData,
                  startTime: itemValue + ':' + prevData.startTime?.split(':')[1],
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
              selectedValue={lessonData.startTime?.split(':')[1]}
              onValueChange={(itemValue) =>
                setLessonData((prevData) => ({
                  ...prevData,
                  startTime: prevData.startTime?.split(':')[0] + ':' + itemValue,
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
              selectedValue={lessonData.endTime?.split(':')[0]}
              onValueChange={(itemValue) => 
                setLessonData((prevData) => ({
                  ...prevData,
                  endTime: itemValue + ':' + prevData.endTime?.split(':')[1],
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
              selectedValue={lessonData.endTime?.split(':')[1]}
              onValueChange={(itemValue) =>
                setLessonData((prevData) => ({
                  ...prevData,
                  endTime: prevData.endTime?.split(':')[0] + ':' + itemValue,
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
              setLessonData((prevData) => ({
                ...prevData,
                name: text,
              }))
            }
            style={styles.input}
            value={lessonData.name}
          />
          <TextInput
            placeholder="ФИО преподавателя"
            onChangeText={(text) =>
              setLessonData((prevData) => ({
                ...prevData,
                teacher: text,
              }))
            }
            style={styles.input}
            value={lessonData.teacher}
          />
          <TextInput
            placeholder="Аудитория"
            onChangeText={(text) =>
              setLessonData((prevData) => ({
                ...prevData,
                classroom: text,
              }))
            }
            style={styles.input}
            value={lessonData.classroom?.toString()}
          />

          <TouchableOpacity onPress={saveLesson} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>
              {editing ? 'Сохранить' : 'Добавить'}
            </Text>
          </TouchableOpacity>

          {
            editing ?   
              <TouchableOpacity onPress={deleteLesson} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>
                  Удалить
                </Text>
              </TouchableOpacity>
            : null
          }

          <TouchableOpacity onPress={() => setLessonModalVisible(false)} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity> 
        </View>
      </Modal>


      {/* Модальное окно "Поделиться расписанием" */}
      <Modal
        visible={scheduleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.loadButton} onPress={() =>  getShareCode()}>
            <Text style={styles.saveButtonText}>Поделиться расписанием</Text>
          </TouchableOpacity>

          {
            shareCode ?
            <View>
              <Text style={styles.shareCodeText}>{shareCode}</Text>

              <TouchableOpacity style={styles.loadButton} onPress={() => {
                if (shareCode) {
                  Clipboard.setString(shareCode);
                  alert('Код скопирован в буфер обмена');
                }
              }}>
                <Text style={styles.saveButtonText}>Копировать код</Text>
              </TouchableOpacity>
            </View>
            : null
          }

          <TextInput
            placeholder="Введите код для загрузки расписания"
            onChangeText={(text) => setPullCode(text)}
            style={styles.input}
            value={pullCode}
          />

          <TouchableOpacity style={styles.loadButton} onPress={() => pullSchedule()}>
            <Text style={styles.saveButtonText}>Загрузить расписание</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScheduleModalVisible(false)} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>   
  );
}

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
  deleteButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, 
  },
  deleteButtonText: {
    color: 'red', 
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
    width: 180,
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
  weekContainer: {
    flexDirection: 'row'
  }
});