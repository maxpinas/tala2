import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useStyles } from '../../styles';

// Helper component for list editing
const ListEditor = ({ items, onItemAdd, onItemRemove, placeholder, title, theme, styles }) => {
  const [text, setText] = useState("");
  return (
    <View style={{marginBottom: 20}}>
      <Text style={styles.inputLabel}>{title}</Text>
      {items.map((item, i) => (
        <View key={i} style={styles.listItemRow}>
          <Text style={{color: theme.text, flex: 1}}>{typeof item === 'object' ? item.name : item}</Text>
          <TouchableOpacity onPress={() => onItemRemove(i)}>
            <Feather name="trash-2" size={18} color={theme.danger} />
          </TouchableOpacity>
        </View>
      ))}
      <View style={{flexDirection: 'row', marginTop: 8}}>
         <TextInput 
           style={[styles.inputField, {marginBottom: 0, flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0}]} 
           value={text} 
           onChangeText={setText} 
           placeholder={placeholder} 
           placeholderTextColor={theme.textDim} 
         />
         <TouchableOpacity 
           style={{backgroundColor: theme.surfaceHighlight, justifyContent:'center', padding: 16, borderTopRightRadius: 12, borderBottomRightRadius: 12}} 
           onPress={() => { if(text) { onItemAdd(text); setText(""); } }}
         >
           <Feather name="plus" size={24} color={theme.primary} />
         </TouchableOpacity>
      </View>
    </View>
  );
};

const MEDICAL_STEPS = [
  { id: 'intro', title: 'Medisch Paspoort', icon: 'activity' },
  { id: 'personal', title: 'Persoonlijk', icon: 'user' },
  { id: 'medical', title: 'Medisch', icon: 'heart' },
  { id: 'contacts', title: 'Contacten', icon: 'phone' },
];

const MedicalSetupFlow = ({ profile, onSaveProfile, onClose, onTriggerPopup }) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState(profile);
  
  const steps = MEDICAL_STEPS;
  const currentStep = steps[stepIndex];
  
  const update = (key, val) => setData(prev => ({...prev, [key]: val}));
  const addToList = (listKey, item) => setData(prev => ({...prev, [listKey]: [...(prev[listKey]||[]), item]}));
  const removeFromList = (listKey, idx) => setData(prev => ({...prev, [listKey]: prev[listKey].filter((_, i) => i !== idx)}));
  
  const handleNext = () => { 
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else { 
      onSaveProfile(data);
      onClose(); 
    } 
  };
  
  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };
  
  const renderContent = () => {
    switch(currentStep.id) {
      case 'intro': 
        return (
          <View style={{alignItems:'center', padding:20}}>
            <View style={{backgroundColor: theme.danger, borderRadius: 50, padding: 20, marginBottom: 20}}>
              <Feather name="activity" size={60} color="#FFF" />
            </View>
            <Text style={styles.onbTitle}>Medisch Paspoort</Text>
            <Text style={[styles.onbText, {textAlign: 'center', marginTop: 16}]}>
              Vul hier je medische gegevens in voor noodsituaties en hulpverleners.
            </Text>
            
            <Text style={styles.inputLabel}>Introductietekst</Text>
            <TextInput 
              style={[styles.inputField, {minHeight: 100, textAlignVertical: 'top'}]} 
              value={data.customMedicalText} 
              onChangeText={t => update('customMedicalText', t)} 
              placeholder="Bijv: Ik heb afasie en kan moeilijk praten..." 
              placeholderTextColor={theme.textDim}
              multiline
            />
          </View>
        );
        
      case 'personal': 
        return (
          <View>
            <Text style={styles.helperText}>Basisgegevens voor hulpverleners</Text>
            
            <Text style={styles.inputLabel}>Naam</Text>
            <TextInput 
              style={styles.inputField} 
              value={data.name} 
              onChangeText={t => update('name', t)} 
              placeholder="Jouw naam" 
              placeholderTextColor={theme.textDim} 
            />
            
            <Text style={styles.inputLabel}>Geboortedatum</Text>
            <TextInput 
              style={styles.inputField} 
              value={data.dob} 
              onChangeText={t => update('dob', t)} 
              placeholder="DD-MM-JJJJ" 
              placeholderTextColor={theme.textDim} 
            />
            
            <Text style={styles.inputLabel}>Adres</Text>
            <TextInput 
              style={styles.inputField} 
              value={data.address} 
              onChangeText={t => update('address', t)} 
              placeholder="Straat en huisnummer" 
              placeholderTextColor={theme.textDim} 
            />
            <TextInput 
              style={styles.inputField} 
              value={data.addressLine2} 
              onChangeText={t => update('addressLine2', t)} 
              placeholder="Postcode en plaats" 
              placeholderTextColor={theme.textDim} 
            />
          </View>
        );
        
      case 'medical': 
        return (
          <View>
            <Text style={styles.helperText}>Medische gegevens voor hulpverleners</Text>
            
            <Text style={styles.inputLabel}>Bloedgroep</Text>
            <TextInput 
              style={styles.inputField} 
              value={data.bloodType} 
              onChangeText={t => update('bloodType', t)} 
              placeholder="Bijv. A+, O-, AB+" 
              placeholderTextColor={theme.textDim} 
            />
            
            <ListEditor 
              title="Medicijnen" 
              items={data.meds || []} 
              onItemAdd={t => addToList('meds', t)} 
              onItemRemove={i => removeFromList('meds', i)} 
              placeholder="Naam medicijn toevoegen..."
              theme={theme}
              styles={styles}
            />
            
            <Text style={styles.inputLabel}>Allergieën</Text>
            <TextInput 
              style={[styles.inputField, {minHeight: 80, textAlignVertical: 'top'}]} 
              value={data.allergies} 
              onChangeText={t => update('allergies', t)} 
              placeholder="Bijv. penicilline, noten, latex" 
              placeholderTextColor={theme.textDim} 
              multiline
            />
          </View>
        );
        
      case 'contacts': 
        return (
          <View>
            <Text style={styles.helperText}>Wie moeten hulpverleners bellen?</Text>
            
            <Text style={styles.inputLabel}>Ziekenhuis / Huisarts</Text>
            <TextInput 
              style={styles.inputField} 
              value={data.hospitalName} 
              onChangeText={t => update('hospitalName', t)} 
              placeholder="Naam ziekenhuis of huisarts" 
              placeholderTextColor={theme.textDim} 
            />
            
            <Text style={styles.inputLabel}>Telefoon Arts</Text>
            <TextInput 
              style={styles.inputField} 
              value={data.doctorPhone} 
              onChangeText={t => update('doctorPhone', t)} 
              placeholder="Telefoonnummer arts" 
              placeholderTextColor={theme.textDim} 
              keyboardType="phone-pad"
            />
            
            <View style={{marginTop: 20, padding: 16, backgroundColor: theme.surfaceHighlight, borderRadius: 12}}>
              <Text style={styles.helperText}>💡 Tip</Text>
              <Text style={{color: theme.text, marginTop: 4}}>
                Partner en noodcontacten stel je in via Profiel → Instellingen.
              </Text>
            </View>
          </View>
        );
        
      default: 
        return null;
    }
  };
  
  const progress = ((stepIndex + 1) / steps.length) * 100;
  
  return (
    <Modal visible={true} animationType="slide">
      <SafeAreaView style={{flex: 1, backgroundColor: theme.bg}}>
        {/* Header */}
        <View style={{padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: theme.surfaceHighlight}}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <View style={{backgroundColor: theme.danger, borderRadius: 20, padding: 8, marginRight: 12}}>
              <Feather name={currentStep.icon} size={20} color="#FFF" />
            </View>
            <Text style={[styles.catHeaderSmall, {flex: 1}]}>{currentStep.title}</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        {/* Progress bar */}
        <View style={{height: 4, backgroundColor: theme.surfaceHighlight, width: '100%'}}>
          <View style={{height: '100%', backgroundColor: theme.danger, width: `${progress}%`}} />
        </View>
        
        {/* Step indicators */}
        <View style={{flexDirection: 'row', justifyContent: 'center', padding: 16, gap: 8}}>
          {steps.map((step, i) => (
            <View 
              key={step.id} 
              style={{
                width: 8, 
                height: 8, 
                borderRadius: 4, 
                backgroundColor: i <= stepIndex ? theme.danger : theme.surfaceHighlight
              }} 
            />
          ))}
        </View>
        
        {/* Content */}
        <ScrollView contentContainerStyle={{padding: 24}}>
          {renderContent()}
        </ScrollView>
        
        {/* Navigation buttons */}
        <View style={{padding: 24, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: theme.surfaceHighlight}}>
          {stepIndex > 0 ? (
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={handleBack}>
              <Feather name="chevron-left" size={20} color={theme.text} />
              <Text style={{color: theme.text, marginLeft: 4}}>Terug</Text>
            </TouchableOpacity>
          ) : <View />}
          
          <TouchableOpacity 
            style={{backgroundColor: theme.danger, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, flexDirection: 'row', alignItems: 'center'}} 
            onPress={handleNext}
          >
            <Text style={{color: '#FFF', fontWeight: 'bold', marginRight: 8}}>
              {stepIndex === steps.length - 1 ? 'Opslaan' : 'Volgende'}
            </Text>
            <Feather name={stepIndex === steps.length - 1 ? 'check' : 'chevron-right'} size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default MedicalSetupFlow;
