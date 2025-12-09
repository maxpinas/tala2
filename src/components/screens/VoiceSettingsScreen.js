import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { theme } from '../../theme';
import speechService from '../../services/speechService';

const VoiceSettingsScreen = ({ currentVoiceId, onSave, onClose, onSaveAndClose }) => {
  const [selectedVoice, setSelectedVoice] = useState(currentVoiceId || null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const testPhrase = "Hallo, dit is een test van mijn stem.";

  useEffect(() => {
    // Haal alle beschikbare stemmen op
    const loadVoices = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        // Filter alleen Nederlandse stemmen
        const dutchVoices = voices.filter(v => v.language === 'nl-NL');
        // Sorteer: Enhanced eerst, dan alfabetisch
        dutchVoices.sort((a, b) => {
          const aEnhanced = a.quality === 'Enhanced' || a.name.includes('Enhanced');
          const bEnhanced = b.quality === 'Enhanced' || b.name.includes('Enhanced');
          if (aEnhanced && !bEnhanced) return -1;
          if (!aEnhanced && bEnhanced) return 1;
          return a.name.localeCompare(b.name);
        });
        setAvailableVoices(dutchVoices);
        
        // Als er nog geen stem geselecteerd is, kies de eerste
        if (!selectedVoice && dutchVoices.length > 0) {
          setSelectedVoice(dutchVoices[0].identifier);
        }
      } catch (error) {
        console.log('Error loading voices:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadVoices();
    
    // Stop spraak bij unmount
    return () => {
      speechService.stop();
    };
  }, []);

  const handleTestVoice = async (voiceIdentifier) => {
    setIsPlaying(voiceIdentifier);
    
    // Direct spreken met de identifier
    Speech.speak(testPhrase, {
      voice: voiceIdentifier,
      language: 'nl-NL',
      onDone: () => setIsPlaying(null),
      onStopped: () => setIsPlaying(null),
      onError: () => setIsPlaying(null),
    });
  };

  const handleSave = () => {
    // Vind de stem info
    const voice = availableVoices.find(v => v.identifier === selectedVoice);
    if (voice) {
      speechService.setVoiceByIdentifier(selectedVoice, voice.name);
    }
    onSave(selectedVoice);
    // Gebruik onSaveAndClose als die beschikbaar is, anders onClose
    if (onSaveAndClose) {
      onSaveAndClose();
    } else {
      onClose();
    }
  };

  // Helper om kwaliteit label te krijgen
  const getQualityLabel = (voice) => {
    if (voice.quality === 'Enhanced' || voice.name.includes('Enhanced')) return '⭐ Premium';
    if (voice.quality === 'Premium') return '⭐ Premium';
    return 'Standaard';
  };

  return (
    <Modal visible animationType="slide">
      <View style={styles.fullScreen}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Stem Kiezen</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Opslaan</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Kies je stem</Text>
          <Text style={styles.description}>
            {availableVoices.length} Nederlandse stemmen gevonden op dit apparaat.
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={styles.loadingText}>Stemmen laden...</Text>
            </View>
          ) : availableVoices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="alert-circle" size={48} color={theme.textDim} />
              <Text style={styles.emptyText}>Geen Nederlandse stemmen gevonden</Text>
              <Text style={styles.emptySubtext}>
                Ga naar Instellingen → Toegankelijkheid → Gesproken inhoud → Stemmen → Nederlands om stemmen te downloaden.
              </Text>
            </View>
          ) : (
            availableVoices.map((voice) => (
              <TouchableOpacity
                key={voice.identifier}
                style={[
                  styles.voiceCard,
                  selectedVoice === voice.identifier && styles.voiceCardSelected,
                ]}
                onPress={() => setSelectedVoice(voice.identifier)}
              >
                <View style={styles.voiceInfo}>
                  <View style={styles.voiceHeader}>
                    <View style={[
                      styles.voiceIcon,
                      selectedVoice === voice.identifier && styles.voiceIconSelected
                    ]}>
                      <Feather 
                        name="user" 
                        size={24} 
                        color={selectedVoice === voice.identifier ? '#000' : theme.text} 
                      />
                    </View>
                    <View style={styles.voiceText}>
                      <Text style={[
                        styles.voiceName,
                        selectedVoice === voice.identifier && styles.voiceNameSelected
                      ]}>
                        {voice.name}
                      </Text>
                      <Text style={styles.voiceDescription}>{getQualityLabel(voice)}</Text>
                    </View>
                  </View>
                  
                  {selectedVoice === voice.identifier && (
                    <Feather name="check-circle" size={24} color={theme.primary} />
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.testButton,
                    isPlaying === voice.identifier && styles.testButtonPlaying
                  ]}
                  onPress={() => handleTestVoice(voice.identifier)}
                >
                  <Feather 
                    name={isPlaying === voice.identifier ? "volume-2" : "play"} 
                    size={18} 
                    color={isPlaying === voice.identifier ? theme.primary : theme.text} 
                  />
                  <Text style={[
                    styles.testButtonText,
                    isPlaying === voice.identifier && styles.testButtonTextPlaying
                  ]}>
                    {isPlaying === voice.identifier ? "Speelt..." : "Test"}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}

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
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: theme.bg,
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: theme.textDim,
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    color: theme.textDim,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
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
