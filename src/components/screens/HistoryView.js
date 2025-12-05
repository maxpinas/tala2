import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';

const HistoryView = ({ history, onBack, onSelect }) => (
  <View style={styles.section}>
    <TouchableOpacity onPress={onBack} style={{flexDirection:'row', marginBottom:20}}>
      <Feather name="arrow-left" size={20} color={theme.textDim}/>
      <Text style={{color:theme.textDim, marginLeft:10}}>Terug</Text>
    </TouchableOpacity>
    <Text style={styles.catHeaderBig}>Geschiedenis</Text>
    <ScrollView>
      {history.length === 0 ? (
        <Text style={styles.emptyText}>Nog niets gezegd vandaag.</Text>
      ) : (
        history.map((h, i) => (
          <TouchableOpacity key={i} style={styles.historyItem} onPress={() => onSelect(h)}>
            <Text style={styles.historyTime}>{h.time}</Text>
            <Text style={styles.historyText}>{h.text}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  </View>
);

export default HistoryView;
