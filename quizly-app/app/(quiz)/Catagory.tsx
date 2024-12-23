import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function Catagory() {
    const {id}=useLocalSearchParams()
  return (
    <View>
      <Text>Catagory</Text>
    </View>
  )
}

const styles = StyleSheet.create({})