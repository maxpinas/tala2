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

const PROFILE_STEPS = [
  { id: 'intro', title: 'Profiel', icon: 'user' },
  { id: 'personal', title: 'Over Mij', icon: 'user' },
  { id: 'contact1', title: 'Partner', icon: 'heart' },
  { id: 'contact2', title: 'Contact 2', icon: 'users' },
  { id: 'medical', title: 'Medisch', icon: 'activity' },
  { id: 'emergency', title: 'Noodgeval', icon: 'shield' },
];

const ProfileSetupFlow = ({ profile, extendedProfile, onSaveProfile, onSaveExtended, onClose, onTriggerPopup }) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const [stepIndex, setStepIndex] = useState(0);
  const [profileData, setProfileData] = useState(profile);
  const [extendedData, setExtendedData] = useState(extendedProfile);
  
  const steps = PROFILE_STEPS;
  const currentStep = steps[stepIndex];
  
  const updateProfile = (key, val) => setProfileData(prev => ({...prev, [key]: val}));
  const updateExtended = (key, val) => setExtendedData(prev => ({...prev, [key]: val}));
  const addToList = (listKey, item) => setExtendedData(prev => ({...prev, [listKey]: [...(prev[listKey]||[]), item]}));
  const removeFromList = (listKey, idx) => setExtendedData(prev => ({...prev, [listKey]: prev[listKey].filter((_, i) => i !== idx)}));
  
  const handleNext = () => { 
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else { 
      onSaveProfile(profileData);
      onSaveExtended(extendedData);
      onClose(); 
      onTriggerPopup("Klaar", "Profiel opgeslagen!", "info"); 
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
            <View style={{backgroundColor: theme.primary, borderRadius: 50, padding: 20, marginBottom: 20}}>
              <Feather name="user" size={60} color="#000" />
            </View>
            <Text style={styles.onbTitle}>Jouw Profiel</Text>
            <Text style={[styles.onbText, {textAlign: 'center', marginTop: 16}]}>
              Vul hier je persoonlijke gegevens, contactpersonen en medische informatie in.
            </Text>
            <Text style={[styles.onbText, {textAlign: 'center', marginTop: 8, color: theme.textDim}]}>
              Deze informatie wordt gebruikt voor noodsituaties en het medisch paspoort.
            </Text>
          </View>
        );
        
      case 'personal': 
        return (
          <View>
            <Text style={styles.helperText}>Basis informatie over jezelf</Text>
            
            <Text style={styles.inputLabel}>Naam *</Text>
            <TextInput 
              style={styles.inputField} 
              value={profileData.name} 
              onChangeText={t => updateProfile('name', t)} 
              placeholder="Jouw naam" 
              placeholderTextColor={theme.textDim} 
            />
            
            <Text style={styles.inputLabel}>Geboortedatum</Text>
            <TextInput 
              style={styles.inputField} 
              value={extendedData.dob} 
              onChangeText={t => updateExtended('dob', t)} 
              placeholder="DD-MM-JJJJ" 
              placeholderTextColor={theme.textDim} 
            />
            
            <Text style={styles.inputLabel}>Telefoon</Text>
            <TextInput 
              style={styles.inputField} 
              value={profileData.phone} 
              onChangeText={t => updateProfile('phone', t)} 
              placeholder="Jouw telefoonnummer" 
              placeholderTextColor={theme.textDim} 
              keyboardType="phone-pad"
            />
            
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput 
              style={styles.inputField} 
              value={profileData.email} 
              onChangeText={t => updateProfile('email', t)} 
              placeholder="Jouw email" 
              placeholderTextColor={theme.textDim} 
              keyboardType="email-address"
            />
            
            <Text style={styles.inputLabel}>Adres</Text>
            <TextInput 
              style={styles.inputField} 
              value={profileData.address} 
              onChangeText={t => updateProfile('address', t)} 
              placeholder="Straat en huisnummer" 
              placeholderTextColor={theme.textDim} 
            />
            <TextInput 
              style={styles.inputField} 
              value={extendedData.address} 
              onChangeText={t => updateExtended('address', t)} 
              placeholder="Postcode en plaats" 
              placeholderTextColor={theme.textDim} 
            />
          </View>
        );
        
      case 'contact1': 
        return (
          <View>
            <Text style={styles.helperText}>Je belangrijkste contactpersoon</Text>
            
            <Text style={styles.inputLabel}>Naam Partner / Contact 1</Text>
            <TextInput 
              style={styles.inputField} 
              value={profileData.partnerName} 
              onChangeText={t => updateProfile('partnerName', t)} 
              placeholder="Naam partner of verzorger" 
              placeholderTextColor={theme.textDim} 
            />
            
            <Text style={styles.inputLabel}>Telefoon</Text>
            <TextInput 
              style={styles.inputField} 
              value={profileData.partnerPhone} 
              onChangeText={t => updateProfile('partnerPhone', t)} 
              placeholder="Telefoonnummer" 
              placeholderTextColor={theme.textDim} 
              keyboardType="phone-pad"
            />
            
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput 
              style={styles.inputField} 
              value={profileData.partnerEmail} 
              onChangeText={t => updateProfile('partnerEmail', t)} 
              placeholder="Email adres" 
              placeholderTextColor={theme.textDim} 
              keyboardType="email-address"
            />
          </View>
        );
        
      case 'contact2': 
        return (
          <View>
            <Text style={styles.helperText}>Reserve contactpersoon (optioneel)</Text>
            
            <Text style={styles.inputLabel}>Naam 2e Contact</Text>
            <TextInput 
              style={styles.inputField} 
              value={profileData.contact2Name} 
              onChangeText={t => updateProfile('contact2Name', t)} 
              placeholder="Bijv. zoon, dochter, buurvrouw" 
              placeholderTextColor={theme.textDim} 
            />
            
            <Text style={styles.inputLabel}>Telefoon</Text>
            <TextInput 
              style={styles.inputField} 
              value={profileData.contact2Phone} 
              onChangeText={t => updateProfile('contact2Phone', t)} 
              placeholder="Telefoonnummer" 
              placeholderTextColor={theme.textDim} 
              keyboardType="phone-pad"
            />
            
            <View style={{marginTop: 20, padding: 16, backgroundColor: theme.surfaceHighlight, borderRadius: 12}}>
              <Text style={styles.helperText}>💡 Tip</Text>
              <Text style={{color: theme.text, marginTop: 4}}>
                Dit contact wordt gebeld als je partner niet opneemt in een noodsituatie.
              </Text>
            </View>
          </View>
        );
        
      case 'medical': 
        return (
          <View>
            <Text style={styles.helperText}>Medische gegevens voor hulpverleners</Text>
            
            <Text style={styles.inputLabel}>Bloedgroep</Text>
            <TextInput 
              style={styles.inputField} 
              value={extendedData.bloodType} 
              onChangeText={t => updateExtended('bloodType', t)} 
              placeholder="Bijv. A+, O-, AB+" 
              placeholderTextColor={theme.textDim} 
            />
            
            <Text style={styles.inputLabel}>Ziekenhuis / Huisarts</Text>
            <TextInput 
              style={styles.inputField} 
              value={profileData.hospitalName} 
              onChangeText={t => updateProfile('hospitalName', t)} 
              placeholder="Naam ziekenhuis of huisarts" 
              placeholderTextColor={theme.textDim} 
            />
            
            <Text style={styles.inputLabel}>Telefoon Arts</Text>
            <TextInput 
              style={styles.inputField} 
              value={profileData.doctorPhone} 
              onChangeText={t => updateProfile('doctorPhone', t)} 
              placeholder="Telefoonnummer arts" 
              placeholderTextColor={theme.textDim} 
              keyboardType="phone-pad"
            />
            
            <ListEditor 
              title="Medicijnen" 
              items={extendedData.meds || []} 
              onItemAdd={t => addToList('meds', t)} 
              onItemRemove={i => removeFromList('meds', i)} 
              placeholder="Naam medicijn toevoegen..."
              theme={theme}
              styles={styles}
            />
            
            <Text style={styles.inputLabel}>Allergieën</Text>
            <TextInput 
              style={[styles.inputField, {minHeight: 80, textAlignVertical: 'top'}]} 
              value={profileData.allergies} 
              onChangeText={t => updateProfile('allergies', t)} 
              placeholder="Bijv. penicilline, noten, latex" 
              placeholderTextColor={theme.textDim} 
              multiline
            />
          </View>
        );
        
      case 'emergency': 
        return (
          <View>
            <Text style={styles.helperText}>Extra noodcontact (naast partner en contact 2)</Text>
            
            <Text style={styles.inputLabel}>Naam Noodcontact 3</Text>
            <TextInput 
              style={styles.inputField} 
              value={extendedData.emergencyName2} 
              onChangeText={t => updateExtended('emergencyName2', t)} 
              placeholder="Naam reserve noodcontact" 
              placeholderTextColor={theme.textDim} 
            />
            
            <Text style={styles.inputLabel}>Telefoon Noodcontact 3</Text>
            <TextInput 
              style={styles.inputField} 
              value={extendedData.emergencyPhone2} 
              onChangeText={t => updateExtended('emergencyPhone2', t)} 
              placeholder="Telefoonnummer" 
              placeholderTextColor={theme.textDim} 
              keyboardType="phone-pad"
            />
            
            <View style={{marginTop: 20, padding: 16, backgroundColor: 'rgba(255,193,7,0.1)', borderRadius: 12, borderWidth: 1, borderColor: theme.warning}}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                <Feather name="shield" size={20} color={theme.warning} />
                <Text style={{color: theme.warning, fontWeight: 'bold', marginLeft: 8}}>Noodvolgorde</Text>
              </View>
              <Text style={{color: theme.text}}>
                1. Partner: {profileData.partnerName || '(niet ingevuld)'}{'\n'}
                2. Contact 2: {profileData.contact2Name || '(niet ingevuld)'}{'\n'}
                3. Dit contact: {extendedData.emergencyName2 || '(niet ingevuld)'}
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
            <View style={{backgroundColor: theme.primary, borderRadius: 20, padding: 8, marginRight: 12}}>
              <Feather name={currentStep.icon} size={20} color="#000" />
            </View>
            <Text style={[styles.catHeaderSmall, {flex: 1}]}>{currentStep.title}</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        {/* Progress bar */}
        <View style={{height: 4, backgroundColor: theme.surfaceHighlight, width: '100%'}}>
          <View style={{height: '100%', backgroundColor: theme.primary, width: `${progress}%`}} />
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
                backgroundColor: i <= stepIndex ? theme.primary : theme.surfaceHighlight
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
            style={{backgroundColor: theme.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, flexDirection: 'row', alignItems: 'center'}} 
            onPress={handleNext}
          >
            <Text style={{color: '#000', fontWeight: 'bold', marginRight: 8}}>
              {stepIndex === steps.length - 1 ? 'Opslaan' : 'Volgende'}
            </Text>
            <Feather name={stepIndex === steps.length - 1 ? 'check' : 'chevron-right'} size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ProfileSetupFlow;
