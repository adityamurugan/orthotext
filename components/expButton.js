import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions  } from 'react-native';
import { customStyle } from './positions';
import { useNavigation } from '@react-navigation/native';

export const ExpButton = (props) => {
    const navigation = useNavigation();
    const [xPos, setXPos] = useState([])
    useEffect(() => {
        let data = []
        for(let i=0;i<100;i+=10){
            for(let j=0;j<100;j+=20){
                data.push({bottom: String(i) + "%", right: String(j) + "%"})
            }
        }
        return setXPos(data)
    },[])
    const [position, setPosition] = useState(0)
    const [pressCount, setPressCount] = useState(1)
    const [startTime, setStartTime] = useState(new Date() * 1)
    const [reactionTime, setReactionTime] = useState(0)
    const changePosition = () => {
        xPos.splice(position,1)
        if(xPos.length == 0){
            navigation.navigate('Home')
        }
        let randIndex = Math.floor(Math.random() * xPos.length)
        setPosition(randIndex)
        console.log(xPos[randIndex])
        setPressCount(pressCount => pressCount+1)
        let elapsedTime = (new Date() * 1) - startTime
        setStartTime(new Date() * 1)
        setReactionTime(elapsedTime/1000)
    }

    return (
        <View style={styles.container}>
         <TouchableOpacity onPress = {changePosition} style={[styles.roundButton, xPos[position]]}>
            <Text>O</Text>
         </TouchableOpacity>
        </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
 
    roundButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        width: Dimensions.get('window').width * 0.2,
        height: Dimensions.get('window').width * 0.2,
        backgroundColor: 'orange',
    },
  });