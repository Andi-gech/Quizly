import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function TransparentBanner( {children} ) {
  return (
    <View  className={ `w-[100%] rounded-md h-[200px] bg-[rgba(255,255,255,0.1)]  py-[10px] flex item-center justify-center ` }>
 {children}
    </View>
  )
}

