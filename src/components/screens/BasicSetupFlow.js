import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';

const BasicSetupFlow = ({ onBack, initialData, onSave, onTriggerPopup }) => {
  const [data, setData] = useState(initialData);
  const update = (key, val) => setData({...data, [key]: val});
  
  return (
    <SafeAreaView style={{flex:1, backgroundColor: theme.bg}}>
      <View style={{padding: 24, flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:1, borderColor:theme.surfaceHighlight}}>
        <Text style={styles.catHeaderBig}>Profiel</Text>
        <TouchableOpacity onPress={onBack}>
          <Feather name="x" size={32} color="#FFF"/>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{padding: 24}}>
        <Text style={styles.formLabel}>1. Persoonlijk</Text>
        <TextInput style={styles.inputField} placeholder="Naam" placeholderTextColor={theme.textDim} value={data.name} onChangeText={t => update('name', t)} />
        <TextInput style={styles.inputField} placeholder="Telefoon" placeholderTextColor={theme.textDim} value={data.phone} onChangeText={t => update('phone', t)} />
        <TextInput style={styles.inputField} placeholder="Email" placeholderTextColor={theme.textDim} value={data.email} onChangeText={t => update('email', t)} />
        <TextInput style={styles.inputField} placeholder="Adres" placeholderTextColor={theme.textDim} value={data.address} onChangeText={t => update('address', t)} />
        
        <Text style={styles.formLabel}>2. Partner / Contact 1</Text>
        <TextInput style={styles.inputField} placeholder="Naam Partner" placeholderTextColor={theme.textDim} value={data.partnerName} onChangeText={t => update('partnerName', t)} />
        <TextInput style={styles.inputField} placeholder="Telefoon Partner" placeholderTextColor={theme.textDim} value={data.partnerPhone} onChangeText={t => update('partnerPhone', t)} />
        <TextInput style={styles.inputField} placeholder="Email Partner" placeholderTextColor={theme.textDim} value={data.partnerEmail} onChangeText={t => update('partnerEmail', t)} />
        
        <Text style={styles.formLabel}>3. Contact 2</Text>
        <TextInput style={styles.inputField} placeholder="Naam 2e Contact" placeholderTextColor={theme.textDim} value={data.contact2Name} onChangeText={t => update('contact2Name', t)} />
        <TextInput style={styles.inputField} placeholder="Tel 2e Contact" placeholderTextColor={theme.textDim} value={data.contact2Phone} onChangeText={t => update('contact2Phone', t)} />
        
        <Text style={styles.formLabel}>4. Medisch</Text>
        <TextInput style={styles.inputField} placeholder="Ziekenhuis / Huisarts" placeholderTextColor={theme.textDim} value={data.hospitalName} onChangeText={t => update('hospitalName', t)} />
        <TextInput style={styles.inputField} placeholder="Tel Arts" placeholderTextColor={theme.textDim} value={data.doctorPhone} onChangeText={t => update('doctorPhone', t)} />
        <TextInput style={styles.inputField} placeholder="Medicatie" placeholderTextColor={theme.textDim} value={data.medication} onChangeText={t => update('medication', t)} />
        <TextInput style={styles.inputField} placeholder="Allergieën" placeholderTextColor={theme.textDim} value={data.allergies} onChangeText={t => update('allergies', t)} />
        
        <TouchableOpacity style={styles.saveBtn} onPress={() => { onSave(data); onTriggerPopup("Succes", "Gegevens opgeslagen!", "info"); }}>
          <Text style={styles.saveBtnText}>Opslaan</Text>
        </TouchableOpacity>
        <View style={{height: 50}}/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BasicSetupFlow;
