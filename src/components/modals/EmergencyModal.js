import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';

const FullScreenHelp = ({ visible, onClose }) => (
    <Modal visible={visible} animationType="slide" transparent={false}>
        <SafeAreaView style={{flex:1, backgroundColor: '#FFF000'}}>
             <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:20}}>
                 <View style={{padding: 20, backgroundColor: 'red', borderRadius: 20, marginBottom: 40}}>
                     <Feather name="alert-triangle" size={80} color="#FFF" />
                 </View>
                 <Text style={{fontSize: 40, fontWeight:'900', textAlign:'center', marginBottom: 20}}>IK HEB HULP NODIG</Text>
                 <Text style={{fontSize: 30, fontWeight:'bold', textAlign:'center', color: 'red'}}>BEL 112</Text>
             </View>
             <TouchableOpacity style={{position:'absolute', top: 50, right: 30, backgroundColor:'rgba(0,0,0,0.1)', padding:10, borderRadius:20}} onPress={onClose}>
                 <Feather name="x" size={40} color="#000" />
             </TouchableOpacity>
        </SafeAreaView>
    </Modal>
);

const EmergencyModal = ({ visible, onClose, profile, extended, onTriggerPopup }) => {
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.emergencyContainer}>
        <FullScreenHelp visible={showHelp} onClose={() => setShowHelp(false)} />
        
        <View style={styles.emergencyHeader}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Feather name="alert-triangle" size={32} color="#FFF" />
            <Text style={styles.emergencyTitle}>NOOD</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={{padding: 20}}>
            <View style={styles.emergencyCard}>
              <Text style={styles.emLabel}>PERSOON</Text>
              <Text style={styles.emValue}>{profile.name}</Text>
              <Text style={styles.emValueSub}>{profile.address || extended?.address || "Adres onbekend"}</Text>
            </View>
            
            <TouchableOpacity style={styles.call112Btn} onPress={() => onTriggerPopup("NOOD", "Belt 112... (Simulatie)", "danger")}>
              <Text style={styles.callText}>BEL 112</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.call112Btn, {backgroundColor: theme.warning, marginTop: 10}]} onPress={() => setShowHelp(true)}>
                <Feather name="eye" size={28} color="#000"/>
                <Text style={[styles.callText, {color:'#000'}]}>LAAT HULP SCHERM ZIEN</Text>
            </TouchableOpacity>

            <View style={{gap: 10, marginTop: 20}}>
                <TouchableOpacity style={styles.callBtnSmall} onPress={() => onTriggerPopup("Bellen", `Belt ${profile.partnerName}...`, "info")}>
                  <Feather name="heart" size={24} color="#FFF" />
                  <Text style={styles.callSmallText}>{profile.partnerName || "Partner"} ({profile.partnerPhone})</Text>
                </TouchableOpacity>
                
                {(profile.contact2Name || extended?.emergencyName2) && (
                  <TouchableOpacity style={styles.callBtnSmall} onPress={() => onTriggerPopup("Bellen", `Belt ${profile.contact2Name || extended?.emergencyName2}...`, "info")}>
                    <Feather name="user-plus" size={24} color="#FFF" />
                    <Text style={styles.callSmallText}>{profile.contact2Name || extended?.emergencyName2} ({profile.contact2Phone || extended?.emergencyPhone2})</Text>
                  </TouchableOpacity>
                )}
                
                {profile.hospitalName && (
                  <TouchableOpacity style={[styles.callBtnSmall, {backgroundColor: theme.surfaceHighlight}]} onPress={() => onTriggerPopup("Bellen", `Belt ${profile.hospitalName}...`, "info")}>
                    <Feather name="activity" size={24} color="#FFF" />
                    <Text style={styles.callSmallText}>{profile.hospitalName} ({profile.doctorPhone})</Text>
                  </TouchableOpacity>
                )}
            </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default EmergencyModal;
