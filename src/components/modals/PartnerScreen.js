import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';

const PartnerScreen = ({ visible, onClose, text, name }) => (
  <Modal visible={visible} animationType="fade" transparent={false}>
    <SafeAreaView style={{flex:1, backgroundColor: theme.partnerBg}}>
      <View style={{padding: 20, alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={onClose} style={{padding: 10, backgroundColor:'rgba(255,255,255,0.1)', borderRadius: 20}}>
          <Feather name="x" size={32} color={theme.partnerText} />
        </TouchableOpacity>
      </View>
      <View style={{flex:1, justifyContent:'center', alignItems:'center', padding: 30}}>
        <Feather name="message-circle" size={60} color={theme.primary} style={{marginBottom: 20}} />
        <Text style={{fontSize: 28, fontWeight: 'bold', color: theme.partnerText, textAlign: 'center', marginBottom: 10}}>
          Hoi, ik ben {name}
        </Text>
        <Text style={{fontSize: 20, fontWeight: '600', color: theme.textDim, textAlign: 'center', marginBottom: 30}}>
          En ik praat via deze app
        </Text>
        <View style={{backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16}}>
          <Text style={{fontSize: 18, color: '#E0F2FE', textAlign: 'center', lineHeight: 28}}>
            {text || "Ik heb afasie (moeite met taal). Mijn verstand is helder. Geef me even de tijd om te typen."}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  </Modal>
);

export default PartnerScreen;
