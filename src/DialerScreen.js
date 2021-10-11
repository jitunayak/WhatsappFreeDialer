import React, { useRef, useState, useEffect } from 'react';
import { Alert, KeyboardAvoidingView, Linking, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
    const WP_DEEP_LINK = 'whatsapp://send?text=Hi&phone='


    const openWhatsApp = async () => {
        if (value === '') {
            Alert.alert('Kindly, enter a phone number');
        }
        else {
            const whatsappInstalled = await Linking.canOpenURL(WP_DEEP_LINK).catch(err => Alert.alert('WhatsApp Not installed'))
            if (whatsappInstalled) {
                let phoneNumber = WP_BASE_URL + countryCode + value;
                await storeAsyncStorageData('LAST_USED_NUMBER', countryCode + value)
                loadLastPhoneNumber()
                await Linking.openURL(WP_DEEP_LINK + countryCode + value)
            }
        }
    }


    const openWhatsAppFromLastPhoneNumber = async () => {
        Linking.canOpenURL(WP_DEEP_LINK).then(whatsappInstalled => {
            if (whatsappInstalled) { Linking.openURL(WP_DEEP_LINK + lastUsedNumber) }
        }).catch(err => Alert.alert('WhatsApp Not installed'))
    }
    async function loadLastPhoneNumber() {
        setLastUsedNumber(await getAsyncStorageData('LAST_USED_NUMBER'))
    }

    useEffect(() => {
        loadLastPhoneNumber()
    }, [])

    return (
        // <KeyboardAvoidingView
        //     style={{ flex: 1 }}
        //     behavior={Platform.OS === "ios" ? "padding" : "height"}
        // >
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}      >
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
                    containerStyle={{ width: WIDTH - 20, borderRadius: 6, height: 70 }}
                />


                <TouchableOpacity onPress={openWhatsApp} style={{ backgroundColor: 'green', padding: WIDTH * 0.026, marginTop: 20, borderRadius: 6 }}>
                    <Text onPress={openWhatsApp} style={{ fontSize: 18, textAlign: 'center', color: 'white', fontWeight: '500' }}>Start chat on Whatsapp</Text>
                </TouchableOpacity>
                {
                    lastUsedNumber ? <TouchableOpacity onPress={() => openWhatsAppFromLastPhoneNumber()} style={{
                        backgroundColor: 'wheat', padding: 8, width: WIDTH - 20,
                        marginTop: 10, borderRadius: 6
                    }}>
                        <Text onPress={() => openWhatsAppFromLastPhoneNumber()} style={{ fontSize: 16, textAlign: 'center', color: 'black' }}>Last used : +{lastUsedNumber}</Text>
                    </TouchableOpacity>
                        : <Text>No past record found</Text>
                }
            </ScrollView>
        </SafeAreaView>
    );
};

export default DialerScreen;

