import { useDebugValue, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import MapCore from "../MapCore/MapCore";
import { Dropdown } from "react-native-element-dropdown";
import Manipulative from "../Manipulative/Manipulative";
import Constants from "../../Constants";
import pathFinder from "../../pathFinder";

const size = { w: 2200, h: 1800 };

const floors = [
  { label: "Этаж 1", value: 0 },
  { label: "Этаж 2", value: 1 },
  { label: "Этаж 3", value: 2 },
  { label: "Этаж 4", value: 3 },
  { label: "Этаж 5", value: 4 },
];

const vertices = require('../../Data/vertices.json');
const rooms = vertices.filter(v => v.label != null).map((r) => ({label: r.label, id: r.id}));

export default function Map() {

  const [floor, setFloor] = useState(0);
  const [startRoom, setStartRoom] = useState(null);
  const [finishRoom, setFinishRoom] = useState(null);
  const [focusRoom, setFocusRoom] = useState(null);

  const [pathPanelOpened, setPathPanelOpened] = useState(false);

  const [path, setPath] = useState(null);

  // when start of finish room changes, try to find a new path
  useEffect(() => {
    if (startRoom && finishRoom && startRoom != finishRoom) {
      setPath(pathFinder(vertices, startRoom, finishRoom));
    }
  }, [startRoom, finishRoom]);

  const reset = () => {
    setPathPanelOpened(false);
    setFinishRoom(null);
    setStartRoom(null);
    setPath(null);
    setFocusRoom(null);
  }

  const focusOnRoom = (id) => {
    setFocusRoom(id);
    setFloor(vertices[id].z);
  }

  return (
    <View style={styles.map}>

      <Manipulative width={size.w} height={size.h} initial={{x: 1014, y: 1286}}>
        <MapCore floor={floor} path={path} focusPoint={focusRoom}></MapCore> 
      </Manipulative>
  

      {/* Back button */}
      {
        pathPanelOpened ?
          <View style={styles.backButton}>
            <Button 
              onPress={reset} 
              title="Назад"></Button>
          </View>
        : null
      }

      {/* Floors */}
      {
        !pathPanelOpened ?
          <View style={styles.floors}>
            <Dropdown
              data={floors}
              labelField="label"
              valueField="value"
              value={floor}
              dropdownPosition="top"
              selectedTextStyle={{
                fontWeight: 600
              }}
              onChange={item => {
                setFloor(item.value)
              }}
            />
          </View>
        : null
      }

      {/* Search bar */}
      {
        !pathPanelOpened ?
          <View style={styles.searchBar}>
            <View style={styles.searchBarContent}>
              <Dropdown
                search
                data={rooms}
                labelField="label"
                valueField="id"
                value={focusRoom}
                placeholder="Поиск..."
                placeholderStyle={{
                  color: 'grey'
                }}
                searchPlaceholder="Введите аудиторию..."
                onChange={item => {
                  focusOnRoom(item.id)
                  setFinishRoom(item.id);
                }}
              />
            </View>
        
            {/* Open button */}
            {
              finishRoom ? 
                <View style={styles.openButton}>
                  <Button onPress={() => setPathPanelOpened(true)} title="Как пройти?"></Button>
                </View>
              : null
            }
          </View>
        : null
      }
      
      {/* Path panel */}
      {
        pathPanelOpened ? 
          <View style={styles.pathPanel}>

            {/* StartRoom choice */}
            <View style={styles.pathPanelSearch}>
              <Dropdown
                search
                data={rooms}
                labelField="label"
                valueField="id"
                value={startRoom}
                placeholder="Откуда"
                searchPlaceholder="Введите аудиторию..."
                dropdownPosition="top"
                onChange={item => {
                  focusOnRoom(item.id);
                  setStartRoom(item.id);
                }}
                placeholderStyle={{
                  color: 'grey'
                }}
              />
            </View>

            {/* FinishRoom choice */}
            <View style={styles.pathPanelSearch}>
              <Dropdown
                search
                data={rooms}
                labelField="label"
                valueField="id"
                value={finishRoom}
                placeholder="Куда"
                searchPlaceholder="Введите аудиторию..."
                dropdownPosition="top"
                onChange={item => {
                  focusOnRoom(item.id)
                  setFinishRoom(item.id);
                }}
                placeholderStyle={{
                  color: 'grey'
                }}
              />
            </View>
            
            {/* Path floors */}
            {
              path ? 
              <View style={styles.pathFloors}>
                <Dropdown
                  data={floors.filter(f => path.some(v => v.z == f.value))}
                  labelField="label"
                  valueField="value"
                  value={floor}
                  dropdownPosition="top"
                  onChange={item => {
                    setFloor(item.value)
                  }}
                  selectedTextStyle={{
                    fontWeight: 600
                  }}
                />
              </View>
              : null
            }
          
        </View>
        : null
      }
      
    </View>
  );

}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#e3e3e3',
  },

  searchBar: {
    position: 'absolute',
    width: '100%',
    height: 80,
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Constants.statusBarHeight,
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  
  searchBarContent: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: '#ebf4f7',
  },
 
  openButton: {
    marginTop: 25
  },
  
  pathPanel: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
    width: '100%',
    height: 180,
    bottom: 0,
    padding: 20,
    backgroundColor: '#ebf4f7',
  },
  
  pathPanelSearch: {
    width: '100%',
    backgroundColor: 'white',
    flex: 1,
    marginVertical: 15,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 15,
  },

  backButton: {
    position: 'absolute',
    top: Constants.statusBarHeight,
    left: 20
  },

  floors: {
    position: 'absolute',
    bottom: Constants.statusBarHeight,
    right: 20,
    width: 110,
    backgroundColor: '#ebf4f7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },

  pathFloors: {
    position: 'absolute',
    bottom: Constants.statusBarHeight + 150,
    right: 20,
    width: 110,
    backgroundColor: '#ebf4f7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  }

});
