import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions  } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import {Database} from "../Database"

const db = new Database("result.db");

export const resultPage = (props) => {
    const navigation = useNavigation();

    const [res, setRes] = useState([])
    const [reactionTime, setReactionTime] = useState(0)
    useEffect(() => {
        async function getData(){
            dat = await db.execute("select count(rightClick) as rightCount from tapResult where tid = ? and rightClick = ?", [props.route.params.tid, 1])
            let tim = await db.execute("select avg(timeTaken) as timeTaken from tapResult where tid = ?", [props.route.params.tid])
            let acc = ((dat.rows[0].rightCount/100)*100).toFixed(2)
            setRes(acc)
            setReactionTime(tim.rows[0].timeTaken.toFixed(2))
        }
        getData()
    }, []);

    return (
        <View style={{...styles.container}}>
            <Text>Accuracy: {res}%</Text>
            <Text>Mean Reaction Time: {reactionTime}s</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
  });