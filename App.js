import * as Device from 'expo-device';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Button, Text, TextPropTypes } from 'react-native';
import { ExpButton } from './components/expButton';
import { TapResult } from './components/tapResultMap';
import { resultPage } from './components/resultPage';
import { SwipeCanvas } from './components/swipeTest/expCanvas';
import { swipeResultPage } from './components/swipeTest/swipeResultPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { resultSelect } from './components/resultSelect';
import DropDownPicker from 'react-native-dropdown-picker';
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("result.db")

//Home screen function
const BeginPage = ({navigation}) => {
  return <View style={styles.homeContainer}>
          <TouchableOpacity style={styles.welcomeButton} onPress = {() => navigation.navigate('LandingPage', {testSelected: 'Tapping'})}>
            <Text style={{textAlign:"left", fontSize:25, fontWeight:"bold"}}>Tapping Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.welcomeButton}} onPress = {() => navigation.navigate('LandingPage', {testSelected: 'Swipe'})}>
            <Text style={{textAlign:"left", fontSize:25, fontWeight:"bold"}}>Swiping Test</Text>
          </TouchableOpacity>
        </View> 
}

//Landing screen function - loads after a test is selected
const LandingPage = ({route, navigation}) => {
  const { testSelected } = route.params;
  const [startTime, setStartTime] = useState("Select product")
  const [btnState, SetBtnState] = useState(true)
  const [productOpen, setProductOpen] = useState(false);
  const [productValue, setProductValue] = useState(null);
  const [productItems, setProductItems] = useState([
    {label: 'Metal Ring', value: 'Metal Ring'},
    {label: 'Pop Socket', value: 'Pop Socket'},
    {label: 'Hand Loop', value: 'Hand Loop'},
    {label: 'Orthotext', value: 'Orthotext'}
  ]);
  useEffect(() => {
      if(startTime>0){
          const toggle = setInterval(() => {
              setStartTime(startTime => startTime-1);
          }, 1000);
          return () => clearInterval(toggle);
      }
      if(startTime==0){
          navigation.navigate(testSelected + 'Screen', {'product': productValue, 'device': Device.modelName})
          setStartTime("Begin")
      }
  })
  
  return <View style={styles.container}>
          <Text style={{fontWeight:'bold',fontSize:20}}>Device under test</Text>
          <Text style={{ fontSize:18}}>{Device.modelName}</Text>
          <View style = {{padding: 20, alignItems: "center", paddingHorizontal: 80}}>
            <Text style={{fontWeight:'bold',fontSize:20, marginBottom: 8}}>Select product to test</Text>
            <DropDownPicker
              zIndex={3000}
              zIndexInverse={1000}
              open={productOpen}
              value={productValue}
              items={productItems}
              setOpen={setProductOpen}
              setValue={setProductValue}
              onChangeValue={()=>{SetBtnState(false) 
                                  setStartTime('Begin')}}
              showArrowIcon={false}
              showTickIcon={false}
              setItems={setProductItems}
              labelStyle = {{textAlign: 'center', fontSize:18}}
              textStyle = {{textAlign: 'center', fontSize:18}}
            />
          </View>

          <TouchableOpacity disabled = {btnState} style={(btnState)?{...styles.homeButtonDisabled}:{...styles.homeButton}} onPress = {() => setStartTime(5)}>
            <Text>{startTime}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.homeButton}} onPress = {() => navigation.navigate('resultSelect')}>
            <Text>View Results</Text>
          </TouchableOpacity>
        </View> 
}

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    db.transaction((tx) => {
      // tx.executeSql(
      //  "drop table if exists summary"
      // );
      // tx.executeSql(
      //   "drop table if exists tapResult"
      // );
      // tx.executeSql(
      //   "drop table if exists swipeResult"
      // );
      tx.executeSql(
        "create table if not exists summary (id integer primary key not null, device text, testType text, testProduct text, testStatus boolean);"
      );
      tx.executeSql(
        "create table if not exists tapResult (id integer primary key not null, tid integer, xPos integer, yPos integer, rightClick boolean, timeTaken real);"
      );
      tx.executeSql(
        "create table if not exists swipeResult (id integer primary key not null, tid integer, xDP real, yDP real, xPX integer, yPX integer, trialNumber integer, base64img text);"
      );
    });
  }, []);
  return (
      <NavigationContainer>
        <Stack.Navigator  screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            }}>
          <Stack.Screen name="Home" component={BeginPage}  options={{title: 'Select a test'}}/>
          <Stack.Screen name="LandingPage" component={LandingPage} options={({ route }) => ({ title: route.params.testSelected + " test" })}/>
          <Stack.Screen name="TappingScreen" component={ExpButton}  options={{title: 'Tapping test'}}/>
          <Stack.Screen name="SwipeScreen" component={SwipeCanvas}  options={{title: 'Swiping test'}}/>
          <Stack.Screen name="resultPage" component={resultPage}  options={{title: 'Results'}}/>
          <Stack.Screen name="TapResult" component={TapResult}  options={{title: 'Detailed Result' }}/>
          <Stack.Screen name="resultSelect" component={resultSelect}  options={{title: 'Select data to view' }}/>
          <Stack.Screen name="swipeResultPage" component={swipeResultPage}  options={{title: 'Results' }}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    marginTop: 20,
    alignItems: 'center',
    width: 150,
    backgroundColor: "#DDDDDD",
    padding: 20,
    borderRadius: 20,
  },
  homeButtonDisabled: {
    marginTop: 20,
    alignItems: 'center',
    width: 150,
    backgroundColor: "#f5f5f5",
    borderColor: 'red',
    borderWidth: 1,
    padding: 20,
    borderRadius: 20,
  },
  welcomeButton: {
    margin: 20,
    elevation: 10,
    borderWidth: 0.5,
    justifyContent: "center",
    width: 150,
    height:150,
    backgroundColor: "#DDDDDD",
    padding: 20,
    borderRadius: 10,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});