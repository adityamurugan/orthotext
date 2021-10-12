import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions  } from 'react-native';
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
    const [rightCount, setRightCount] = useState(0)
    const [wrongCount, setWrongCount] = useState(0)
    const [startTime, setStartTime] = useState(new Date() * 1)
    const [reactionTime, setReactionTime] = useState(0)
    const [backColor, setBackColor] = useState("orange")
    //function to handle correct button press
    let changePosition = arg1 => () => {
        xPos.splice(position,1)
        if(arg1 == 0){
            setRightCount(rightCount => rightCount+1)
            if(xPos.length != 0){
                setBackColor("#00ff00")
                setTimeout(function(){
                    setBackColor("orange")
                }, 100);
            }
        }else{
            setWrongCount(wrongCount => wrongCount+1)
            if(xPos.length != 0){
                setBackColor("#ff0000")
                setTimeout(function(){
                    setBackColor("orange")
                }, 100);
            }
        }
        if(xPos.length == 0){
            navigation.navigate('Home')
        }
        let randIndex = Math.floor(Math.random() * xPos.length)
        setPosition(randIndex)
        console.log(xPos[randIndex])
        let elapsedTime = (new Date() * 1) - startTime
        setStartTime(new Date() * 1)
        setReactionTime(elapsedTime/1000)
    }

    return (
        <View style={{...styles.container}}>
            <TouchableWithoutFeedback onPress = {changePosition(1)}>
            <View style={styles.container}/>
            </TouchableWithoutFeedback>
            <TouchableOpacity onPress = {changePosition(0)} style={{...styles.roundButton, ...xPos[position], backgroundColor:backColor}}>
                <Text>O</Text>
            </TouchableOpacity>
        </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
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