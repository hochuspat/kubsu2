import { View, StyleSheet, Button, Image } from "react-native";
import Edge from "../Edge/Edge";
import Point from "../Point/Point";
import Label from "../Label/Label";
import { useEffect, useState, useRef } from "react";

const vertices = require('../../Data/vertices.json');
let rooms = vertices.filter(v => v.label != null);

const schemas = [
  require('../../Data/schemas/1.png'), 
  require('../../Data/schemas/2.png'), 
  require('../../Data/schemas/3.png'), 
  require('../../Data/schemas/4.png'), 
  require('../../Data/schemas/5.png'), 
]

export default function MapCore({floor, path, focusPoint, center, scale}) {

  const lastFocusedPoint = useRef(null);

  if (focusPoint) {
    if (focusPoint != lastFocusedPoint.current) {
      center({x: vertices[focusPoint].x, y: vertices[focusPoint].y});
      lastFocusedPoint.current = focusPoint;
    } 
  }



  return (
    <View style={styles.mapCore}>

      <Image style={styles.schema} source={schemas[floor]}></Image>   

      {
        path ? path.map((v, i) => {
          // console.log(v);
          if (i < path.length - 1 && v.z == floor && path[i + 1].z == floor) {
            return (
              <Edge key={`edge-${i}`} x1={v.x} y1={v.y} x2={path[i + 1].x} y2={path[i + 1].y} scale={scale}/>
            );
          }
        }) 
        : null
      }

     
      {
        rooms.map((v, i) => {
          if (v.z == floor) {
            return (
              <View key={`point-${i}`}> 
                <Point x={v.x} y={v.y} r={5} scale={scale}/>
                <Label x={v.x} y={v.y} text={v.label} scale={scale}></Label>
              </View>
            );
          }
        })
      }

      {/* {vertices.map((v, i) => {
        if (v.z == floor) {
          return (
            
            v.neighbours.map((n, i) =>
              <Edge key={`edge-${i}-${i}`} x1={v.x} y1={v.y} x2={vertices[n.id].x} y2={vertices[n.id].y} scale={scale}/>
            )
          
          )
        }
      })} */}

      {/* {vertices.map((v, i) => {
        if (v.z == floor) {
          return (
            <View key={`point-${i}`}> 
              <Point x={v.x} y={v.y} r={5} scale={scale}/>
              <Label x={v.x} y={v.y} text={v.id} scale={scale}></Label>
            </View>
          )
        }
      })} */}

    </View>
  );
}

const styles = StyleSheet.create({
  mapCore: {
    position: 'relative',
  },
  schema: {
    position: 'absolute'
  }
});
