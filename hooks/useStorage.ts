
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TranscriptionRecord, AppSettings } from '../types';

const TRANSCRIPTIONS_KEY = 'transcriptions';
const SETTINGS_KEY = 'settings';

export const useStorage = () => {
  const [transcriptions, setTranscriptions] = useState<TranscriptionRecord[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    apiProvider: 'openai',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading data from storage...');
      
      // Load transcriptions
      const transcriptionsData = await AsyncStorage.getItem(TRANSCRIPTIONS_KEY);
      if (transcriptionsData) {
        const parsed = JSON.parse(transcriptionsData);
        setTranscriptions(parsed);
        console.log('Loaded transcriptions:', parsed.length);
      }

      // Load settings
      const settingsData = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settingsData) {
        const parsed = JSON.parse(settingsData);
        setSettings(parsed);
        console.log('Loaded settings');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTranscription = async (transcription: TranscriptionRecord) => {
    try {
      const updated = [transcription, ...transcriptions];
      setTranscriptions(updated);
      await AsyncStorage.setItem(TRANSCRIPTIONS_KEY, JSON.stringify(updated));
      console.log('Saved transcription:', transcription.id);
    } catch (error) {
      console.error('Error saving transcription:', error);
    }
  };

  const updateTranscription = async (id: string, updates: Partial<TranscriptionRecord>) => {
    try {
      const updated = transcriptions.map(t => 
        t.id === id ? { ...t, ...updates } : t
      );
      setTranscriptions(updated);
      await AsyncStorage.setItem(TRANSCRIPTIONS_KEY, JSON.stringify(updated));
      console.log('Updated transcription:', id);
    } catch (error) {
      console.error('Error updating transcription:', error);
    }
  };

  const deleteTranscription = async (id: string) => {
    try {
      const updated = transcriptions.filter(t => t.id !== id);
      setTranscriptions(updated);
      await AsyncStorage.setItem(TRANSCRIPTIONS_KEY, JSON.stringify(updated));
      console.log('Deleted transcription:', id);
    } catch (error) {
      console.error('Error deleting transcription:', error);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      console.log('Saved settings');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return {
    transcriptions,
    settings,
    isLoading,
    saveTranscription,
    updateTranscription,
    deleteTranscription,
    saveSettings,
  };
};
