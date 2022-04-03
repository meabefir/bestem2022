import React, { Component, useState } from "react";
import { Button, Platform, Text, Vibration, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Pressable, Alert, ImageBackground, Image } from "react-native";
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-ico-material-design';

const Separator = () => {
  return <View style={Platform.OS === "android" ? styles.separator : null} />;
}

const ONE_SECOND_IN_MS = 500;

const LETTER_PATTERNS = {
  'a': [1, 2],
  'b': [2, 1, 1, 1],
  'c': [2, 1, 2, 1],
  'd': [2, 1, 1],
  'e': [1],
  'f': [1, 1, 2, 1],
  'g': [2, 2, 1],
  'h': [1, 1, 1, 1],
  'i': [1, 1],
  'j': [1, 2, 2, 2],
  'k': [2, 1, 2],
  'l': [1, 2, 1, 1],
  'm': [2, 2],
  'n': [2, 1],
  'o': [2, 2, 2],
  'p': [1, 2, 2, 1],
  'q': [2, 2, 1, 2],
  'r': [1, 2, 1],
  's': [1, 1, 1],
  't': [2],
  'u': [1, 1, 2],
  'v': [1, 1, 1, 2],
  'w': [1, 2, 2],
  'x': [2, 1, 1, 2],
  'y': [2, 1, 2, 2],
  'z': [2, 2, 1, 1],
  '1': [1, 2, 2, 2, 2],
  '2': [1, 1, 2, 2, 2],
  '3': [1, 1, 1, 2, 2],
  '4': [1, 1, 1, 1, 2],
  '5': [1, 1, 1, 1, 1],
  '6': [2, 1, 1, 1, 1],
  '7': [2, 2, 1, 1, 1],
  '8': [2, 2, 2, 1, 1],
  '9': [2, 2, 2, 2, 1],
  '0': [2, 2, 2, 2, 2]
}

const letterFromSignal = (signal) => {
  console.log("letter", signal)
  for (const key in LETTER_PATTERNS) {
    // if (LETTER_PATTERNS[key] == signal) {
    if (JSON.stringify(LETTER_PATTERNS[key])==JSON.stringify(signal)) {

      console.log("cheia e ", key)
      return key;
    }
  }
  return "";
}

const interpretTimes = (times) => {
  console.log("resetting")
  if (times.length == 0) return

  let ret = ""

  let signal = []
  for (let i = 0; i < times.length; i++) {
    if (i == 0 && times[i][1] == "out") continue;
    
    if (times[i][1] == "out" && times[i][0] > ONE_SECOND_IN_MS * 3 - ONE_SECOND_IN_MS / 2 && times[i][0] < ONE_SECOND_IN_MS * 3 + ONE_SECOND_IN_MS / 2) {
      // letter spacing
      ret += letterFromSignal(signal)
      signal = []
    }
    else if (times[i][1] == "out" && times[i][0] > ONE_SECOND_IN_MS * 7 - ONE_SECOND_IN_MS / 2 && times[i][0] < ONE_SECOND_IN_MS * 7 + ONE_SECOND_IN_MS / 2) {
      // new word
      ret += letterFromSignal(signal)
      signal = []
      ret += " "
    }
    else if (times[i][1] == "in") {
      if (times[i][0] > ONE_SECOND_IN_MS * 1 - ONE_SECOND_IN_MS / 2 && times[i][0] < ONE_SECOND_IN_MS * 1 + ONE_SECOND_IN_MS / 2) {
        signal.push(1)
      } else if (times[i][0] > ONE_SECOND_IN_MS * 2 - ONE_SECOND_IN_MS / 2 && times[i][0] < ONE_SECOND_IN_MS * 2 + ONE_SECOND_IN_MS / 2) {
        signal.push(2)
      }
    }
    
    // console.log(times[i])
  }
  ret += letterFromSignal(signal)
  signal = []

  console.log("asta e ret ", ret)
  return ret
}

const DecodeMorse = () => {
  const [lastTime, setLastTime] = useState(new Date());
  const [times, setTimes] = useState([]);

  // let time_now = new Date();
  //   console.log(time_now - this.state.lastTime)
  //   // this.setState(prevState => ({
  //   //   timeLog: [...prevState.timeLog, time_now - prevState.lastTime],
  //   //   lastTime: time_now
  //   // }));

  return (
    
    <SafeAreaView>
      <TouchableOpacity style={{ height: 150, marginTop: 10, backgroundColor: "#8F8CE7", borderRadius: 5, display:'flex', justifyContent:'center', alignItems:'center'}} 
      onPressIn={() => {
        let time_now = new Date();
        let time_passed = time_now - lastTime
        setLastTime(time_now)
        if (time_passed >= ONE_SECOND_IN_MS * 7.5) {
          setTimes([time_passed, "out"])
        } else {
          setTimes([...times, [time_passed, "out"]])
        }

      }}
      onPressOut={() => {
        let time_now = new Date();
        let time_passed = time_now - lastTime
        setLastTime(time_now)
        setTimes([...times, [time_passed, "in"]]) 
      }}>
      
      <Text style={{color: 'white', fontSize: 32}}>{interpretTimes(times)}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const image = { uri: "https://images.rawpixel.com/image_400/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvdjkxNS1teW50LTAwMy1lXzIuanBn.jpg?s=vRSaR1AHVTd-EQXOSg4g0IOwd4iJfhcJwPupwLtfMyM" };

var iconHeight = 64;
var iconWidth = 64;

class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      test: <Main />
    }
  }
  
  changeComponent = (varr) => {
    console.log(varr)
    this.setState({
      test: varr
    })
  }

  render(){
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={{fontSize:30, color:'white', }}>{this.state.test}</Text>
          <StatusBar style='light'/>
        </View>
        
        <SafeAreaView style={styles.NavContainer}>
          <View style={styles.NavBar}>
            <Pressable onPress={() => this.changeComponent(<Main />)} style={styles.IconBehave}
            android_ripple={{borderless: true, radius: 50}}>
              <Icon name="favourite-heart-button" height={iconHeight} width={iconWidth} color='#448aff'/>
            </Pressable>

            <Pressable onPress={() => this.changeComponent(<DecodeMorse />)} style={styles.IconBehave}
            android_ripple={{borderless: true, radius: 50}}>
              <Icon name="chat-bubble" height={iconHeight} width={iconWidth} color='#1e88e5'/>
            </Pressable>

            <Pressable onPress={() => this.changeComponent('User')} style={styles.IconBehave}
            android_ripple={{borderless: true, radius: 50}}>
              <Icon name="user-shape" height={iconHeight} width={iconWidth} color='#1565c0'/>
            </Pressable>

            <Pressable onPress={() => this.changeComponent('Settings')} style={styles.IconBehave}
            android_ripple={{borderless: true, radius: 50}}>
              <Icon name="settings-cogwheel-button" height={iconHeight} width={iconWidth} color='#1565c0'/>
            </Pressable>

          </View>
        </SafeAreaView>

      </SafeAreaView>
      );
  }
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // talkToMeInput: 'the quick brown fox jumps over the lazy dog',
      talkToMeInput: 'test',
      outputText: "",
      signal: [],
      decodeMorse: <DecodeMorse />
    };
  }
  
  onChangeTalkToMeInput = (key) => {
    this.setState({
      talkToMeInput: key
    })
    console.log(this.state.talkToMeInput)
  }

  // with setTime
  // encodeText = () => {
  //   let words = this.state.talkToMeInput.split(" ")
  //   let currentTime = 0
  //   for (let word of words) {
  //     for (let letter of word) {
  //       letter = letter.toLowerCase()
  //       if (LETTER_PATTERNS[letter] == undefined)
  //         continue;
  //       let vibration_data = LETTER_PATTERNS[letter].map(d => d * ONE_SECOND_IN_MS)
  //       for (let i = vibration_data.length-1; i > 0; i--) {
  //         vibration_data.splice(i, 0, ONE_SECOND_IN_MS);
  //       }
  //       vibration_data.unshift(0)
  //       vibration_data.push(3 * ONE_SECOND_IN_MS)
  //       let duration = vibration_data.reduce((el, acc) => el + acc);

  //       setTimeout(() => {
  //         Vibration.vibrate(vibration_data)
  //       }, currentTime);

  //       currentTime += duration
  //     }
  //     let word_timeout_dits = 7
  //     setTimeout(() => {
  //       Vibration.vibrate([word_timeout_dits * ONE_SECOND_IN_MS, 0])
  //     }, currentTime);
  //     currentTime += word_timeout_dits * ONE_SECOND_IN_MS
  //   }
  // }

  encodeText = () => {
    let words = this.state.talkToMeInput.split(" ")
    let vibration_pattern = [0]

    for (let word of words) {
      for (let letter of word) {
        letter = letter.toLowerCase()
        if (LETTER_PATTERNS[letter] == undefined)
          continue;
        let vibration_data = LETTER_PATTERNS[letter].map(d => d * ONE_SECOND_IN_MS)
        for (let i = vibration_data.length-1; i > 0; i--) {
          vibration_data.splice(i, 0, ONE_SECOND_IN_MS);
        }
        vibration_data.push(3 * ONE_SECOND_IN_MS)
        
        vibration_pattern = vibration_pattern.concat(vibration_data)
      }
      let word_timeout_dits = 4
      vibration_pattern = vibration_pattern.concat([0, word_timeout_dits * ONE_SECOND_IN_MS])
    }
    Vibration.vibrate(vibration_pattern)
  }

  addToOutput = (s) => {
    if (s == '/') {
      this.setState(prev => {
        let out = prev.outputText + ' '
        if (out.substring(out.length - 3) == '   ') {
          out = ""
        } else {
          out += letterFromSignal(prev.signal)
        }
        return ({
          outputText: out,
          signal: []
        })
      })
    }

    else if (s == '_') {
      this.setState(prev => {
        let new_out = prev.outputText
        new_out += letterFromSignal(prev.signal)
        return ({
          outputText: new_out,
          signal: []
        })
      })
    }

    else if (s == '-') {
      this.setState(prev => {
        return ({
          signal: [...prev.signal, 2]
        })
      })
    }

    else if (s == '.') {
      this.setState(prev => {
        return ({
          signal: [...prev.signal, 1]
        })
      })
    }
  }
  
  render() {

    const PATTERN = [
      1 * ONE_SECOND_IN_MS,
      2 * ONE_SECOND_IN_MS,
      3 * ONE_SECOND_IN_MS
    ];

    return (
      <SafeAreaView style={styles.container2}>
      
        <View style={styles.fixToText}>
          <TouchableOpacity onPressIn={() => {this.addToOutput('-')}} 
          style={{display: "flex", justifyContent: "center", alignItems: "center", height: 150, width: 150, backgroundColor: "#0F9B8E", borderRadius: 15, borderColor: '#03719C', borderWidth: 5}} >
            {/* <Text style={{color: 'white', fontSize: 64}}>-</Text> */}
            <Icon name="horizontal-line-remove-button" height={iconHeight} width={iconWidth} color='white'/>
          </TouchableOpacity>
          <TouchableOpacity onPressIn={() => {this.addToOutput('.')}} 
          style={{display: "flex", justifyContent: "center", alignItems: "center", height: 150, width: 150, backgroundColor: "#0F9B8E", borderRadius: 15, borderColor: '#03719C', borderWidth: 5  }} >
            <Text style={{color: 'white', fontSize: 64}}>●</Text>
          </TouchableOpacity>
        </View>
        
        <View>

          <Separator />
          <Button
            title="Stop vibration"
            onPress={() => {
              Vibration.cancel();
              this.setState({
                decodeMorse: null
              })
              this.forceUpdate()
              this.setState({
                decodeMorse: <DecodeMorse />
              })
              this.forceUpdate()

            }}
            color="#FD5956"
          />
          
          {/* <TextInput
          style={styles.input}
          onChangeText={this.onChangeTalkToMeInput}
          value={this.state.talkToMeInput}
          /> */}

          <TextInput
          style={styles.input}
          onChangeText={this.onChangeTalkToMeInput}
          value={this.state.talkToMeInput} />
          
          <Button title="Morsify" onPress={this.encodeText} color="#8F8CE7"/>
          
          <Separator />
          {this.state.decodeMorse}

          <Text style={{fontSize: 32, color:'white'}}>{this.state.outputText}</Text>
        </View>

        <View style={styles.fixToText}>
          <TouchableOpacity onPressIn={() => {this.addToOutput('_')}} 
          style={{display: "flex", justifyContent: "center", alignItems: "center", height: 150, width: 150, backgroundColor: "#0F9B8E", borderRadius: 15, borderColor: '#03719C', borderWidth: 5 }} >
          <Icon name="keyboard-right-arrow-button-1" height={iconHeight} width={iconWidth} color='white'/>
          </TouchableOpacity>
          
          <TouchableOpacity onPressIn={() => {this.addToOutput('/')}} 
          style={{flexDirection: "row", display: "flex", justifyContent: "center", alignItems: "center", height: 150, width: 150, backgroundColor: "#0F9B8E", borderRadius: 15, borderColor: '#03719C', borderWidth: 5  }} >
            <Icon name="keyboard-right-arrow-button-1" height={iconHeight} width={iconWidth} color='white'/>
            <Icon name="keyboard-right-arrow-button-1" height={iconHeight} width={iconWidth} color='white'/>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#3962FF',
    alignItems: 'center',
    justifyContent: 'center',

  },
  NavContainer: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 20,
  },

  NavBar: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    width: '90%',
    justifyContent: 'space-between',
    borderRadius: 40
  },

  IconBehave: {
    padding: 14
  },

  container2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 44,
    padding: 8,
    backgroundColor: '#343837'
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },
  paragraph: {
    margin: 24,
    textAlign: "center"
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'black',
    backgroundColor: '#95A3A6',
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  }
});

export default Main;