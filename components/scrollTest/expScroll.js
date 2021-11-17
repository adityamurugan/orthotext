import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, TouchableWithoutFeedback, Dimensions  } from 'react-native';
import { useNavigation, useRoute, CommonActions, NavigationContainer } from '@react-navigation/native';
import RNSwipeVerify from '../swipeVerify'
import {Database} from "../../Database.js"
import { LogBox } from 'react-native';
import { positionsData } from './positions';

const db = new Database("result.db");
let tid = 0;
const { width } = Dimensions.get('window')
//ignore nativeDriver warning logs
LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

export const ExpScroll = (props) => {
    const navigation = useNavigation();
    const posi = JSON.parse(JSON.stringify(positionsData));
    const swipeComp = useRef(null)
    const [upd, setUpd] = useState(0)
    const [startTime, setStartTime] = useState(new Date() * 1)
    const [trials, setTrials] = useState(0)
    const scrollWidth = Dimensions.get('window').width
    var btnSize = Dimensions.get('window').width*0.2
    const [positionArray, setPositionArray] = useState(posi)

    //function to execute on successful scroll
    function handleVerify(){
        //calculate time to scroll
        let timeElapsed = ((new Date() * 1) - startTime)/1000
        console.log(trials)
        setTrials(0)
        console.log(timeElapsed)
        positionArray.splice(upd,1)
        setPositionArray([...positionArray])
        swipeComp.current.reset()
        console.log(positionArray.length)
        if(positionArray.length==0){
            navigation.navigate("Home")
        }
        let randIndex = Math.floor(Math.random() * positionArray.length)
        setUpd(randIndex)
    }

    //set btnSize on position update
    useEffect(() => {
        console.log('res')
        btnSize = positionArray[upd].alignment == 90 || positionArray[upd].alignment == 270?Dimensions.get('window').width*0.2:Dimensions.get('window').height*0.1
    }, [upd,positionArray])

    //on start scroll, start timing
    function handleStart(){
        if(trials == 0){
            setStartTime(new Date() * 1)
        }
        setTrials(trials+1)
    }

    return (
        <View style={{...styles.container}}>
            <View style={{height:btnSize, bottom:positionArray[upd].bottom+"%" ,left:positionArray[upd].left+"%",width:scrollWidth ,position: "absolute", transform: [{ rotate: positionArray[upd].alignment + "deg" }]}}  onTouchStart={handleStart}>
            <RNSwipeVerify ref={swipeComp}
                width={scrollWidth}
                buttonSize={btnSize}
                borderColor="#fff"
                backgroundColor="#ececec"
                textColor="#37474F"
                borderRadius = {30}
                alignment = {positionArray[upd].alignment}
                onVerified={handleVerify}
            >
                <Text>scroll button to end and release</Text>
            </RNSwipeVerify>
            </View>
        </View>
    )
  }

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#fff",
    },
});