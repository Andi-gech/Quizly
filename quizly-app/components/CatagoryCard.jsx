import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

import { LinearGradient } from 'expo-linear-gradient';

export default function CatagoryCard({ icon, name, onpress }) {
  return (
    <View
    
      
      className="m-2"
    >
      <TouchableOpacity 
        onPress={onpress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          className="w-28 h-28 items-center justify-center rounded-2xl border border-slate-700/50"
          style={{ padding: 2 ,height:100,width:120,margin:10,
            borderRadius: 10,
          }}
        >
          <View className="items-center justify-center space-y-3 p-2">
            <View className="bg-slate-800/40 p-3 rounded-full">
              {React.cloneElement(icon, { 
                size: 28, 
                color: '#f59e0b' 
              })}
            </View>
            <Text 
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-white  text-xs font-bold text-center"
              style={{ 
                textShadowColor: 'rgba(0,0,0,0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
                width: 80 // Fixed width for text container
              }}
            >
              {name}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}