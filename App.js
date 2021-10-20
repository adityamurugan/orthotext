import * as Device from 'expo-device';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Button, Text, TextPropTypes } from 'react-native';
import { ExpButton } from './components/expButton';
import { TapResult } from './components/tapResultMap';
import { resultPage } from './components/resultPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
  const [startTime, setStartTime] = useState("Begin")
  useEffect(() => {
      if(startTime>0){
          const toggle = setInterval(() => {
              setStartTime(startTime => startTime-1);
          }, 1000);
          return () => clearInterval(toggle);
      }
      if(startTime==0){
          navigation.navigate(testSelected + 'Screen')
          setStartTime("Begin")
      }
  })
  
  return <View style={styles.container}>
          <Text style={{fontWeight:'bold',fontSize:20}}>Device under test</Text>
          <Text style={{ fontSize:18}}>{Device.modelName}</Text>
          <TouchableOpacity style={{...styles.homeButton}} onPress = {() => setStartTime(5)}>
            <Text>{startTime}</Text>
          </TouchableOpacity>
        </View> 
}

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists summary (id integer primary key not null, device text, testProduct text);"
      );
      tx.executeSql(
        "create table if not exists tapResult (id integer primary key not null, tid integer, xPos integer, yPos integer, rightClick boolean, timeTaken real);"
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
          <Stack.Screen name="resultPage" component={resultPage}  options={{title: 'Results'}}/>
          <Stack.Screen name="TapResult" component={TapResult}  options={{title: 'Detailed Result' }}/>
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
  welcomeButton: {
    margin: 20,
    elevation: 10,
    borderWidth: 0.5,
    justifyContent: "flex-end",
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