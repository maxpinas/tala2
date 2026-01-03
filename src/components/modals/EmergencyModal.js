import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '../../theme';
import styles from '../../styles';

const FullScreenHelp = ({ visible, onClose }) => (
    <Modal visible={visible} animationType="slide" transparent={false}>
        <SafeAreaView style={{flex:1, backgroundColor: '#FFF000'}}>
             <View style={{flex:1, justifyContent:'center', alignItems:'center', padding: spacing.xl}}>
                 <View style={{padding: spacing.xl, backgroundColor: theme.danger, borderRadius: borderRadius.lg, marginBottom: spacing.xxl}}>
                     <Feather name="alert-triangle" size={80} color={theme.textInverse} />
                 </View>
                 <Text style={{fontSize: 40, fontWeight:'900', textAlign:'center', marginBottom: spacing.xl, color: theme.text}}>IK HEB HULP NODIG</Text>
                 <Text style={{fontSize: 30, fontWeight:'bold', textAlign:'center', color: theme.danger}}>BEL 112</Text>
             </View>
             <TouchableOpacity style={{position:'absolute', top: 50, right: 30, backgroundColor: theme.surface, padding: spacing.md, borderRadius: borderRadius.full}} onPress={onClose}>
                 <Feather name="x" size={40} color={theme.text} />
             </TouchableOpacity>
        </SafeAreaView>
    </Modal>
);

const EmergencyModal = ({ visible, onClose, profile, extended, onTriggerPopup, onShowMedical }) => {
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{flex:1, backgroundColor: theme.bg}}>
        <FullScreenHelp visible={showHelp} onClose={() => setShowHelp(false)} />
        
        <View style={{padding: spacing.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.danger}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Feather name="alert-triangle" size={28} color={theme.textInverse} />
            <Text style={{color: theme.textInverse, fontSize: 24, fontWeight: '900', marginLeft: spacing.md}}>NOOD</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={{padding: spacing.sm, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: borderRadius.full}}>
            <Feather name="x" size={28} color={theme.textInverse} />
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={{padding: spacing.xl}}>
            <View style={{backgroundColor: theme.surface, padding: spacing.lg, borderRadius: borderRadius.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: theme.surfaceHighlight}}>
              <Text style={{color: theme.textDim, fontSize: 12, fontWeight: 'bold', marginBottom: spacing.xs}}>PERSOON</Text>
              <Text style={{color: theme.text, fontSize: 20, fontWeight: 'bold', marginBottom: spacing.xs}}>{profile.name}</Text>
              <Text style={{color: theme.text, fontSize: 16}}>{profile.address || extended?.address || "Adres onbekend"}</Text>
            </View>
            
            <TouchableOpacity style={{backgroundColor: theme.danger, padding: spacing.xl, borderRadius: borderRadius.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md}} onPress={() => onTriggerPopup("NOOD", "Belt 112... (Simulatie)", "danger")}>
              <Feather name="phone-call" size={28} color={theme.textInverse} />
              <Text style={{color: theme.textInverse, fontSize: 24, fontWeight: '900', marginLeft: spacing.md}}>BEL 112</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={{backgroundColor: theme.warning, padding: spacing.lg, borderRadius: borderRadius.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md}} onPress={() => setShowHelp(true)}>
                <Feather name="eye" size={28} color={theme.text}/>
                <Text style={{color: theme.text, fontSize: 18, fontWeight: 'bold', marginLeft: spacing.md}}>LAAT HULP SCHERM ZIEN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{backgroundColor: theme.primary, padding: spacing.lg, borderRadius: borderRadius.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl}} onPress={() => { onClose(); if(onShowMedical) onShowMedical(); }}>
                <Feather name="heart" size={28} color={theme.textInverse}/>
                <Text style={{color: theme.textInverse, fontSize: 18, fontWeight: 'bold', marginLeft: spacing.md}}>TOON ARTS INFORMATIE</Text>
            </TouchableOpacity>

            <Text style={{color: theme.textDim, fontSize: 12, fontWeight: 'bold', marginBottom: spacing.md}}>SNELKEUZE CONTACTEN</Text>
            
            <View style={{gap: spacing.md}}>
                <TouchableOpacity style={{backgroundColor: theme.surface, padding: spacing.lg, borderRadius: borderRadius.lg, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.surfaceHighlight}} onPress={() => onTriggerPopup("Bellen", `Belt ${profile.partnerName}...`, "info")}>
                  <View style={{width: 48, height: 48, borderRadius: borderRadius.full, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md}}>
                    <Feather name="heart" size={24} color={theme.textInverse} />
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{color: theme.text, fontSize: 16, fontWeight: 'bold'}}>{profile.partnerName || "Partner"}</Text>
                    <Text style={{color: theme.textDim, fontSize: 14}}>{profile.partnerPhone}</Text>
                  </View>
                  <Feather name="phone" size={20} color={theme.primary} />
                </TouchableOpacity>
                
                {(profile.contact2Name || extended?.emergencyName2) && (
                  <TouchableOpacity style={{backgroundColor: theme.surface, padding: spacing.lg, borderRadius: borderRadius.lg, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.surfaceHighlight}} onPress={() => onTriggerPopup("Bellen", `Belt ${profile.contact2Name || extended?.emergencyName2}...`, "info")}>
                    <View style={{width: 48, height: 48, borderRadius: borderRadius.full, backgroundColor: theme.accent, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md}}>
                      <Feather name="user-plus" size={24} color={theme.textInverse} />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={{color: theme.text, fontSize: 16, fontWeight: 'bold'}}>{profile.contact2Name || extended?.emergencyName2}</Text>
                      <Text style={{color: theme.textDim, fontSize: 14}}>{profile.contact2Phone || extended?.emergencyPhone2}</Text>
                    </View>
                    <Feather name="phone" size={20} color={theme.primary} />
                  </TouchableOpacity>
                )}
                
                {profile.hospitalName && (
                  <TouchableOpacity style={{backgroundColor: theme.surface, padding: spacing.lg, borderRadius: borderRadius.lg, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.surfaceHighlight}} onPress={() => onTriggerPopup("Bellen", `Belt ${profile.hospitalName}...`, "info")}>
                    <View style={{width: 48, height: 48, borderRadius: borderRadius.full, backgroundColor: theme.danger, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md}}>
                      <Feather name="activity" size={24} color={theme.textInverse} />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={{color: theme.text, fontSize: 16, fontWeight: 'bold'}}>{profile.hospitalName}</Text>
                      <Text style={{color: theme.textDim, fontSize: 14}}>{profile.doctorPhone}</Text>
                    </View>
                    <Feather name="phone" size={20} color={theme.primary} />
                  </TouchableOpacity>
                )}
            </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default EmergencyModal;
