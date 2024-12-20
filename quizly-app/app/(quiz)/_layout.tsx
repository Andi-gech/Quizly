import React from 'react'
import { Stack } from "expo-router";

export default function _layout() {
  return (
     <Stack initialRouteName='Starter'>
 
     
           <Stack.Screen name='[id]' options={{headerShown: false,
            animation:"slide_from_left"
           }}  />
           <Stack.Screen name="Starter"  options={{headerShown: false}} />
            <Stack.Screen name="score" options={{headerShown: false}} />
            

      
         </Stack>
  )
}