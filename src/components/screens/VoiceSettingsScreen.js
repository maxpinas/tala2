import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useTheme } from '../../theme';
import speechService from '../../services/speechService';

const VoiceSettingsScreen = ({ currentVoiceId, onSave, onClose, onSaveAndClose }) => {
  const { theme } = useTheme();
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
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
          paddingTop: 60,
          backgroundColor: theme.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}>
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
            <Feather name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>Stem Kiezen</Text>
          <TouchableOpacity onPress={handleSave} style={{
            backgroundColor: theme.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}>
            <Text style={{ color: '#000', fontWeight: '600', fontSize: 14 }}>Opslaan</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>Kies je stem</Text>
          <Text style={{ fontSize: 14, color: theme.textDim, marginBottom: 24, lineHeight: 20 }}>
            {availableVoices.length} Nederlandse stemmen gevonden op dit apparaat.
          </Text>

          {loading ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={{ color: theme.textDim, marginTop: 12, fontSize: 14 }}>Stemmen laden...</Text>
            </View>
          ) : availableVoices.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
              <Feather name="alert-circle" size={48} color={theme.textDim} />
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600', marginTop: 12 }}>Geen Nederlandse stemmen gevonden</Text>
              <Text style={{ color: theme.textDim, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
                Ga naar Instellingen → Toegankelijkheid → Gesproken inhoud → Stemmen → Nederlands om stemmen te downloaden.
              </Text>
            </View>
          ) : (
            availableVoices.map((voice) => (
              <TouchableOpacity
                key={voice.identifier}
                style={[
                  {
                    backgroundColor: theme.surface,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 2,
                    borderColor: 'transparent',
                  },
                  selectedVoice === voice.identifier && {
                    borderColor: theme.primary,
                    backgroundColor: theme.primary + '15',
                  },
                ]}
                onPress={() => setSelectedVoice(voice.identifier)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={[
                      {
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: theme.surfaceHighlight,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                      },
                      selectedVoice === voice.identifier && { backgroundColor: theme.primary }
                    ]}>
                      <Feather 
                        name="user" 
                        size={24} 
                        color={selectedVoice === voice.identifier ? '#000' : theme.text} 
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[
                        { fontSize: 18, fontWeight: '600', color: theme.text },
                        selectedVoice === voice.identifier && { color: theme.primary }
                      ]}>
                        {voice.name}
                      </Text>
                      <Text style={{ fontSize: 13, color: theme.textDim, marginTop: 2 }}>{getQualityLabel(voice)}</Text>
                    </View>
                  </View>
                  
                  {selectedVoice === voice.identifier && (
                    <Feather name="check-circle" size={24} color={theme.primary} />
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.surfaceHighlight,
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                    },
                    isPlaying === voice.identifier && { backgroundColor: theme.primary + '30' }
                  ]}
                  onPress={() => handleTestVoice(voice.identifier)}
                >
                  <Feather 
                    name={isPlaying === voice.identifier ? "volume-2" : "play"} 
                    size={18} 
                    color={isPlaying === voice.identifier ? theme.primary : theme.text} 
                  />
                  <Text style={[
                    { fontSize: 14, color: theme.text, marginLeft: 6, fontWeight: '500' },
                    isPlaying === voice.identifier && { color: theme.primary }
                  ]}>
                    {isPlaying === voice.identifier ? "Speelt..." : "Test"}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}

          <View style={{
            backgroundColor: theme.surface,
            borderRadius: 16,
            padding: 16,
            marginTop: 24,
            marginBottom: 40,
            borderWidth: 1,
            borderColor: theme.border,
            borderStyle: 'dashed',
          }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.textDim, marginBottom: 8 }}>🔮 Binnenkort beschikbaar</Text>
            <Text style={{ fontSize: 13, color: theme.textDim, lineHeight: 22 }}>
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

export default VoiceSettingsScreen;
