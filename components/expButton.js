import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions  } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import {Database} from "../Database"

const db = new Database("result.db");
let tid = 0;
let res = []

export const ExpButton = (props) => {
    const navigation = useNavigation();
    const [xPos, setXPos] = useState([])

    //function to run onMount
    useEffect(() => {
        let data = []
        //function to write testid data to db
        async function writeData() {
            const res1 = await db.execute("insert into summary (device, testProduct) values (?, ?)", ['test','test'])
            tid = res1.insertId
            console.log(tid)
        }
        writeData()

        //generate position data and set to array
        for(let i=0;i<100;i+=10){
            for(let j=0;j<100;j+=20){
                data.push({bottom: String(i) + "%", right: String(j) + "%"})
            }
        }
        return setXPos([...data , ...data]);
    },[])

    const [position, setPosition] = useState(0)
    const [startTime, setStartTime] = useState(new Date() * 1)
    const [backColor, setBackColor] = useState("orange")
    //function to handle correct button press
    let changePosition = arg1 => async () => {

        let elapsedTime = (new Date() * 1) - startTime
        if(arg1 == 0){ //on accurate press condition
            //insert data to result table
            await db.execute("insert into tapResult (tid, xPos, yPos, rightClick, timeTaken) values (?, ?, ?, ?, ?)", [tid, parseFloat(xPos[position].bottom), parseFloat(xPos[position].right), true, elapsedTime/1000])
            res = await db.execute("select * from tapResult where tid = ?", [tid])
        }else{ //on inaccurate press condition
            await db.execute("insert into tapResult (tid, xPos, yPos, rightClick, timeTaken) values (?, ?, ?, ?, ?)", [tid, parseFloat(xPos[position].bottom), parseFloat(xPos[position].right), false, elapsedTime/1000])
            res = await db.execute("select * from tapResult where tid = ?", [tid])
        }

        //after db update remove element from positions array
        xPos.splice(position,1)

        //perform state updates depending on array length and touch accuracy
        if(xPos.length == 0){
            //navigate to resultPage and reset navaigation states -- done to ensure correct back button behavior from results page
            navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                { name: 'Home' },
                {
                    name: 'resultPage',
                    params:  {tid: tid}
                },
                ],
            })
            );
        }else{
            if(arg1 == 1){
                setBackColor("#ff0000")
                setTimeout(function(){
                    setBackColor("orange")
                }, 100);
            }else{
                setBackColor("#00ff00")
                setTimeout(function(){
                    setBackColor("orange")
                }, 100);
            }
            setStartTime(new Date() * 1)
            let randIndex = Math.floor(Math.random() * xPos.length)
            setPosition(randIndex)
        }
    }

    return (
        <View style={{...styles.container}}>
            <TouchableWithoutFeedback onPress = {changePosition(1)}>
            <View style={styles.container}/>
            </TouchableWithoutFeedback>
            <TouchableOpacity onPress = {changePosition(0)} style={{...styles.roundButton, ...xPos[position], backgroundColor:backColor}}>
                <Text>{xPos.length}</Text>
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
        borderRadius: 30,
        width: Dimensions.get('window').width * 0.2,
        height: Dimensions.get('window').width * 0.2,
        backgroundColor: 'orange',
    },
  });