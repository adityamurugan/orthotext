import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions  } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import DropDownPicker from 'react-native-dropdown-picker';
import {Database} from "../Database"

const db = new Database("result.db");

const ResultCards = (props) => {
const navigation = useNavigation()
async function showFullResult(){
  let res = await db.execute('select device, testProduct from summary where id = ?',[props.id])
  let prod = res.rows[0].testProduct
  let dev = res.rows[0].device
  navigation.navigate('resultPage', {tid: props.id, device: dev, product: prod});
}
return <View style={{padding: 10, borderWidth: 1, marginTop: 15, borderRadius: 10, width: "100%", alignItems: 'center'}}>
  <Text>Test Id: {props.id}</Text>
  <Text>Overall Accuracy: {props.accuracy} %</Text>
  <Text>Avg Reaction Time: {props.rTime} sec</Text>
  <TouchableOpacity onPress = {showFullResult} style = {{...styles.roundButton}}>
    <Text>View full results</Text>
  </TouchableOpacity>
</View>
}

export const resultSelect = (props) => {

    const [btnStatus, setBtnStatus] = useState(true)
    const [countLoop, setCountLoop] = useState([])
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'Apple', value: 'apple'},
      {label: 'Banana', value: 'banana'}
    ]);

    let data = []

    useEffect(()=>{
        async function getData(){
            let productData = await db.execute('select distinct testProduct from summary where testStatus = ?',[true])
            productData.rows.forEach((element,index) => {
                data.push({label: element.testProduct, value: element.testProduct})
            });
        }
        getData()
        setItems(data)
    },[])

    async function showResults(){
      let idArr = await db.execute('select id from summary where testProduct = ? and testStatus = true order by id desc limit 3',[value])
      let idExtract = idArr.rows.map(a => a.id)
      let resultDataOverall = await db.execute('select avg(timeTaken) as timeTaken, tid as tid from tapResult group by tid order by id desc ')
      let resultCount = await db.execute('select count(rightClick) as rightCount, tid as tid from tapResult where rightClick = 1 group by tid order by id desc ')
      let filteredOverall = resultDataOverall.rows.filter(row => idExtract.includes(row.tid))
      let filteredCount = resultCount.rows.filter(row => idExtract.includes(row.tid))
      filteredOverall.forEach(function(element,index){
        element.Count = filteredCount[index].rightCount
      })
      setCountLoop(filteredOverall)
    }
    
  
    return (
      <View style = {{flex:1, padding: 15, marginHorizontal: 15, alignItems: 'center', zIndex: 10, position: 'relative'}}>
        <Text style = {{marginBottom: 15}}>Select product:</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          zIndex={10}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onChangeValue={()=>{setBtnStatus(false)}}
        />
        <TouchableOpacity disabled = {btnStatus} onPress = {showResults} style = {{...styles.roundButton}}>
          <Text>View Results</Text>
        </TouchableOpacity>
        
        {countLoop?.map((datum, index) => (
              <ResultCards key = {index} id = {countLoop[index].tid} accuracy = {countLoop[index].Count} rTime = {(countLoop[index].timeTaken).toFixed(2)}/>
            ))}
      </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 15, backgroundColor: '#fff' },
    roundButton: {
      marginTop: 15,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      width: "50%",
      height: 40,
      backgroundColor: '#d3d3d3',
  },
})