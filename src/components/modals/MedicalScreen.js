import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius } from '../../theme';

// G1: Editable field component for long press
const EditableField = ({ label, value, placeholder, onSave, theme }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');

  const handleSave = () => {
    onSave(editValue);
    setEditing(false);
  };

  if (editing) {
    return (
      <View style={{ marginBottom: spacing.lg }}>
        <Text style={{ color: theme.danger, fontWeight: 'bold', fontSize: 12, marginBottom: spacing.xs }}>{label}</Text>
        <TextInput
          style={{
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.primary,
            borderRadius: borderRadius.sm,
            padding: spacing.md,
            color: theme.text,
            fontSize: 16,
          }}
          value={editValue}
          onChangeText={setEditValue}
          placeholder={placeholder}
          placeholderTextColor={theme.textDim}
          autoFocus
        />
        <View style={{ flexDirection: 'row', marginTop: spacing.sm, gap: spacing.sm }}>
          <TouchableOpacity
            onPress={handleSave}
            style={{ backgroundColor: theme.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.sm }}
          >
            <Text style={{ color: theme.textInverse, fontWeight: '600' }}>Opslaan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setEditValue(value || ''); setEditing(false); }}
            style={{ backgroundColor: theme.surfaceHighlight, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.sm }}
          >
            <Text style={{ color: theme.text }}>Annuleer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onLongPress={() => setEditing(true)}
      delayLongPress={500}
      style={{ marginBottom: spacing.lg }}
    >
      <Text style={{ color: theme.danger, fontWeight: 'bold', fontSize: 12, marginBottom: spacing.xs }}>{label}</Text>
      <Text style={{ color: theme.text, fontSize: 16 }}>{value || placeholder}</Text>
      <Text style={{ color: theme.textDim, fontSize: 10, marginTop: 2 }}>Lang indrukken om te bewerken</Text>
    </TouchableOpacity>
  );
};

const MedicalScreen = ({ visible, onClose, profile, text, extended, onUpdateProfile, onUpdateExtended }) => {
  const { theme } = useTheme();
  const [customText, setCustomText] = useState(text);
  const [editingIntro, setEditingIntro] = useState(false);

  // G1: Update handlers
  const updateProfileField = (field, value) => {
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, [field]: value });
    }
  };

  const updateExtendedField = (field, value) => {
    if (onUpdateExtended) {
      onUpdateExtended({ ...extended, [field]: value });
    }
  };
  
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
        {/* G1: Editable intro text */}
        <TouchableOpacity
          onLongPress={() => setEditingIntro(true)}
          delayLongPress={500}
          style={{backgroundColor: theme.surface, padding: spacing.lg, borderRadius: borderRadius.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: editingIntro ? theme.primary : theme.surfaceHighlight}}
        >
          {editingIntro ? (
            <>
              <TextInput
                style={{ color: theme.text, fontSize: 16, lineHeight: 24, minHeight: 80 }}
                value={customText}
                onChangeText={setCustomText}
                placeholder="Beschrijf hier je medische situatie..."
                placeholderTextColor={theme.textDim}
                multiline
                autoFocus
              />
              <View style={{ flexDirection: 'row', marginTop: spacing.md, gap: spacing.sm }}>
                <TouchableOpacity
                  onPress={() => {
                    updateProfileField('customMedicalText', customText);
                    setEditingIntro(false);
                  }}
                  style={{ backgroundColor: theme.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.sm }}
                >
                  <Text style={{ color: theme.textInverse, fontWeight: '600' }}>Opslaan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setCustomText(text); setEditingIntro(false); }}
                  style={{ backgroundColor: theme.surfaceHighlight, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.sm }}
                >
                  <Text style={{ color: theme.text }}>Annuleer</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={{fontSize: 16, color: theme.textDim, lineHeight: 24}}>{text || "Dit zijn mijn medische gegevens."}</Text>
              <Text style={{ color: theme.textDim, fontSize: 10, marginTop: spacing.sm }}>Lang indrukken om te bewerken</Text>
            </>
          )}
        </TouchableOpacity>
        
        <View style={{backgroundColor: theme.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: theme.surfaceHighlight}}>
          {/* G1: All fields are now editable via long press */}
          <EditableField
            label="NAAM"
            value={profile.name ? `${profile.name}${extended?.dob ? ` (${extended.dob})` : ''}` : null}
            placeholder="Niet opgegeven"
            onSave={(val) => updateProfileField('name', val)}
            theme={theme}
          />
          
          <EditableField
            label="ADRES"
            value={profile.address || extended?.address}
            placeholder="Niet opgegeven"
            onSave={(val) => updateProfileField('address', val)}
            theme={theme}
          />
          
          <EditableField
            label="BLOEDGROEP"
            value={extended?.bloodType}
            placeholder="Onbekend"
            onSave={(val) => updateExtendedField('bloodType', val)}
            theme={theme}
          />
          
          <EditableField
            label="MEDICATIE"
            value={profile.medication || (extended?.meds?.join(', '))}
            placeholder="Geen basislijst"
            onSave={(val) => updateProfileField('medication', val)}
            theme={theme}
          />
          
          <EditableField
            label="ALLERGIEËN"
            value={profile.allergies}
            placeholder="Geen bekend"
            onSave={(val) => updateProfileField('allergies', val)}
            theme={theme}
          />
          
          <View>
            <Text style={{color: theme.danger, fontWeight: 'bold', fontSize: 12, marginBottom: spacing.xs}}>CONTACTPERSONEN</Text>
            <Text style={{color: theme.text, fontSize: 16}}>1. {profile.partnerName} ({profile.partnerPhone})</Text>
            {(profile.contact2Name || extended?.emergencyName2) && (
              <Text style={{color: theme.text, fontSize: 16, marginTop: spacing.xs}}>2. {profile.contact2Name || extended?.emergencyName2} ({profile.contact2Phone || extended?.emergencyPhone2})</Text>
            )}
            {profile.hospitalName && (
              <Text style={{color: theme.text, fontSize: 16, marginTop: spacing.xs}}>Arts: {profile.hospitalName} ({profile.doctorPhone})</Text>
            )}
            <Text style={{ color: theme.textDim, fontSize: 10, marginTop: spacing.sm }}>Bewerk contacten via Profiel instellingen</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  </Modal>
  );
};

export default MedicalScreen;
