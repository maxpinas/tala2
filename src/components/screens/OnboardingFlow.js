import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [partner, setPartner] = useState("");
  
  const handleNext = () => { 
    if(step === 0) setStep(1); 
    else if(step === 1) setStep(2); 
    else onComplete(name || "Gebruiker", partner || "Partner"); 
  };
  
  return (
    <SafeAreaView style={styles.onbContainer}>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={styles.onbCard}>
        <Feather name={step===0?"message-circle":step===1?"user":"heart"} size={48} color={theme.primary} style={{marginBottom: 20}} />
        <Text style={styles.onbTitle}>{step===0?"Welkom":step===1?"Wie ben jij?":"Partner?"}</Text>
        <Text style={styles.onbText}>{step===0?"Ik help je communiceren.":step===1?"Hoe heet je?":"Hoe heet je partner?"}</Text>
        {step===1 && (
          <TextInput 
            style={[styles.onbInput,{borderColor:theme.primary,borderWidth:1}]} 
            placeholder="Naam" 
            placeholderTextColor={theme.textDim} 
            value={name} 
            onChangeText={setName} 
            autoFocus
          />
        )}
        {step===2 && (
          <TextInput 
            style={[styles.onbInput,{borderColor:theme.primary,borderWidth:1}]} 
            placeholder="Partner naam" 
            placeholderTextColor={theme.textDim} 
            value={partner} 
            onChangeText={setPartner} 
            autoFocus
          />
        )}
        <TouchableOpacity style={styles.onbBtn} onPress={handleNext}>
          <Text style={styles.onbBtnText}>{step===2?"Starten":"Volgende"}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OnboardingFlow;
