import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function TextButtons({name,customstyles,onPress}) {
  return (
    <TouchableOpacity onPress={onPress} className={`px-[10px] py-[5px] ${customstyles}`}>
      <Text>{name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})