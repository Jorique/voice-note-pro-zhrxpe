import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useStorage } from '../hooks/useStorage';
import TranscriptionCard from '../components/TranscriptionCard';

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { transcriptions, deleteTranscription, isLoading } = useStorage();

  const filteredTranscriptions = searchQuery.trim()
    ? transcriptions.filter(transcription =>
        transcription.transcription.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transcriptions;

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
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 8, marginLeft: -8 }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { flex: 1, textAlign: 'center', marginRight: 32 }]}>
            History
          </Text>
        </View>

        {/* Search */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: 16,
          backgroundColor: colors.backgroundAlt,
          marginBottom: 24,
        }}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 12,
              fontSize: 16,
              color: colors.text,
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search transcriptions..."
            placeholderTextColor={colors.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={{ padding: 4 }}
            >
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Results Count */}
        <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
          {filteredTranscriptions.length} transcription{filteredTranscriptions.length !== 1 ? 's' : ''}
          {searchQuery ? ` found for "${searchQuery}"` : ''}
        </Text>

        {/* Transcriptions List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredTranscriptions.length > 0 ? (
            filteredTranscriptions.map((transcription) => (
              <TranscriptionCard
                key={transcription.id}
                transcription={transcription}
                onDelete={deleteTranscription}
              />
            ))
          ) : (
            <View style={[commonStyles.centerContent, { marginTop: 60 }]}>
              <Ionicons 
                name={searchQuery ? "search" : "document-text-outline"} 
                size={64} 
                color={colors.textSecondary} 
              />
              <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
                {searchQuery ? 'No transcriptions found' : 'No transcriptions yet'}
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                {searchQuery 
                  ? 'Try a different search term' 
                  : 'Start recording to create your first transcription'
                }
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
