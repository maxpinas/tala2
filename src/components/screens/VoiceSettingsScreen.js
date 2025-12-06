import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import speechService, { VOICE_OPTIONS } from '../../services/speechService';

const VoiceSettingsScreen = ({ currentVoiceId, onSave, onClose }) => {
  const [selectedVoice, setSelectedVoice] = useState(currentVoiceId || 'claire');
  const [isPlaying, setIsPlaying] = useState(null);

  const testPhrase = "Hallo, dit is een test van mijn stem.";

  useEffect(() => {
    // Stop spraak bij unmount
    return () => {
      speechService.stop();
    };
  }, []);

  const handleTestVoice = async (voiceId) => {
    setIsPlaying(voiceId);
    
    // Tijdelijk de stem instellen voor test
    speechService.setVoice(voiceId);
    
    await speechService.speak(testPhrase, {
      onDone: () => setIsPlaying(null),
      onStopped: () => setIsPlaying(null),
      onError: () => setIsPlaying(null),
    });
  };

  const handleSave = () => {
    speechService.setVoice(selectedVoice);
    onSave(selectedVoice);
  };

  const voiceList = Object.values(VOICE_OPTIONS).filter(v => v.provider === 'system');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Stem Kiezen</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Opslaan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Kies je stem</Text>
        <Text style={styles.description}>
          Deze stem wordt gebruikt als je op "Spreek" drukt of in Direct modus bent.
        </Text>

        {voiceList.map((voice) => (
          <TouchableOpacity
            key={voice.id}
            style={[
              styles.voiceCard,
              selectedVoice === voice.id && styles.voiceCardSelected,
            ]}
            onPress={() => setSelectedVoice(voice.id)}
          >
            <View style={styles.voiceInfo}>
              <View style={styles.voiceHeader}>
                <View style={[
                  styles.voiceIcon,
                  selectedVoice === voice.id && styles.voiceIconSelected
                ]}>
                  <Feather 
                    name={voice.id === 'claire' ? 'user' : 'user'} 
                    size={24} 
                    color={selectedVoice === voice.id ? '#000' : theme.text} 
                  />
                </View>
                <View style={styles.voiceText}>
                  <Text style={[
                    styles.voiceName,
                    selectedVoice === voice.id && styles.voiceNameSelected
                  ]}>
                    {voice.name}
                  </Text>
                  <Text style={styles.voiceDescription}>{voice.description}</Text>
                </View>
              </View>
              
              {selectedVoice === voice.id && (
                <Feather name="check-circle" size={24} color={theme.primary} />
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.testButton,
                isPlaying === voice.id && styles.testButtonPlaying
              ]}
              onPress={() => handleTestVoice(voice.id)}
            >
              <Feather 
                name={isPlaying === voice.id ? "volume-2" : "play"} 
                size={18} 
                color={isPlaying === voice.id ? theme.primary : theme.text} 
              />
              <Text style={[
                styles.testButtonText,
                isPlaying === voice.id && styles.testButtonTextPlaying
              ]}>
                {isPlaying === voice.id ? "Speelt..." : "Test"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={styles.futureSection}>
          <Text style={styles.futureSectionTitle}>🔮 Binnenkort beschikbaar</Text>
          <Text style={styles.futureSectionText}>
            • Google Cloud TTS (WaveNet stemmen){'\n'}
            • ElevenLabs (Ultra-realistische stemmen){'\n'}
            • Eigen stem klonen
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a2e',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  saveButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: theme.textDim,
    marginBottom: 24,
    lineHeight: 20,
  },
  voiceCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  voiceCardSelected: {
    borderColor: theme.primary,
    backgroundColor: theme.primary + '15',
  },
  voiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  voiceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  voiceIconSelected: {
    backgroundColor: theme.primary,
  },
  voiceText: {
    flex: 1,
  },
  voiceName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
  voiceNameSelected: {
    color: theme.primary,
  },
  voiceDescription: {
    fontSize: 13,
    color: theme.textDim,
    marginTop: 2,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surfaceHighlight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  testButtonPlaying: {
    backgroundColor: theme.primary + '30',
  },
  testButtonText: {
    fontSize: 14,
    color: theme.text,
    marginLeft: 6,
    fontWeight: '500',
  },
  testButtonTextPlaying: {
    color: theme.primary,
  },
  futureSection: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: 'dashed',
  },
  futureSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textDim,
    marginBottom: 8,
  },
  futureSectionText: {
    fontSize: 13,
    color: theme.textDim,
    lineHeight: 22,
  },
});

export default VoiceSettingsScreen;
