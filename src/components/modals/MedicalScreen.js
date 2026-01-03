import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius } from '../../theme';

const MedicalScreen = ({ visible, onClose, profile, text, extended }) => {
  const { theme } = useTheme();
  
  return (
  <Modal visible={visible} animationType="fade" transparent={false}>
    <SafeAreaView style={{flex:1, backgroundColor: theme.bg}}>
      <View style={{padding: spacing.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 48, height: 48, borderRadius: borderRadius.full, backgroundColor: theme.danger, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md}}>
            <Feather name="activity" size={24} color={theme.textInverse} />
          </View>
          <Text style={{fontSize: 24, fontWeight: 'bold', color: theme.text}}>Medisch Paspoort</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={{padding: spacing.md, backgroundColor: theme.surface, borderRadius: borderRadius.full, borderWidth: 1, borderColor: theme.surfaceHighlight}}>
          <Feather name="x" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={{padding: spacing.xl}}>
        <View style={{backgroundColor: theme.surface, padding: spacing.lg, borderRadius: borderRadius.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: theme.surfaceHighlight}}>
          <Text style={{fontSize: 16, color: theme.textDim, lineHeight: 24}}>{text || "Dit zijn mijn medische gegevens."}</Text>
        </View>
        
        <View style={{backgroundColor: theme.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: theme.surfaceHighlight}}>
          <View style={{marginBottom: spacing.lg}}>
            <Text style={{color: theme.danger, fontWeight: 'bold', fontSize: 12, marginBottom: spacing.xs}}>NAAM</Text>
            <Text style={{color: theme.text, fontSize: 18, fontWeight: '600'}}>{profile.name} {extended?.dob ? `(${extended.dob})` : ''}</Text>
          </View>
          
          <View style={{marginBottom: spacing.lg}}>
            <Text style={{color: theme.danger, fontWeight: 'bold', fontSize: 12, marginBottom: spacing.xs}}>ADRES</Text>
            <Text style={{color: theme.text, fontSize: 16}}>{profile.address || extended?.address || "Niet opgegeven"}</Text>
          </View>
          
          <View style={{marginBottom: spacing.lg}}>
            <Text style={{color: theme.danger, fontWeight: 'bold', fontSize: 12, marginBottom: spacing.xs}}>BLOEDGROEP</Text>
            <Text style={{color: theme.text, fontSize: 16}}>{extended?.bloodType || "Onbekend"}</Text>
          </View>
          
          <View style={{marginBottom: spacing.lg}}>
            <Text style={{color: theme.danger, fontWeight: 'bold', fontSize: 12, marginBottom: spacing.xs}}>MEDICATIE</Text>
            <Text style={{color: theme.text, fontSize: 16}}>{profile.medication || "Geen basislijst"}</Text>
            {extended?.meds && extended.meds.map((m,i) => (
              <Text key={i} style={{color: theme.text, fontSize: 16, marginTop: spacing.xs}}>• {m}</Text>
            ))}
          </View>
          
          <View style={{marginBottom: spacing.lg}}>
            <Text style={{color: theme.danger, fontWeight: 'bold', fontSize: 12, marginBottom: spacing.xs}}>ALLERGIEËN</Text>
            <Text style={{color: theme.text, fontSize: 16}}>{profile.allergies || "Geen bekend"}</Text>
          </View>
          
          <View>
            <Text style={{color: theme.danger, fontWeight: 'bold', fontSize: 12, marginBottom: spacing.xs}}>CONTACTPERSONEN</Text>
            <Text style={{color: theme.text, fontSize: 16}}>1. {profile.partnerName} ({profile.partnerPhone})</Text>
            {(profile.contact2Name || extended?.emergencyName2) && (
              <Text style={{color: theme.text, fontSize: 16, marginTop: spacing.xs}}>2. {profile.contact2Name || extended?.emergencyName2} ({profile.contact2Phone || extended?.emergencyPhone2})</Text>
            )}
            {profile.hospitalName && (
              <Text style={{color: theme.text, fontSize: 16, marginTop: spacing.xs}}>Arts: {profile.hospitalName} ({profile.doctorPhone})</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  </Modal>
  );
};

export default MedicalScreen;
