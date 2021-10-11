import React, { useEffect, useRef, useState } from 'react';
import { Alert, Appearance, Linking, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity } from 'react-native';
import DialogInput from 'react-native-dialog-input';
import PhoneInput from 'react-native-phone-number-input';
import { getAsyncStorageData, storeAsyncStorageData } from './LocalStorageUtulity';
import { WIDTH } from './utility';


const DialerScreen = () => {
    // const isHermes = () => !!global.HermesInternal;
    // console.log(isHermes())
    const userMsg = "if any country code (e.g 91 for IN ) is included in phone number . That will be removed automatically for convenience."
    const phoneInput = useRef(null);

    const [phoneNumberValue, setPhoneNumberValue] = useState("");
    const [countryCode, setCountryCode] = useState('91')
    const [lastUsedNumber, setLastUsedNumber] = useState(null)
    const [titleColor, setTitleColor] = useState('black')
    const [contactName, setContactName] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)

    Appearance.addChangeListener(() => {
        const colorScheme = Appearance.getColorScheme();
        if (colorScheme === 'dark') {
            setTitleColor('white')
        }
        if (colorScheme === 'light') {
            setTitleColor('black')
        }
    })
    const WP_BASE_URL = 'https://wa.me/'
    const WP_DEEP_LINK = 'whatsapp://send?text=Hi&phone='


    const openWhatsApp = async () => {

        if (phoneNumberValue === '') {
            Alert.alert('Kindly, enter a phone number');
        }
        else {
            const invalidprefix = phoneNumberValue.startsWith(countryCode)
            console.log(countryCode + "---" + phoneNumberValue)

            if (invalidprefix) {
                const local = phoneNumberValue.substring(countryCode.length, phoneNumberValue.length);
                console.log("correct " + local);
                await Linking.canOpenURL(WP_DEEP_LINK).then(
                    async () => {
                        await Linking.openURL(WP_DEEP_LINK + countryCode + local)
                        await storeAsyncStorageData('LAST_USED_NUMBER', countryCode + local)
                        loadLastPhoneNumber()
                    }
                ).catch(err => Alert.alert('WhatsApp Not installed'))

            }
            else if (!invalidprefix) {
                await Linking.canOpenURL(WP_DEEP_LINK).then(
                    async () => {
                        await Linking.openURL(WP_DEEP_LINK + countryCode + phoneNumberValue)
                        await storeAsyncStorageData('LAST_USED_NUMBER', countryCode + phoneNumberValue)
                        loadLastPhoneNumber()
                    }
                ).catch(err => Alert.alert('WhatsApp Not installed'))
            }
        }
    }



    const openWhatsAppFromLastPhoneNumber = async () => {
        Linking.canOpenURL(WP_DEEP_LINK).then(whatsappInstalled => {
            Linking.openURL(WP_DEEP_LINK + lastUsedNumber)
        }).catch(err => Alert.alert('WhatsApp Not installed'))
    }
    async function loadLastPhoneNumber() {
        setLastUsedNumber(await getAsyncStorageData('LAST_USED_NUMBER'))
        setContactName(await getAsyncStorageData('LAST_USED_NAME'))
    }


    // const onButtonPress = () => {
    //     Alert.prompt(
    //         "Give a temporary Name",
    //         "This won't be saved to your contact list",
    //         [
    //             {
    //                 text: "Cancel",
    //                 onPress: () => console.log("Cancel Pressed"),
    //                 style: "cancel"
    //             },
    //             {
    //                 text: "SAVE",
    //                 onPress: (contactName) => setContactName(contactName)
    //             }
    //         ],
    //         "plain-text"
    //     );

    // };





    useEffect(() => {
        loadLastPhoneNumber()
        const colorScheme = Appearance.getColorScheme();
        if (colorScheme === 'dark') {
            setTitleColor('white')
        }
        if (colorScheme === 'light') {
            setTitleColor('black')
        }
    }, [])

    return (
        // <KeyboardAvoidingView
        //     style={{ flex: 1 }}
        //     behavior={Platform.OS === "ios" ? "padding" : "height"}
        // >
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
                translucent
                animated={true}
                //barStyle='light-content'
                backgroundColor='green'
                hidden={false} />
            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}      >
                <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10, color: `${titleColor}` }}>WhatsApp Unkown Dialer</Text>
                <Text style={{ marginHorizontal: 30, marginVertical: 20, fontSize: 14, color: 'gray' }}>{userMsg}</Text>


                <PhoneInput
                    ref={phoneInput}
                    defaultValue={phoneNumberValue}
                    defaultCode="IN"
                    layout="first"
                    onChangeText={(text) => {
                        setPhoneNumberValue(text)
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
                        <Text onPress={() => setIsModalVisible(true)} style={{ color: `${titleColor}`, fontWeight: 'bold', textAlign: 'left', fontSize: 16, paddingHorizontal: 10, paddingBottom: 6 }}>{contactName ? `${contactName}` : 'Click me to add name'}</Text>
                        <Text onPress={() => openWhatsAppFromLastPhoneNumber()} style={{ fontSize: 16, textAlign: 'left', color: 'black', paddingHorizontal: 10 }}>+{lastUsedNumber}</Text>

                    </TouchableOpacity>
                        : <Text>No past record found</Text>
                }

                <DialogInput isDialogVisible={isModalVisible}
                    title={"Give a temporary name"}
                    message={"This won't be saved to your contact list"}
                    hintInput={"e.g Jitu Nayak"}
                    submitInput={async (inputText) => {
                        await storeAsyncStorageData('LAST_USED_NAME', inputText)
                        setContactName(inputText);
                        setIsModalVisible(false);
                    }}
                    closeDialog={() => setIsModalVisible(false)}
                >
                </DialogInput>
            </ScrollView>
            <Text onPress={() => Linking.openURL('https://www.linkedin.com/in/jitu-nayak/')}
                style={{ fontStyle: 'italic', textDecorationLine: 'underline', textAlign: 'center', padding: 2, color: 'gray', fontSize: 10 }}>
                Developed by linkedin.com/in/jitu-nayak</Text>
        </SafeAreaView >
    );
};

export default DialerScreen;

