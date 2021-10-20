import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions  } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

import {Database} from "../Database"
import { TapResult } from './tapResultMap';

const db = new Database("result.db");

export const resultPage = (props) => {
    const navigation = useNavigation();
    const [tableHead, SetTableHead] = useState(["",'Zone1', 'Zone2', 'Overall'])
    const [tableData, setTableData] = useState([
        ['1', '2', '3'],
        ['a', 'b', 'c']
      ])
    const [tableTitle, setTableTitle] = useState(['Accuracy (%)', 'Reaction Time (s)'])
    let acc = []
    let rts = []
    useEffect(() => {
        async function getData(){
            let rightCountZ1 = await db.execute("select count(rightClick) as rightCount from tapResult where tid = ? and rightClick = ?  and xPos < ? and yPos < ?", [props.route.params.tid, 1, 45, 45])
            let timeTakenZ1 = await db.execute("select avg(timeTaken) as timeTaken from tapResult where tid = ? and xPos < ? and yPos < ?", [props.route.params.tid, 45, 45])
            let rightCountZ2 = await db.execute("select count(rightClick) as rightCount from tapResult where tid = ? and rightClick = ? and (xPos > ? or yPos > ?)", [props.route.params.tid, 1, 45, 45])
            let timeTakenZ2 = await db.execute("select avg(timeTaken) as timeTaken from tapResult where tid = ? and (xPos > ? or yPos > ?)", [props.route.params.tid, 45, 45])
            let timeTakenOverall = await db.execute("select avg(timeTaken) as timeTaken from tapResult where tid = ?", [props.route.params.tid])
            let accZ1 = (((rightCountZ1.rows[0].rightCount)/30)*100).toFixed(2)
            let accZ2 = (((rightCountZ2.rows[0].rightCount)/70)*100).toFixed(2)
            let accOverall = (((rightCountZ2.rows[0].rightCount+rightCountZ1.rows[0].rightCount)/100)*100).toFixed(2)
            let rtimeZ1 = timeTakenZ1.rows[0].timeTaken.toFixed(2)
            let rtimeZ2 = timeTakenZ2.rows[0].timeTaken.toFixed(2)
            let rtimeOverall = timeTakenOverall.rows[0].timeTaken.toFixed(2)
            acc.push(accZ1,accZ2,accOverall)
            rts.push(rtimeZ1,rtimeZ2,rtimeOverall)
            setTableData([acc,rts])
        }
        getData()
    }, []);

    return (
        <View style={{...styles.container}}>
            <View style={{margin: 7, alignItems: "center"}}>
                <Text style = {{fontSize: 20, fontWeight: "100"}}>Summary Table</Text>
            </View>
            <View style={{ flex: 1 , backgroundColor: "#fff", margin: 7, elevation: 13, borderWidth: 1, borderRadius: 10}}>
                <Table borderStyle={{borderWidth: 0}} style={{paddingTop: 15, paddingLeft: 5}}>
                <Row data={tableHead} flexArr={[2, 1, 1, 1]} style={styles.head} textStyle={styles.text}/>
                <TableWrapper style={styles.wrapper}>
                    <Col data={tableTitle} style={styles.title} textStyle={styles.textTitle}/>
                    <Rows data={tableData} flexArr={[1, 1, 1]} style={styles.row} textStyle={styles.text}/>
                </TableWrapper>
                </Table>
            </View>
            <View style={{ flex: 3, alignItems: "center", marginTop: 15}}>
                <TouchableOpacity onPress = {() => navigation.navigate('TapResult', {params: {tid: props.route.params.tid, tdata: tableData}})} style={{...styles.roundButton}}>
                    <Text>View Detailed Results</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.roundButton}}>
                    <Text>View Another Result</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 15, backgroundColor: '#fff' },
    head: {  height: 40},
    wrapper: { flexDirection: 'row' },
    title: { flex: 2},
    row: {  height: 60  },
    text: { textAlign: 'center', fontWeight: 'bold', fontSize: 15 },
    textTitle: {textAlign: 'left', fontWeight: 'bold', fontSize: 15, padding: 5},
    roundButton: {
        elevation: 5,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: "95%",
        height: 60,
        backgroundColor: '#d3d3d3',
    },
  });