import React from 'react'
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';

export default function _layout() {
  return (
     <Stack >
 <StatusBar style="light" />
     
           <Stack.Screen name='login' options={{headerShown: false,
            animation:"slide_from_left"
           }}  />
            <Stack.Screen name='Signup' options={{headerShown: false,
              animation:"slide_from_left"
            }}  />
            <Stack.Screen name='Verification' options={{headerShown: false,
              animation:"slide_from_left"
            }}  />
         
         </Stack>
  )
}