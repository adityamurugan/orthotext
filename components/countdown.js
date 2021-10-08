import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextPropTypes } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const Countdown = () => {
    const [startTime, setStartTime] = useState(5)
    const navigation = useNavigation();
    useEffect(() => {
        if(startTime>0){
            const toggle = setInterval(() => {
                setStartTime(startTime => startTime-1);
            }, 1000);
            return () => clearInterval(toggle);
        }else{
            navigation.navigate('TappingTestScreen')
        }
        })
    console.log(startTime)
    return (
        <View>
            {startTime > 0 && (
            <React.Fragment>
                <Text>Touch the buttons that appear as fast as you can</Text>
                <Text>Buttons will begin appearing in {startTime}s</Text>
            </React.Fragment>
            )}
        </View>
    )
  }

  