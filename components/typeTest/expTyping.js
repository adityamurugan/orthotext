import React from "react";
import {SafeAreaView, StyleSheet, TextInput, View, Text } from "react-native";
import { acc } from "react-native-reanimated";
let wrongIndexes
let testType = 'insert'
let accurateStrokes, inaccurateStrokes


export const ExpType = (props) => {
  const [text, setText] = React.useState('');
  const [inputText, setInputText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const sentence = "She didn't understand how change worked. When she looked at today compared to yesterday, there was nothing that she could see that was different. Yet, when she looked at today compared to last year, she couldn't see how anything was ever the same."
  const [chars,setChars] = React.useState([...sentence])
  const [charColor,setCharColor] = React.useState([])
  const [prevCount,setPrevCount] = React.useState(0)
  const [startTime, setStartTime] = React.useState(0)
  const [typingAccuracy, setAccuracy] = React.useState(0)
  let clr = charColor
  let chrs = chars
  const inputBox = React.useRef();

  //initialize values on first render
  React.useEffect(() => {
    wrongIndexes = []
    accurateStrokes = 0
    inaccurateStrokes = 0
  },[])

  const pressTrigger = (text) =>{
    console.log(startTime)
    if(startTime == 0){
      setStartTime(Date.now()*1)
    }
    setPrevCount(text?.length)
    if(prevCount>text?.length){
      console.log('Backspace')
    }else{
      if(text){
        keyPressEvent(text[text?.length-1])
      }
    }
  }

  const keyPressEvent = (enteredChar) =>{
      //scrollBox.current.scrollTo({x: currentIndex*8, y: 5, animated: true})
      if(enteredChar != 'Backspace'){
        setText(text+enteredChar)
        if(enteredChar==chars[currentIndex]){
          //calculate and set accuracy
          accurateStrokes = accurateStrokes + 1
          let acc = (accurateStrokes/(accurateStrokes+inaccurateStrokes)*100).toFixed(2)
          setAccuracy(acc)
          //calculate and set WPM

          //set char bgColor to green
          clr[currentIndex]="#1C7947"
          setCharColor([...clr])
          setCurrentIndex(currentIndex+1)
        }else{
          //calculate and set accuracy
          inaccurateStrokes = inaccurateStrokes + 1
          let acc = (accurateStrokes/(accurateStrokes+inaccurateStrokes)*100).toFixed(2)
          setAccuracy(acc)
          //set char bgColor to red
          clr[currentIndex]="#E94560"
          if(testType=='insert' && chars[currentIndex]== " "){
            chrs.splice(currentIndex,0,enteredChar)
            setChars([...chrs])
            setCharColor([...clr])
            wrongIndexes.push(currentIndex)
          }
          setCurrentIndex(currentIndex+1)
          
        }
      }else{
        if(testType!='noDelete'){
          //console.log(currentIndex)
          setText(text.slice(0, -1))
          //console.log(wrongIndexes)
          if(testType=='insert'){
            if(wrongIndexes.includes(currentIndex-1)){
              chrs.splice(currentIndex-1,1)
              setChars([...chrs])
              wrongIndexes.splice(wrongIndexes.indexOf(currentIndex-1), 1);
            }
          }
          clr[currentIndex-1]="#393E46"
          setCharColor([...clr])
          currentIndex>0?setCurrentIndex(currentIndex-1):0
        }
      }
  }

  return (
    <SafeAreaView style={{flex:1, backgroundColor: "#393E46"}}>
        <Text>{typingAccuracy} %</Text>
        <View style={{paddingHorizontal: 20, position: "absolute",top:"30%",flexShrink:1,  backgroundColor: "#393E46"}}>
          <Text style={{fontSize:30, textAlign: "left", lineHeight: 40}}>
          {chars.map((char, index) => (
            <Text key = {index} style={{color: "white", textDecorationLine:currentIndex==index?"underline":"none", backgroundColor: charColor[index]?charColor[index]:"#393E46"}}>{char}</Text>
          ))}
          </Text>
        </View>  
      <View style={{position: "absolute",top:"0%", padding:0, flex:1, width: "100%", height: "100%"}}>
      <TextInput style={{ fontSize:20, ...styles.input }} value = {inputText}
                onChangeText = {inputText => setInputText(inputText)}
                onChange = {e => {
                  pressTrigger(e.nativeEvent.text)
                }}
                autoCorrect = {false}
                autoCapitalize = {'none'}
                autoComplete = {'off'}
                caretHidden = {true}
                onKeyPress = {e => {
                  if(e.nativeEvent.key == 'Backspace'){
                    keyPressEvent('Backspace')
                  }
                }}
                ref = {inputBox}
                keyboardType = 'default'/>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: "100%",
    margin: 0,
    borderWidth: 0,
    color:'rgba(52, 52, 52, 0)'
    
  },
});
