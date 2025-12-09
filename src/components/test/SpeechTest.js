import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Modal, SafeAreaView } from 'react-native';
import * as Speech from 'expo-speech';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';

const SpeechTest = ({ onClose }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [dutchVoices, setDutchVoices] = useState([]);
  const [allVoicesExpanded, setAllVoicesExpanded] = useState(false);
  const [currentTestVoice, setCurrentTestVoice] = useState(null);

  // Test zin voor stem vergelijking
  const testPhrase = "Hallo, ik heb afasie. Ik begrijp alles, maar spreken is moeilijk voor mij.";
  
  // Test zinnen
  const testSentences = [
    "Hallo, ik ben een test.",
    "Ik heb hulp nodig.",
    "Kunt u dat herhalen?",
    "Ja, dat klopt.",
    "Nee, dat is niet goed.",
    "Ik heb afasie. Ik begrijp alles, maar spreken is moeilijk voor mij.",
  ];

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    const availableVoices = await Speech.getAvailableVoicesAsync();
    setVoices(availableVoices);
    
    // Filter Nederlandse stemmen (nl-NL alleen, geen Belgisch nl-BE)
    const dutch = availableVoices.filter(v => {
      const lang = v.language || '';
      const name = (v.name || '').toLowerCase();
      
      // Exclusief Belgisch Nederlands (nl-BE)
      if (lang === 'nl-BE' || name.includes('ellen')) return false;
      
      // Alleen Nederlands (Nederland)
      return lang === 'nl-NL' || 
             lang.startsWith('nl-NL') ||
             name.includes('xander') ||
             name.includes('claire');
    });
    
    // Sorteer op kwaliteit (enhanced/premium eerst)
    const sortedDutch = dutch.sort((a, b) => {
      const aQuality = getVoiceQuality(a);
      const bQuality = getVoiceQuality(b);
      return bQuality - aQuality;
    });
    
    setDutchVoices(sortedDutch);
    
    // Selecteer beste Nederlandse stem (voorkeur: Claire of Xander Enhanced)
    if (sortedDutch.length > 0) {
      // Zoek eerst naar Claire Enhanced (vrouwelijke stem)
      const claire = sortedDutch.find(v => 
        v.name?.toLowerCase().includes('claire') && 
        (v.quality === 'Enhanced' || v.identifier?.includes('enhanced'))
      );
      // Dan Xander Enhanced (mannelijke stem)
      const xander = sortedDutch.find(v => 
        v.name?.toLowerCase().includes('xander') && 
        (v.quality === 'Enhanced' || v.identifier?.includes('enhanced'))
      );
      
      setSelectedVoice(claire || xander || sortedDutch[0]);
    }
    
    console.log('Alle stemmen:', availableVoices.length);
    console.log('Nederlandse stemmen (nl-NL):', sortedDutch);
  };

  // Bepaal stem kwaliteit (hoger = beter)
  const getVoiceQuality = (voice) => {
    const name = (voice.name || '').toLowerCase();
    const id = (voice.identifier || '').toLowerCase();
    
    // iOS Enhanced stemmen (beste kwaliteit)
    if (voice.quality === 'Enhanced') return 100;
    if (id.includes('enhanced')) return 95;
    if (name.includes('premium') || name.includes('enhanced')) return 90;
    
    // Siri stemmen
    if (name.includes('siri')) return 85;
    
    // Compact stemmen (laagste kwaliteit)
    if (id.includes('compact') || id.includes('super-compact')) return 20;
    
    // Android
    if (name.includes('neural') || name.includes('wavenet')) return 95;
    if (name.includes('standard')) return 50;
    
    // Default kwaliteit
    if (voice.quality === 'Default') return 40;
    
    return 50; // default
  };

  const getQualityLabel = (voice) => {
    const quality = getVoiceQuality(voice);
    if (quality >= 90) return '⭐⭐⭐ Premium';
    if (quality >= 70) return '⭐⭐ Enhanced';
    if (quality >= 40) return '⭐ Standard';
    return 'Basic';
  };

  const speak = async (text, voiceOverride = null) => {
    await Speech.stop();
    setIsSpeaking(true);
    
    const voiceToUse = voiceOverride || selectedVoice;
    setCurrentTestVoice(voiceToUse);
    
    const options = {
      language: 'nl-NL',
      pitch: 1.0,
      rate: 0.9,
      onStart: () => setIsSpeaking(true),
      onDone: () => { setIsSpeaking(false); setCurrentTestVoice(null); },
      onStopped: () => { setIsSpeaking(false); setCurrentTestVoice(null); },
      onError: (error) => {
        console.log('Speech error:', error);
        setIsSpeaking(false);
        setCurrentTestVoice(null);
      },
    };

    if (voiceToUse?.identifier) {
      options.voice = voiceToUse.identifier;
    }

    Speech.speak(text, options);
  };

  const testVoice = async (voice) => {
    await speak(testPhrase, voice);
  };

  const stopSpeaking = async () => {
    await Speech.stop();
    setIsSpeaking(false);
    setCurrentTestVoice(null);
  };

  return (
    <Modal visible animationType="slide">
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔊 Spraak Test</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Feather name="x" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status */}
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={[styles.statusValue, isSpeaking && styles.speakingStatus]}>
            {isSpeaking ? '🔊 Aan het spreken...' : '🔇 Stil'}
          </Text>
        </View>

        {/* Voice info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Stemmen gevonden:</Text>
          <Text style={styles.infoText}>Totaal: {voices.length}</Text>
          <Text style={styles.infoText}>Nederlands: {dutchVoices.length}</Text>
          {selectedVoice && (
            <Text style={styles.infoText}>
              Actief: {selectedVoice.name || selectedVoice.identifier}
            </Text>
          )}
        </View>

        {/* Nederlandse stemmen lijst */}
        {dutchVoices.length > 0 && (
          <View style={styles.voicesBox}>
            <Text style={styles.sectionTitle}>🇳🇱 Nederlandse stemmen ({dutchVoices.length}):</Text>
            <Text style={styles.tipText}>Tik op ▶️ om een stem te testen</Text>
            {dutchVoices.map((voice, index) => (
              <View 
                key={index}
                style={[
                  styles.voiceOption,
                  selectedVoice?.identifier === voice.identifier && styles.voiceSelected,
                  currentTestVoice?.identifier === voice.identifier && styles.voicePlaying
                ]}
              >
                <TouchableOpacity 
                  style={styles.voiceInfo}
                  onPress={() => setSelectedVoice(voice)}
                >
                  <Text style={styles.voiceName}>
                    {voice.name || voice.identifier}
                  </Text>
                  <Text style={styles.voiceQuality}>{getQualityLabel(voice)}</Text>
                  <Text style={styles.voiceLang}>{voice.language}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => testVoice(voice)}
                  disabled={isSpeaking}
                >
                  <Feather 
                    name={currentTestVoice?.identifier === voice.identifier ? "volume-2" : "play"} 
                    size={20} 
                    color={currentTestVoice?.identifier === voice.identifier ? theme.primary : theme.text} 
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Alle stemmen (uitklapbaar) */}
        <TouchableOpacity 
          style={styles.expandButton}
          onPress={() => setAllVoicesExpanded(!allVoicesExpanded)}
        >
          <Text style={styles.expandButtonText}>
            {allVoicesExpanded ? '▼' : '▶'} Alle stemmen bekijken ({voices.length})
          </Text>
        </TouchableOpacity>
        
        {allVoicesExpanded && (
          <View style={styles.voicesBox}>
            <Text style={styles.tipText}>Andere talen kunnen ook Nederlands proberen te spreken</Text>
            {voices.filter(v => !dutchVoices.includes(v)).slice(0, 20).map((voice, index) => (
              <View 
                key={index}
                style={[
                  styles.voiceOption,
                  currentTestVoice?.identifier === voice.identifier && styles.voicePlaying
                ]}
              >
                <View style={styles.voiceInfo}>
                  <Text style={styles.voiceName}>
                    {voice.name || voice.identifier}
                  </Text>
                  <Text style={styles.voiceLang}>{voice.language}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => testVoice(voice)}
                  disabled={isSpeaking}
                >
                  <Feather 
                    name={currentTestVoice?.identifier === voice.identifier ? "volume-2" : "play"} 
                    size={20} 
                    color={currentTestVoice?.identifier === voice.identifier ? theme.primary : theme.textDim} 
                  />
                </TouchableOpacity>
              </View>
            ))}
            {voices.length > 20 && <Text style={styles.moreText}>...en {voices.length - 20} meer</Text>}
          </View>
        )}

        {/* Test knoppen */}
        <Text style={styles.sectionTitle}>Test zinnen:</Text>
        {testSentences.map((sentence, index) => (
          <TouchableOpacity
            key={index}
            style={styles.sentenceButton}
            onPress={() => speak(sentence)}
            disabled={isSpeaking}
          >
            <Feather 
              name={isSpeaking ? "volume-2" : "play-circle"} 
              size={20} 
              color={theme.primary} 
            />
            <Text style={styles.sentenceText}>{sentence}</Text>
          </TouchableOpacity>
        ))}

        {/* Stop knop */}
        {isSpeaking && (
          <TouchableOpacity style={styles.stopButton} onPress={stopSpeaking}>
            <Feather name="stop-circle" size={24} color="#FFF" />
            <Text style={styles.stopButtonText}>Stop</Text>
          </TouchableOpacity>
        )}

        {/* Geselecteerde stem info */}
        {selectedVoice && (
          <View style={styles.tipsBox}>
            <Text style={styles.tipsTitle}>✅ Actieve stem:</Text>
            <Text style={styles.selectedVoiceName}>{selectedVoice.name}</Text>
            <Text style={styles.tipsText}>Kwaliteit: {getQualityLabel(selectedVoice)}</Text>
            <Text style={styles.tipsText}>Taal: {selectedVoice.language}</Text>
          </View>
        )}

        {/* Debug info */}
        <View style={styles.debugBox}>
          <Text style={styles.debugTitle}>Debug Info ({Platform.OS}):</Text>
          <Text style={styles.debugText}>
            Totaal: {voices.length} stemmen | Nederlands: {dutchVoices.length}
          </Text>
        </View>
      </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    color: theme.textDim,
    marginRight: 8,
  },
  statusValue: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '600',
  },
  speakingStatus: {
    color: theme.primary,
  },
  infoBox: {
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    color: theme.textDim,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 4,
  },
  voicesBox: {
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
  },
  voiceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  voiceSelected: {
    backgroundColor: theme.primary + '30',
    borderWidth: 2,
    borderColor: theme.primary,
  },
  voicePlaying: {
    backgroundColor: theme.accent + '30',
    borderWidth: 2,
    borderColor: theme.accent,
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '500',
  },
  voiceQuality: {
    fontSize: 11,
    color: theme.primary,
    marginTop: 2,
  },
  voiceLang: {
    fontSize: 11,
    color: theme.textDim,
    marginTop: 2,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 12,
    color: theme.textDim,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  expandButton: {
    padding: 16,
    backgroundColor: theme.surface,
    borderRadius: 12,
    marginBottom: 16,
  },
  expandButtonText: {
    fontSize: 14,
    color: theme.textDim,
  },
  moreText: {
    fontSize: 12,
    color: theme.textDim,
    textAlign: 'center',
    marginTop: 8,
  },
  sentenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  sentenceText: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    marginLeft: 12,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.danger,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  stopButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
  tipsBox: {
    backgroundColor: theme.primary + '20',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.primary + '40',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  selectedVoiceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 13,
    color: theme.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  debugBox: {
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 40,
  },
  debugTitle: {
    fontSize: 12,
    color: theme.textDim,
    marginBottom: 4,
  },
  debugText: {
    fontSize: 11,
    color: theme.textDim,
  },
});

export default SpeechTest;
