import { View, Text } from 'react-native'
import React from 'react'
import RotatingBallsLoader from "./LoadingIndicater";

export default function LoadingPage() {
  return (
    <View className="flex   z-30 absolute w-screen h-screen flex-1 flex-col  items-center justify-center">
    <View className='absolute w-screen h-screen bg-black opacity-50'></View>
      <RotatingBallsLoader />
    </View>
  )
}