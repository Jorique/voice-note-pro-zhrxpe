
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useAudioRecording } from '../hooks/useAudioRecording';
import { useTranscription } from '../hooks/useTranscription';
import { useStorage } from '../hooks/useStorage';
import RecordButton from '../components/RecordButton';
import TranscriptionCard from '../components/TranscriptionCard';
import SettingsBottomSheet from '../components/SettingsBottomSheet';
import { TranscriptionRecord } from '../types';
import { router } from 'expo-router';

export default function MainScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [currentRecordingUri, setCurrentRecordingUri] = useState<string | null>(null);
  
  const { 
    isRecording, 
    recordingDuration, 
    startRecording, 
    stopRecording, 
    formatDuration 
  } = useAudioRecording();
  
  const { isTranscribing, transcribeAudio } = useTranscription();
  const { 
    transcriptions, 
    settings, 
    isLoading, 
    saveTranscription, 
    updateTranscription, 
    deleteTranscription, 
    saveSettings 
  } = useStorage();

  const handleRecordPress = async () => {
    if (isRecording) {
      // Stop recording
      const uri = await stopRecording();
      if (uri) {
        setCurrentRecordingUri(uri);
        await handleTranscribe(uri);
      }
    } else {
      // Start recording
      if (!settings.apiKey.trim()) {
        Alert.alert(
          'API Key Required',
          'Please set your OpenAI API key in settings before recording.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => setShowSettings(true) },
          ]
        );
        return;
      }
      
      const uri = await startRecording();
      if (uri) {
        setCurrentRecordingUri(uri);
      }
    }
  };

  const handleTranscribe = async (audioUri: string) => {
    // Create a pending transcription record
    const transcriptionRecord: TranscriptionRecord = {
      id: Date.now().toString(),
      audioUri,
      transcription: '',
      timestamp: Date.now(),
      duration: recordingDuration,
      status: 'pending',
    };

    await saveTranscription(transcriptionRecord);

    // Start transcription
    const transcriptionText = await transcribeAudio(audioUri, settings.apiKey);
    
    if (transcriptionText) {
      await updateTranscription(transcriptionRecord.id, {
        transcription: transcriptionText,
        status: 'completed',
      });
    } else {
      await updateTranscription(transcriptionRecord.id, {
        transcription: 'Transcription failed',
        status: 'error',
      });
    }
  };

  const recentTranscriptions = transcriptions.slice(0, 3);

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.text}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[commonStyles.row, { marginBottom: 32 }]}>
          <Text style={commonStyles.title}>Voice Transcriber</Text>
          <TouchableOpacity
            onPress={() => setShowSettings(true)}
            style={{ padding: 8 }}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Recording Section */}
        <View style={[commonStyles.centerContent, { marginBottom: 40 }]}>
          <RecordButton
            isRecording={isRecording}
            onPress={handleRecordPress}
            duration={isRecording ? formatDuration(recordingDuration) : undefined}
          />
          
          {isTranscribing && (
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                Transcribing audio...
              </Text>
              <View style={{
                width: 200,
                height: 4,
                backgroundColor: colors.backgroundAlt,
                borderRadius: 2,
                overflow: 'hidden',
              }}>
                <View style={{
                  width: '60%',
                  height: '100%',
                  backgroundColor: colors.primary,
                  borderRadius: 2,
                }} />
              </View>
            </View>
          )}
        </View>

        {/* Recent Transcriptions */}
        {recentTranscriptions.length > 0 && (
          <View style={{ marginBottom: 32 }}>
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <Text style={commonStyles.subtitle}>Recent Transcriptions</Text>
              <TouchableOpacity
                onPress={() => router.push('/history')}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={[commonStyles.textSecondary, { marginRight: 4 }]}>
                  View All
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {recentTranscriptions.map((transcription) => (
              <TranscriptionCard
                key={transcription.id}
                transcription={transcription}
                onDelete={deleteTranscription}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {transcriptions.length === 0 && (
          <View style={[commonStyles.centerContent, { marginTop: 40 }]}>
            <Ionicons name="mic-outline" size={64} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
              No transcriptions yet
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
              Tap the record button to start your first transcription
            </Text>
          </View>
        )}
      </ScrollView>

      <SettingsBottomSheet
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={saveSettings}
      />
    </SafeAreaView>
  );
}
