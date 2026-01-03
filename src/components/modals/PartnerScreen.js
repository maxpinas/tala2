import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius } from '../../theme';

const PartnerScreen = ({ visible, onClose, text, name }) => {
  const { theme } = useTheme();
  
  return (
  <Modal visible={visible} animationType="fade" transparent={false}>
    <SafeAreaView style={{flex:1, backgroundColor: theme.bg}}>
      <View style={{padding: spacing.xl, alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={onClose} style={{padding: spacing.md, backgroundColor: theme.surface, borderRadius: borderRadius.full, borderWidth: 1, borderColor: theme.surfaceHighlight}}>
          <Feather name="x" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>
      <View style={{flex:1, justifyContent:'center', alignItems:'center', padding: spacing.xxl}}>
        <View style={{width: 100, height: 100, borderRadius: borderRadius.full, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl}}>
          <Feather name="message-circle" size={48} color={theme.textInverse} />
        </View>
        <Text style={{fontSize: 28, fontWeight: 'bold', color: theme.text, textAlign: 'center', marginBottom: spacing.sm}}>
          Hoi, ik ben {name}
        </Text>
        <Text style={{fontSize: 18, fontWeight: '500', color: theme.textDim, textAlign: 'center', marginBottom: spacing.xl}}>
          En ik praat via deze app
        </Text>
        <View style={{backgroundColor: theme.surface, padding: spacing.xl, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: theme.surfaceHighlight, width: '100%'}}>
          <Text style={{fontSize: 18, color: theme.text, textAlign: 'center', lineHeight: 28}}>
            {text || "Ik heb afasie (moeite met taal). Mijn verstand is helder. Geef me even de tijd om te typen."}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  </Modal>
  );
};

export default PartnerScreen;
