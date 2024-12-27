import React from 'react'
import { Stack } from "expo-router";

export default function _layout() {
  return (
     <Stack >
 
     
           <Stack.Screen name='login' options={{headerShown: false,
            animation:"slide_from_left"
           }}  />
            <Stack.Screen name='Signup' options={{headerShown: false,
              animation:"slide_from_left"
            }}  />
         
         </Stack>
  )
}