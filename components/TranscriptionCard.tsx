
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import { TranscriptionRecord } from '../types';

interface TranscriptionCardProps {
  transcription: TranscriptionRecord;
  onDelete: (id: string) => void;
}

export default function TranscriptionCard({ transcription, onDelete }: TranscriptionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transcription',
      'Are you sure you want to delete this transcription?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(transcription.id) },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: transcription.transcription,
        title: 'Voice Transcription',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getStatusColor = () => {
    switch (transcription.status) {
      case 'completed': return colors.accent;
      case 'pending': return colors.warning;
      case 'error': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (transcription.status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Processing...';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const truncatedText = transcription.transcription.length > 100 
    ? transcription.transcription.substring(0, 100) + '...'
    : transcription.transcription;

  return (
    <View style={commonStyles.card}>
      <View style={commonStyles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
            {formatDate(transcription.timestamp)} • {formatDuration(transcription.duration)}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: getStatusColor(),
              marginRight: 6,
            }} />
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {transcription.status === 'completed' && (
            <TouchableOpacity
              onPress={handleShare}
              style={{ padding: 8, marginRight: 4 }}
            >
              <Ionicons name="share-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={handleDelete}
            style={{ padding: 8 }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={{ marginTop: 12 }}
      >
        <Text style={[commonStyles.text, { lineHeight: 22 }]}>
          {isExpanded ? transcription.transcription : truncatedText}
        </Text>
        
        {transcription.transcription.length > 100 && (
          <Text style={[commonStyles.textSecondary, { marginTop: 8, fontSize: 14 }]}>
            {isExpanded ? 'Show less' : 'Show more'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
