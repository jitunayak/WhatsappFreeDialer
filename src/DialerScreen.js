import React, { useRef, useState, useEffect } from 'react';
import { KeyboardAvoidingView, Linking, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import PhoneInput from "react-native-phone-number-input";
import HistoryScreen from './HistoryScreen';
import { WIDTH } from './utility';
import { getAsyncStorageData, storeAsyncStorageData } from './LocalStorageUtulity'


const DialerScreen = () => {
    // const isHermes = () => !!global.HermesInternal;
    // console.log(isHermes())
    const userMsg = "Phone number should not have white spaces and make sure country code is not added in the input text field"
    const phoneInput = useRef(null);
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [showMessage, setShowMessage] = useState(false)
    const [countryCode, setCountryCode] = useState('91')
    const [lastUsedNumber, setLastUsedNumber] = useState(null)
    const WP_BASE_URL = 'https://wa.me/'

    const openWhatsApp = async () => {
        let phoneNumber = WP_BASE_URL + countryCode + value;
        console.log(phoneNumber);
        await storeAsyncStorageData('LAST_USED_NUMBER', countryCode + value)
        loadLastPhoneNumber()
        await Linking.openURL(phoneNumber)

    }

    const openWhatsAppFromLastPhoneNumber = async () => {
        await Linking.openURL(WP_BASE_URL + lastUsedNumber)
    }
    async function loadLastPhoneNumber() {
        setLastUsedNumber(await getAsyncStorageData('LAST_USED_NUMBER'))
    }

    useEffect(() => {
        loadLastPhoneNumber()
    }, [])

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6 }}      >

                <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10, color: 'black' }}>WhatsApp Unkown Dialer</Text>
                <Text style={{ marginHorizontal: 30, marginVertical: 20, fontSize: 14, color: 'gray' }}>{userMsg}</Text>


                <PhoneInput
                    ref={phoneInput}
                    defaultValue={value}
                    defaultCode="IN"
                    layout="first"
                    onChangeText={(text) => {
                        setValue(text);
                    }}
                    onChangeFormattedText={(text) => {
                        setFormattedValue(text);
                    }}
                    onChangeCountry={(country) => {
                        setCountryCode(country.callingCode)
                    }}
                    withShadow
                    autoFocus={false}
                />


                <TouchableOpacity onPress={openWhatsApp} style={{ backgroundColor: 'green', padding: WIDTH * 0.036, marginTop: 20, borderRadius: 6 }}>
                    <Text onPress={openWhatsApp} style={{ fontSize: 18, textAlign: 'center', color: 'white', fontWeight: '500' }}>Start chat on Whatsapp</Text>
                </TouchableOpacity>
                {
                    lastUsedNumber ? <TouchableOpacity onPress={() => openWhatsAppFromLastPhoneNumber()} style={{
                        backgroundColor: 'wheat', padding: 8, width: WIDTH - 20,
                        marginTop: 10,
                    }}>
                        <Text onPress={() => openWhatsAppFromLastPhoneNumber()} style={{ fontSize: 18, textAlign: 'center', color: 'black' }}>Last used : +{lastUsedNumber}</Text>
                    </TouchableOpacity>
                        : <Text>No past record found</Text>
                }
            </SafeAreaView>
        </KeyboardAvoidingView>

    );
};

export default DialerScreen;

