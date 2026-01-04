import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius } from '../../theme';

// Read-only field component
const Field = ({ label, value, placeholder, theme }) => (
  <View style={{ marginBottom: spacing.lg }}>
    <Text style={{ color: theme.danger, fontWeight: 'bold', fontSize: 12, marginBottom: spacing.xs }}>{label}</Text>
    <Text style={{ color: value ? theme.text : theme.textDim, fontSize: 16 }}>{value || placeholder}</Text>
  </View>
);

const MedicalScreen = ({ visible, onClose, profile, onOpenSetup }) => {
  const { theme } = useTheme();
  
  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <SafeAreaView style={{flex:1, backgroundColor: theme.bg}}>
        <View style={{padding: spacing.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 48, height: 48, borderRadius: borderRadius.full, backgroundColor: theme.danger, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md}}>
              <Feather name="activity" size={24} color="#FFF" />
            </View>
            <Text style={{fontSize: 24, fontWeight: 'bold', color: theme.text}}>Medisch Paspoort</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={{padding: spacing.md, backgroundColor: theme.surface, borderRadius: borderRadius.full, borderWidth: 1, borderColor: theme.surfaceHighlight}}>
            <Feather name="x" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          activeOpacity={0.9}
          onLongPress={onOpenSetup}
          delayLongPress={500}
          style={{flex: 1}}
        >
          <ScrollView contentContainerStyle={{padding: spacing.xl}}>
            {/* Intro text */}
            <View style={{backgroundColor: theme.surface, padding: spacing.lg, borderRadius: borderRadius.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: theme.surfaceHighlight}}>
              <Text style={{fontSize: 16, color: theme.textDim, lineHeight: 24}}>
                {profile.customMedicalText || "Dit zijn mijn medische gegevens."}
              </Text>
            </View>
            
            <View style={{backgroundColor: theme.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: theme.surfaceHighlight}}>
              <Field label="NAAM" value={profile.name} placeholder="Niet opgegeven" theme={theme} />
              <Field label="GEBOORTEDATUM" value={profile.dob} placeholder="Niet opgegeven" theme={theme} />
              <Field label="ADRES" value={[profile.address, profile.addressLine2].filter(Boolean).join(', ') || null} placeholder="Niet opgegeven" theme={theme} />
              <Field label="BLOEDGROEP" value={profile.bloodType} placeholder="Onbekend" theme={theme} />
              <Field label="MEDICATIE" value={profile.meds?.length > 0 ? profile.meds.join(', ') : null} placeholder="Geen medicijnen opgegeven" theme={theme} />
              <Field label="ALLERGIEËN" value={profile.allergies} placeholder="Geen bekend" theme={theme} />
              <Field label="ZIEKENHUIS / HUISARTS" value={profile.hospitalName} placeholder="Niet opgegeven" theme={theme} />
              <Field label="TELEFOON ARTS" value={profile.doctorPhone} placeholder="Niet opgegeven" theme={theme} />
              
              <View>
                <Text style={{color: theme.danger, fontWeight: 'bold', fontSize: 12, marginBottom: spacing.xs}}>CONTACTPERSONEN</Text>
                {profile.partnerName && (
                  <Text style={{color: theme.text, fontSize: 16}}>1. {profile.partnerName}{profile.partnerPhone ? ` (${profile.partnerPhone})` : ''}</Text>
                )}
                {profile.contact2Name && (
                  <Text style={{color: theme.text, fontSize: 16, marginTop: spacing.xs}}>2. {profile.contact2Name}{profile.contact2Phone ? ` (${profile.contact2Phone})` : ''}</Text>
                )}
                {!profile.partnerName && !profile.contact2Name && (
                  <Text style={{color: theme.textDim, fontSize: 16}}>Geen contacten opgegeven</Text>
                )}
              </View>
            </View>
            
            {/* Hint for editing */}
            <Text style={{color: theme.textDim, fontSize: 12, textAlign: 'center', marginTop: spacing.lg}}>
              Lang indrukken om te bewerken
            </Text>
          </ScrollView>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default MedicalScreen;
