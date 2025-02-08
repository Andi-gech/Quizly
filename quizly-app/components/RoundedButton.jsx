import { TouchableOpacity, Text, View } from 'react-native';

export default function RoundedButton({
  radius = 'rounded-lg',
  color = 'text-white',
  bgcolor = 'bg-slate-700',
  name,
  onPress,
  leftIcon,
  rightIcon,
  border = 'border-0',
  padding = 'px-4 py-3',
  customStyle,
  textWrap = false
}) {
  return (
    <View
   
      transition={{ type: 'timing' }}
    >
      <TouchableOpacity
        className={`flex-row items-center justify-center ${padding} ${border} ${radius} ${bgcolor} ${color}`}
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          {
            shadowColor: '#f59e0b',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3
          },
          customStyle
        ]}
      >
        {leftIcon && (
         leftIcon
        )}
        
        <Text 
          className={`${color} font-semibold text-base ${textWrap ? 'flex-wrap' : 'flex-shrink'}`}
          numberOfLines={2}
        >
          {name}
        </Text>

        {rightIcon && (
         rightIcon
        )}
      </TouchableOpacity>
    </View>
  );
}