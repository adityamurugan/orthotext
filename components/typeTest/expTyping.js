import React from "react";
import { Alert, SafeAreaView, StyleSheet, TextInput, View, Text } from "react-native";
let wrongIndexes
let testType = 'insert'

export const ExpType = (props) => {
  const [text, setText] = React.useState('');
  const [inputText, setInputText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const sentence = "Lorem, ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Etiam tempor orci eu lobortis elementum nibh tellus. Elementum pulvinar etiam non quam lacus suspendisse."
  const [chars,setChars] = React.useState([...sentence])
  const [charColor,setCharColor] = React.useState([])
  const [prevCount,setPrevCount] = React.useState(0)
  const [startTime, setStartTime] = React.useState(0)
  let clr = charColor
  let chrs = chars
  const inputBox = React.useRef();

  React.useEffect(() => {
    wrongIndexes = []
  },[])

  const pressTrigger = (text) =>{
    console.log(startTime)
    if(startTime == 0){
      setStartTime(Date.now()*1)
    }
    setPrevCount(text?.length)
    // console.log(prevCount)
    // console.log(inputText?.length)
    if(prevCount>text?.length){
      console.log('Backspace')
      //keyPressEvent('Backspace')
    }else{
      if(text){
        keyPressEvent(text[text?.length-1])
      }
    }
  }

  const keyPressEvent = (enteredChar) =>{

      if(enteredChar != 'Backspace'){
        setText(text+enteredChar)
        if(enteredChar==chars[currentIndex]){
          clr[currentIndex]="green"
          setCharColor([...clr])
          setCurrentIndex(currentIndex+1)
        }else{
          clr[currentIndex]="red"
          if(testType=='insert'){
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
          clr[currentIndex-1]="white"
          setCharColor([...clr])
          currentIndex>0?setCurrentIndex(currentIndex-1):0
        }
      }
  }

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={{position: "absolute",top:"30%", padding:50, flex:1, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignContent: "center"}}>
        {chars.map((char, index) => (
           <Text key = {index} style={{fontSize: 20, color: "black", backgroundColor: charColor[index]?charColor[index]:"white"}}>{char}</Text>
        ))}
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
    margin: 12,
    borderWidth: 0,
    color:'rgba(52, 52, 52, 0)'
    
  },
});
