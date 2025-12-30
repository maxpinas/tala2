import * as Speech from 'expo-speech';

// Beschikbare stemmen configuratie
export const VOICE_OPTIONS = {
  claire: {
    id: 'claire',
    name: 'Claire (Enhanced)',
    description: 'Vrouwelijke stem - Premium kwaliteit',
    identifier: 'com.apple.voice.enhanced.nl-NL.Claire',
    language: 'nl-NL',
    provider: 'system',
  },
  xander: {
    id: 'xander', 
    name: 'Xander (Enhanced)',
    description: 'Mannelijke stem - Premium kwaliteit',
    identifier: 'com.apple.voice.enhanced.nl-NL.Xander',
    language: 'nl-NL',
    provider: 'system',
  },
  xander_basic: {
    id: 'xander_basic',
    name: 'Xander (Standaard)',
    description: 'Mannelijke stem - Basisversie',
    identifier: 'com.apple.voice.compact.nl-NL.Xander',
    language: 'nl-NL',
    provider: 'system',
  },
  // Toekomstige providers:
  // google_nl: { id: 'google_nl', name: 'Google NL', provider: 'google-cloud', ... },
  // elevenlabs_custom: { id: 'elevenlabs_custom', name: 'ElevenLabs', provider: 'elevenlabs', ... },
};

// Default voice
export const DEFAULT_VOICE = 'claire';

// Fallback volgorde voor Nederlandse stemmen
const DUTCH_VOICE_FALLBACK_ORDER = [
  'com.apple.voice.enhanced.nl-NL.Claire',
  'com.apple.voice.enhanced.nl-NL.Xander', 
  'com.apple.voice.compact.nl-NL.Xander',
  'com.apple.voice.compact.nl-NL.Ellen',
  'com.apple.ttsbundle.nl-NL-compact',
  'nl-NL', // Generic fallback
];

class SpeechService {
  constructor() {
    this.currentVoice = VOICE_OPTIONS[DEFAULT_VOICE];
    this.isSpeaking = false;
    this.onSpeakingChange = null;
    this.availableVoices = [];
    this.fallbackVoice = null;
    this.isInitialized = false;
  }

  // Initialiseer service en zoek beschikbare stemmen
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      const allVoices = await Speech.getAvailableVoicesAsync();
      this.availableVoices = allVoices;
      
      // Zoek beschikbare Nederlandse stemmen
      const dutchVoices = allVoices.filter(v => 
        v.language === 'nl-NL' || v.identifier?.includes('nl-NL')
      );
      
      console.log(`[speech] Found ${dutchVoices.length} Dutch voices`);
      
      // Zoek beste beschikbare fallback
      for (const fallbackId of DUTCH_VOICE_FALLBACK_ORDER) {
        const found = allVoices.find(v => v.identifier === fallbackId);
        if (found) {
          this.fallbackVoice = found.identifier;
          console.log(`[speech] Fallback voice: ${found.identifier}`);
          break;
        }
      }
      
      // Als geen specifieke match, pak eerste Nederlandse stem
      if (!this.fallbackVoice && dutchVoices.length > 0) {
        this.fallbackVoice = dutchVoices[0].identifier;
        console.log(`[speech] Using first Dutch voice as fallback: ${this.fallbackVoice}`);
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.log('[speech] Could not initialize voices:', error);
      this.isInitialized = true; // Don't retry
    }
  }

  // Check of een stem beschikbaar is
  isVoiceAvailable(identifier) {
    return this.availableVoices.some(v => v.identifier === identifier);
  }

  // Krijg effectieve stem (met fallback)
  getEffectiveVoice() {
    if (this.isVoiceAvailable(this.currentVoice.identifier)) {
      return this.currentVoice.identifier;
    }
    console.log(`[speech] Voice ${this.currentVoice.identifier} not available, using fallback`);
    return this.fallbackVoice || 'nl-NL';
  }

  // Stel de actieve stem in via voiceId (legacy) of identifier
  setVoice(voiceId) {
    // Check eerst of het een bekende voiceId is
    if (VOICE_OPTIONS[voiceId]) {
      this.currentVoice = VOICE_OPTIONS[voiceId];
      console.log('Voice set to:', this.currentVoice.name);
      return true;
    }
    // Anders behandel het als een identifier
    this.currentVoice = {
      id: voiceId,
      name: voiceId,
      identifier: voiceId,
      language: 'nl-NL',
      provider: 'system',
    };
    console.log('Voice set to identifier:', voiceId);
    return true;
  }

  // Stel stem in via identifier (nieuw)
  setVoiceByIdentifier(identifier, name = '') {
    this.currentVoice = {
      id: identifier,
      name: name || identifier,
      identifier: identifier,
      language: 'nl-NL',
      provider: 'system',
    };
    console.log('Voice set to:', name || identifier);
    return true;
  }

  // Haal huidige stem op
  getVoice() {
    return this.currentVoice;
  }

  // Spreek tekst uit
  async speak(text, options = {}) {
    if (!text || text.trim() === '') return;

    // Ensure we've discovered available voices
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Stop eventuele huidige spraak
    await this.stop();

    this.isSpeaking = true;
    if (this.onSpeakingChange) this.onSpeakingChange(true);

    const speechOptions = {
      language: this.currentVoice.language,
      pitch: options.pitch || 1.0,
      rate: options.rate || 0.95, // Iets natuurlijker tempo
      voice: this.getEffectiveVoice(), // Use fallback if needed
      onStart: () => {
        this.isSpeaking = true;
        if (this.onSpeakingChange) this.onSpeakingChange(true);
        if (options.onStart) options.onStart();
      },
      onDone: () => {
        this.isSpeaking = false;
        if (this.onSpeakingChange) this.onSpeakingChange(false);
        if (options.onDone) options.onDone();
      },
      onStopped: () => {
        this.isSpeaking = false;
        if (this.onSpeakingChange) this.onSpeakingChange(false);
        if (options.onStopped) options.onStopped();
      },
      onError: (error) => {
        console.log('Speech error:', error);
        this.isSpeaking = false;
        if (this.onSpeakingChange) this.onSpeakingChange(false);
        if (options.onError) options.onError(error);
      },
    };

    try {
      // Voor nu alleen system voices (expo-speech)
      // Later kunnen we hier Google Cloud of ElevenLabs toevoegen
      if (this.currentVoice.provider === 'system') {
        Speech.speak(text, speechOptions);
      }
      // Toekomstige providers:
      // else if (this.currentVoice.provider === 'google-cloud') {
      //   await this.speakWithGoogle(text, speechOptions);
      // }
      // else if (this.currentVoice.provider === 'elevenlabs') {
      //   await this.speakWithElevenLabs(text, speechOptions);
      // }
    } catch (error) {
      console.error('Speech error:', error);
      this.isSpeaking = false;
      if (this.onSpeakingChange) this.onSpeakingChange(false);
    }
  }

  // Stop spraak
  async stop() {
    await Speech.stop();
    this.isSpeaking = false;
    if (this.onSpeakingChange) this.onSpeakingChange(false);
  }

  // Check of er gesproken wordt
  getIsSpeaking() {
    return this.isSpeaking;
  }

  // Callback voor speaking state changes
  setSpeakingChangeCallback(callback) {
    this.onSpeakingChange = callback;
  }

  // Haal alle beschikbare stemmen op (voor debugging/toekomstig gebruik)
  async getAvailableSystemVoices() {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.filter(v => 
      v.language === 'nl-NL' && 
      (v.quality === 'Enhanced' || v.identifier?.includes('enhanced'))
    );
  }
}

// Singleton instance
const speechService = new SpeechService();
export default speechService;
