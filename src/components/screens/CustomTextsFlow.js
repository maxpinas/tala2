import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useStyles } from '../../styles';

const CustomTextsFlow = ({ onBack, initialData, onSave, onTriggerPopup }) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const [data, setData] = useState(initialData);
  const update = (key, val) => setData({...data, [key]: val});
  
  return (
    <SafeAreaView style={{flex:1, backgroundColor: theme.bg}}>
      <View style={{padding: 24, flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:1, borderColor: theme.surfaceHighlight}}>
        <Text style={styles.catHeaderBig}>Uitleg Teksten</Text>
        <TouchableOpacity onPress={onBack}>
          <Feather name="x" size={32} color={theme.text}/>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{padding: 24}}>
        <Text style={styles.onbText}>Hier kun je de tekst aanpassen die getoond wordt op de uitlegschermen.</Text>
        
        <Text style={styles.formLabel}>Scherm: "Ik heb afasie"</Text>
        <TextInput 
          style={[styles.inputField,{height:100}]} 
          multiline 
          value={data.customPartnerText} 
          onChangeText={t => update('customPartnerText', t)} 
          placeholder="Standaard tekst..." 
          placeholderTextColor={theme.textDim} 
        />
        
        <Text style={styles.formLabel}>Scherm: "Medisch Paspoort Intro"</Text>
        <TextInput 
          style={[styles.inputField,{height:100}]} 
          multiline 
          value={data.customMedicalText} 
          onChangeText={t => update('customMedicalText', t)} 
          placeholder="Standaard tekst..." 
          placeholderTextColor={theme.textDim} 
        />
        
        <TouchableOpacity style={styles.saveBtn} onPress={() => { onSave(data); onTriggerPopup("Succes", "Teksten opgeslagen!", "info"); }}>
          <Text style={styles.saveBtnText}>Opslaan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomTextsFlow;
