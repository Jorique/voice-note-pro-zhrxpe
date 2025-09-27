
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { AppSettings } from '../types';
import SimpleBottomSheet from './BottomSheet';

interface SettingsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export default function SettingsBottomSheet({ 
  isVisible, 
  onClose, 
  settings, 
  onSave 
}: SettingsBottomSheetProps) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter your OpenAI API key.');
      return;
    }

    onSave({
      ...settings,
      apiKey: apiKey.trim(),
    });
    onClose();
  };

  const maskedApiKey = apiKey ? `sk-...${apiKey.slice(-4)}` : '';

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <View style={[commonStyles.row, { marginBottom: 24 }]}>
            <Text style={commonStyles.title}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 8 }]}>
              OpenAI API Key
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>
              Required for voice transcription using OpenAI Whisper
            </Text>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              paddingHorizontal: 16,
              backgroundColor: colors.backgroundAlt,
            }}>
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  fontSize: 16,
                  color: colors.text,
                }}
                value={showApiKey ? apiKey : maskedApiKey}
                onChangeText={setApiKey}
                placeholder="sk-..."
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showApiKey && apiKey.length > 0}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowApiKey(!showApiKey)}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={showApiKey ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 8 }]}>
              How to get API Key
            </Text>
            <Text style={[commonStyles.textSecondary, { lineHeight: 20 }]}>
              1. Go to platform.openai.com{'\n'}
              2. Sign in to your account{'\n'}
              3. Navigate to API Keys section{'\n'}
              4. Create a new secret key{'\n'}
              5. Copy and paste it here
            </Text>
          </View>

          <TouchableOpacity
            style={[buttonStyles.primary, { marginBottom: 16 }]}
            onPress={handleSave}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Save Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={buttonStyles.secondary}
            onPress={onClose}
          >
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SimpleBottomSheet>
  );
}
