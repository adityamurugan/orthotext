import * as Device from 'expo-device';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Button, Text, TextPropTypes } from 'react-native';
import { ParticipantDrop } from './components/participantDrop';
import { ExpButton } from './components/expButton';
import { TapResult } from './components/tapResultMap';
import { resultPage } from './components/resultPage';
import { SwipeCanvas } from './components/swipeTest/expCanvas';
import { swipeResultPage } from './components/swipeTest/swipeResultPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExpScroll } from './components/scrollTest/expScroll';
import { resultSelect } from './components/resultSelect';
import { ExpType } from './components/typeTest/expTyping';
import { TestTypeDrop } from './components/typeTest/testSelect';
import { scrollResultPage } from './components/scrollTest/scrollResultPage';
import DropDownPicker from 'react-native-dropdown-picker';
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("result.db")

//Home screen function
const BeginPage = ({navigation}) => {
  return  <View style = {{flex:1}}>
            <View style={{...styles.homeContainer, alignItems: 'flex-end', justifyContent: "center"}}>
              <TouchableOpacity style={styles.welcomeButton} onPress = {() => navigation.navigate('LandingPage', {testSelected: 'Tapping'})}>
                  <Text style={{textAlign:"left", fontSize:23, fontWeight:"normal"}}>Tapping</Text>
                  <Text style={{textAlign:"left", fontSize:23, fontWeight:"normal"}}>Test</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.welcomeButton}} onPress = {() => navigation.navigate('LandingPage', {testSelected: 'Swipe'})}>
                  <Text style={{textAlign:"left", fontSize:23, fontWeight:"normal"}}>Swiping</Text>
                  <Text style={{textAlign:"left", fontSize:23, fontWeight:"normal"}}>Test</Text>
              </TouchableOpacity>
            </View> 
            <View style={{...styles.homeContainer, alignItems: 'flex-start', justifyContent: "center"}}>
              <TouchableOpacity style={styles.welcomeButton} onPress = {() => navigation.navigate('LandingPage', {testSelected: 'Scrolling'})}>
                <Text style={{textAlign:"left", fontSize:23, fontWeight:"normal"}}>Scrolling</Text>
                <Text style={{textAlign:"left", fontSize:23, fontWeight:"normal"}}>Test</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles.welcomeButton}} onPress = {() => navigation.navigate('LandingPage', {testSelected: 'Typing'})}>
                <Text style={{textAlign:"left", fontSize:23, fontWeight:"normal"}}>Typing</Text>
                <Text style={{textAlign:"left", fontSize:23, fontWeight:"normal"}}>Test</Text>
              </TouchableOpacity>
            </View> 
          </View>
}

//Landing screen function - loads after a test is selected
const LandingPage = ({route, navigation}) => {
  const { testSelected } = route.params;
  const [testMode, setTestMode] = useState('insert')
  const [participantID, setParticipantID] = useState(1)
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

  const onTestUpdate = (testMode) => {
    setTestMode(testMode)
  }

  const onParticipantUpdate = (pid) => {
    setParticipantID(pid)
  }

  useEffect(() => {
      if(startTime>0){
          const toggle = setInterval(() => {
              setStartTime(startTime => startTime-1);
          }, 1000);
          return () => clearInterval(toggle);
      }
      if(startTime==0 && testSelected != 'Typing'){
          navigation.navigate(testSelected + 'Screen', {'product': productValue, 'device': Device.modelId, 'PID': participantID})
          setStartTime("Begin")
      }else if (startTime==0 && testSelected == 'Typing'){
        navigation.navigate(testSelected + 'Screen', {'product': productValue, 'device': Device.modelId, 'testMode': testMode, 'PID':participantID })
        setStartTime("Begin")
      }
  })
  
  return <View style={styles.container}>
          <Text style={{fontWeight:'bold',fontSize:20}}>Device under test</Text>
          <Text style={{ fontSize:18}}>{Device.modelId}</Text>
          <View style = {{padding: 10, alignItems: "center", paddingHorizontal: 80, zIndex: 15}}>
              <Text style={{fontWeight:'bold',fontSize:20, marginBottom: 8}}>Participant:</Text>
              <ParticipantDrop onUpdate={onParticipantUpdate}></ParticipantDrop>
          </View>
          <View style = {{padding: 10, alignItems: "center", paddingHorizontal: 80, zIndex:10}}>
            <Text style={{fontWeight:'bold',fontSize:20, marginBottom: 8}}>Product Under Test:</Text>
            <DropDownPicker
              zIndex={10}
              zIndexInverse={1000}
              open={productOpen}
              value={productValue}
              items={productItems}
              setOpen={setProductOpen}
              setValue={setProductValue}
              placeholder="Select product"
              onChangeValue={()=>{SetBtnState(false) 
                                  setStartTime('Begin')}}
              showArrowIcon={false}
              showTickIcon={false}
              setItems={setProductItems}
              labelStyle = {{textAlign: 'center', fontSize:18}}
              textStyle = {{textAlign: 'center', fontSize:18}}
            />
          </View>
          {testSelected == 'Typing' && 
            <View style = {{padding: 20, alignItems: "center", paddingHorizontal: 80, zIndex: 5}}>
              <Text style={{fontWeight:'bold',fontSize:20, marginBottom: 8}}>Select test mode</Text>
              <TestTypeDrop onUpdate={onTestUpdate}></TestTypeDrop>
            </View>
          }

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
      tx.executeSql(
       "drop table if exists summary"
      );
      tx.executeSql(
        "drop table if exists tapResult"
      );
      tx.executeSql(
        "drop table if exists swipeResult"
      );
      tx.executeSql(
        "drop table if exists scrollResult"
      );
      tx.executeSql(
        "drop table if exists participants"
      );
      tx.executeSql(
        "create table if not exists summary (id integer primary key not null, device text, testType text, testProduct text, testMode text, testStatus boolean, pid integer);"
      );
      tx.executeSql(
        "create table if not exists tapResult (id integer primary key not null, tid integer, xPos integer, yPos integer, rightClick boolean, timeTaken real);"
      );
      tx.executeSql(
        "create table if not exists swipeResult (id integer primary key not null, tid integer, xDP real, yDP real, xPX integer, yPX integer, trialNumber integer, base64img text);"
      );
      tx.executeSql(
        "create table if not exists scrollResult (id integer primary key not null, tid integer, xPos integer, yPos integer, alignment integer, trials integer, timeTaken real);"
      );
      tx.executeSql(
        "create table if not exists typeResult (id integer primary key not null, tid integer, trialNumber integer , wpm real , accuracy real , rawwpm real);"
      );
      tx.executeSql(
        "create table if not exists participants (id integer primary key not null, firstName text, lastName text);"
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
          <Stack.Screen name="Home" component={BeginPage}  options={{title: 'Home'}}/>
          <Stack.Screen name="LandingPage" component={LandingPage} options={({ route }) => ({ title: route.params.testSelected + " test" })}/>
          <Stack.Screen name="TappingScreen" component={ExpButton}  options={{title: 'Tapping test'}}/>
          <Stack.Screen name="SwipeScreen" component={SwipeCanvas}  options={{title: 'Swiping test'}}/>
          <Stack.Screen name="resultPage" component={resultPage}  options={{title: 'Results'}}/>
          <Stack.Screen name="TapResult" component={TapResult}  options={{title: 'Detailed Result' }}/>
          <Stack.Screen name="resultSelect" component={resultSelect}  options={{title: 'Select data to view' }}/>
          <Stack.Screen name="swipeResultPage" component={swipeResultPage}  options={{title: 'Results' }}/>
          <Stack.Screen name="ScrollingScreen" component={ExpScroll}  options={{title: 'Scrolling Test' }}/>
          <Stack.Screen name="scrollResultPage" component={scrollResultPage}  options={{title: 'Results' }}/>
          <Stack.Screen name="TypingScreen" component={ExpType}  options={{title: 'Typing Test' }}/>
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
  },
});