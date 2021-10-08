import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Button, Text, TextPropTypes } from 'react-native';
import { ExpButton } from './components/expButton';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Home screen function
const BeginPage = ({navigation}) => {
  return <View style={styles.container}>
          <TouchableOpacity style={styles.homeButton} onPress = {() => navigation.navigate('LandingPage', {testSelected: 'Tapping'})}>
            <Text>Tapping Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.homeButton}} onPress = {() => navigation.navigate('LandingPage', {testSelected: 'Swipe'})}>
            <Text>Swipe Test</Text>
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
          <Text>Welcome to {testSelected} test</Text>
          <TouchableOpacity style={{...styles.homeButton}} onPress = {() => setStartTime(5)}>
            <Text>{startTime}</Text>
          </TouchableOpacity>
        </View> 
}

const Stack = createNativeStackNavigator();
export default function App() {
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
  }
});


    /*<View style={styles.container}>
      <StatusBar style="auto" />
      {state === 'home' && (
      <BeginButton ButtonPress = {() => setState('timer')}/>
      )}
      {state === 'timer' && (
      <Countdown endTimer = {() => setState('start')}/>
      )}
      {state === 'start' && (
      <React.Fragment>
        <ExpButton endExp = {() => setState('home')}/>
        <ResetButton ButtonPress = {() => setState('home')}/>
      </React.Fragment>
      )}
    </View>*/