import React, { useState, useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import { getAsyncStorageData, storeAsyncStorageData } from './LocalStorageUtulity'

export default function HistoryScreen({ phoneNumber }) {

    const [listOfContacts, setlistOfContacts] = useState([])

    const updateTotalList = async = () => {
        storeAsyncStorageData('TOTAL', counter + "");
        console.log('stored ' + counter)
    }
    const addToContactHistory = async (phoneNumber) => {
        await storeAsyncStorageData(`key${counter}`, phoneNumber)
        const total = await getAsyncStorageData('TOTAL')
        const counter = parseInt(total) + 1;
        console.log(counter)
        await storeAsyncStorageData('TOTAL', counter.toString())
        let list = []
        for (let i = counter; i >= 1; i--) {
            const phone = await getAsyncStorageData(`key${i}`);
            list.push(phone);
            console.log(phone)
        }
        setlistOfContacts(list)
    }

    const clearAll = async () => {
        await storeAsyncStorageData('TOTAL', '0')
    }

    useEffect(() => {

        () => { addToContactHistory(phoneNumber) }
        return () => {

        }
    }, [phoneNumber])


    return (
        <View>
            <Button onPress={() => addToContactHistory("jitu")} title="Add">Add</Button>
            <Button onPress={clearAll} title="Clear"></Button>
            {
                listOfContacts.map((contact, index) => {
                    return (
                        <Text key={index}>{contact}</Text>
                    )
                })
            }
        </View>
    )
}
