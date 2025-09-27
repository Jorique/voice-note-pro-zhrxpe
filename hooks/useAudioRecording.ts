
import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async (): Promise<string | null> => {
    try {
      console.log('Requesting permissions...');
      const { status } = await Audio.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to record audio.');
        return null;
      }

      console.log('Setting audio mode...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      return recording.getURI();
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
      return null;
    }
  };

  const stopRecording = async (): Promise<string | null> => {
    try {
      if (!recordingRef.current) {
        console.log('No recording to stop');
        return null;
      }

      console.log('Stopping recording...');
      await recordingRef.current.stopAndUnloadAsync();
      
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      // Clear duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      console.log('Recording stopped, URI:', uri);
      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording.');
      return null;
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    formatDuration,
  };
};
