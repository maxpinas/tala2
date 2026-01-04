import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { EXTENDED_SECTIONS } from '../../data';
import { useStyles } from '../../styles';

// Helper component for list editing
const ListEditor = ({ items, onItemAdd, onItemRemove, placeholder, title }) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const [text, setText] = useState("");
  return (
    <View style={{marginBottom: 20}}>
      <Text style={styles.inputLabel}>{title}</Text>
      {items.map((item, i) => (
        <View key={i} style={styles.listItemRow}>
          <Text style={{color: '#FFF', flex: 1}}>{typeof item === 'object' ? item.name : item}</Text>
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

const ExtendedModeSetup = ({ profile, onSave, onClose, onTriggerPopup }) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState(profile);
  const steps = EXTENDED_SECTIONS;
  const currentStep = steps[stepIndex];
  
  const update = (key, val) => setData(prev => ({...prev, [key]: val}));
  const addToList = (listKey, item) => setData(prev => ({...prev, [listKey]: [...(prev[listKey]||[]), item]}));
  const removeFromList = (listKey, idx) => setData(prev => ({...prev, [listKey]: prev[listKey].filter((_, i) => i !== idx)}));
  
  const handleNext = () => { 
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else { 
      onSave(data); 
      onClose(); 
      onTriggerPopup("Klaar", "Uitgebreid profiel opgeslagen.", "info"); 
    } 
  };
  
  const renderContent = () => {
    switch(currentStep.id) {
      case 'intro': 
        return (
          <View style={{alignItems:'center', padding:20}}>
            <Feather name="layers" size={60} color={theme.primary} style={{marginBottom:20}} />
            <Text style={styles.onbTitle}>Profiel uitgebreid</Text>
            <Text style={styles.onbText}>Hier kun je extra details invullen. Dit helpt in noodsituaties of bij de dokter.</Text>
          </View>
        );
      case 'personal': 
        return (
          <View>
            <Text style={styles.helperText}>Wanneer ben je geboren?</Text>
            <Text style={styles.inputLabel}>Geboortedatum</Text>
            <TextInput style={styles.inputField} value={data.dob} onChangeText={t=>update('dob',t)} placeholder="DD-MM-JJJJ" placeholderTextColor={theme.textDim} />
            <Text style={styles.helperText}>Wat is je exacte adres?</Text>
            <Text style={styles.inputLabel}>Huisadres (aanvulling)</Text>
            <TextInput style={styles.inputField} value={data.address} onChangeText={t=>update('address',t)} placeholderTextColor={theme.textDim} />
          </View>
        );
      case 'medical': 
        return (
          <View>
            <Text style={styles.helperText}>Belangrijk voor hulpverleners.</Text>
            <Text style={styles.inputLabel}>Bloedgroep</Text>
            <TextInput style={styles.inputField} value={data.bloodType} onChangeText={t=>update('bloodType',t)} placeholderTextColor={theme.textDim} />
            <ListEditor 
              title="Medicijnen (Lijst)" 
              items={data.meds || []} 
              onItemAdd={t=>addToList('meds',t)} 
              onItemRemove={i=>removeFromList('meds',i)} 
              placeholder="Naam medicijn..." 
            />
          </View>
        );
      case 'emergency': 
        return (
          <View>
            <Text style={styles.helperText}>Wie bellen we als partner niet opneemt?</Text>
            <Text style={styles.inputLabel}>Naam Noodcontact 2</Text>
            <TextInput style={styles.inputField} value={data.emergencyName2} onChangeText={t=>update('emergencyName2',t)} placeholderTextColor={theme.textDim} />
            <Text style={styles.inputLabel}>Tel Noodcontact 2</Text>
            <TextInput style={styles.inputField} value={data.emergencyPhone2} onChangeText={t=>update('emergencyPhone2',t)} placeholderTextColor={theme.textDim} />
          </View>
        );
      default: 
        return (
          <ListEditor 
            title={currentStep.title} 
            items={data.generic || []} 
            onItemAdd={t=>addToList('generic',t)} 
            onItemRemove={i=>removeFromList('generic',i)} 
            placeholder="Toevoegen..." 
          />
        );
    }
  };
  
  return (
    <Modal visible={true} animationType="slide">
      <SafeAreaView style={{flex:1, backgroundColor:theme.bg}}>
        <View style={styles.header}>
          <Text style={styles.catHeaderSmall}>{currentStep.title}</Text>
          <TouchableOpacity onPress={()=>onClose()}>
            <Text style={{color:theme.textDim}}>Sluiten</Text>
          </TouchableOpacity>
        </View>
        <View style={{height:4, backgroundColor:theme.surfaceHighlight, width:'100%'}}>
          <View style={{height:'100%', backgroundColor:theme.primary, width:`${(stepIndex/(steps.length-1))*100}%`}}/>
        </View>
        <ScrollView contentContainerStyle={{padding:24}}>
          {renderContent()}
        </ScrollView>
        <View style={{padding:24, flexDirection:'row', justifyContent:'space-between'}}>
          {stepIndex>0 ? (
            <TouchableOpacity onPress={()=>setStepIndex(stepIndex-1)}>
              <Text style={{color:'#FFF'}}>Terug</Text>
            </TouchableOpacity>
          ) : <View/>}
          <TouchableOpacity onPress={handleNext}>
            <Text style={{color:theme.primary, fontWeight:'bold'}}>Volgende</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ExtendedModeSetup;
