
import { useState } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

export const useTranscription = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);

  const transcribeAudio = async (audioUri: string, apiKey: string): Promise<string | null> => {
    if (!apiKey.trim()) {
      Alert.alert('API Key Required', 'Please set your OpenAI API key in settings.');
      return null;
    }

    setIsTranscribing(true);
    
    try {
      console.log('Starting transcription for:', audioUri);
      
      // Read the audio file
      const audioInfo = await FileSystem.getInfoAsync(audioUri);
      if (!audioInfo.exists) {
        throw new Error('Audio file not found');
      }

      // Create form data for OpenAI Whisper API
      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);
      formData.append('model', 'whisper-1');
      formData.append('language', 'ru'); // Russian language

      console.log('Sending request to OpenAI...');
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API error:', errorData);
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Transcription result:', result);
      
      return result.text || 'No transcription available';
    } catch (error) {
      console.error('Transcription error:', error);
      Alert.alert('Transcription Error', 'Failed to transcribe audio. Please check your API key and try again.');
      return null;
    } finally {
      setIsTranscribing(false);
    }
  };

  return {
    isTranscribing,
    transcribeAudio,
  };
};
