import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Linking, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import PhoneInput from "react-native-phone-number-input";
import DialerScreen from './src/DialerScreen';
import HistoryScreen from './src/HistoryScreen';
import { WIDTH } from './src/utility';


const App = () => {


  return (
    <DialerScreen />

  );
};

export default App;

