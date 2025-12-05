import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from '../../styles';

const FullScreenShow = ({ text, onClose }) => (
  <Modal animationType="fade" visible={true}>
    <View style={styles.fullScreenContainer}>
      <TouchableOpacity style={styles.fullScreenClose} onPress={onClose}>
        <Feather name="x" size={32} color="#FFF" />
        <Text style={{color:'#FFF', marginTop:4}}>Sluiten</Text>
      </TouchableOpacity>
      <View style={styles.fullScreenContent}>
        <Text style={styles.fullScreenText}>{text}</Text>
      </View>
    </View>
  </Modal>
);

export default FullScreenShow;
