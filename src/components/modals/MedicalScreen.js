import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';

const MedicalScreen = ({ visible, onClose, profile, text, extended }) => (
  <Modal visible={visible} animationType="fade" transparent={false}>
    <SafeAreaView style={{flex:1, backgroundColor: '#FFF'}}>
      <View style={{padding: 20, alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={onClose} style={{padding: 10, backgroundColor:'#EEE', borderRadius: 20}}>
          <Feather name="x" size={32} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{padding: 30}}>
        <Text style={{fontSize: 28, fontWeight: 'bold', color: theme.danger, marginBottom: 20}}>MEDISCHE INFO</Text>
        <Text style={{fontSize: 16, color: '#444', marginBottom: 20}}>{text || "Dit zijn mijn medische gegevens."}</Text>
        
        <Text style={styles.medLabel}>NAAM</Text>
        <Text style={styles.medValue}>{profile.name} {extended?.dob ? `(${extended.dob})` : ''}</Text>
        
        <Text style={styles.medLabel}>ADRES</Text>
        <Text style={styles.medValue}>{profile.address || extended?.address || "Niet opgegeven"}</Text>
        
        <Text style={styles.medLabel}>BLOEDGROEP</Text>
        <Text style={styles.medValue}>{extended?.bloodType || "Onbekend"}</Text>
        
        <Text style={styles.medLabel}>MEDICATIE</Text>
        <Text style={styles.medValue}>{profile.medication || "Geen basislijst"}</Text>
        {extended?.meds && extended.meds.map((m,i) => (
          <Text key={i} style={styles.medValue}>- {m}</Text>
        ))}
        
        <Text style={styles.medLabel}>ALLERGIEËN</Text>
        <Text style={styles.medValue}>{profile.allergies || "Geen bekend"}</Text>
        
        <Text style={styles.medLabel}>CONTACTPERSONEN</Text>
        <Text style={styles.medValue}>1. {profile.partnerName} ({profile.partnerPhone})</Text>
        {(profile.contact2Name || extended?.emergencyName2) && (
          <Text style={styles.medValue}>2. {profile.contact2Name || extended?.emergencyName2} ({profile.contact2Phone || extended?.emergencyPhone2})</Text>
        )}
        {profile.hospitalName && (
          <Text style={styles.medValue}>Arts: {profile.hospitalName} ({profile.doctorPhone})</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  </Modal>
);

export default MedicalScreen;
