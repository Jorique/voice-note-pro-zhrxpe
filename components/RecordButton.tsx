
import React from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, buttonStyles } from '../styles/commonStyles';

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
  duration?: string;
}

export default function RecordButton({ isRecording, onPress, duration }: RecordButtonProps) {
  const scaleValue = new Animated.Value(1);

  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleValue.setValue(1);
    }
  }, [isRecording]);

  return (
    <View style={{ alignItems: 'center' }}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          style={[
            buttonStyles.record,
            isRecording && buttonStyles.recordActive,
          ]}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isRecording ? 'stop' : 'mic'}
            size={48}
            color="white"
          />
        </TouchableOpacity>
      </Animated.View>
      
      {duration && (
        <Text style={{
          marginTop: 16,
          fontSize: 18,
          fontWeight: '600',
          color: colors.text,
        }}>
          {duration}
        </Text>
      )}
      
      <Text style={{
        marginTop: 8,
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
      }}>
        {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
      </Text>
    </View>
  );
}
