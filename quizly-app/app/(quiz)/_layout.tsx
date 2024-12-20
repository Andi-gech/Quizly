import React from 'react'
import { Stack } from "expo-router";

export default function _layout() {
  return (
     <Stack>
           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
           <Stack.Screen name="(quiz)" options={{headerShown: false}} />
           <Stack.Screen name='[id]' options={{headerShown: false,
            animation:"slide_from_left"
           }}  />
              <Stack.Screen name="+not-found" />


      
         </Stack>
  )
}