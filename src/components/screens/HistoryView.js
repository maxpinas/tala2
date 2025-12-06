import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';

const CLEAR_OPTIONS = [
  { id: 'today', label: 'Vandaag', icon: 'sun' },
  { id: 'week', label: 'Deze week', icon: 'calendar' },
  { id: 'month', label: 'Deze maand', icon: 'calendar' },
  { id: 'all', label: 'Alles wissen', icon: 'trash-2' },
];

const HistoryView = ({ history, onBack, onSelect, onClear }) => {
  const [showClearModal, setShowClearModal] = useState(false);

  const handleClear = (period) => {
    onClear(period);
    setShowClearModal(false);
  };

  return (
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ flexDirection: 'row' }}>
          <Feather name="arrow-left" size={20} color={theme.textDim} />
          <Text style={{ color: theme.textDim, marginLeft: 10 }}>Terug</Text>
        </TouchableOpacity>
        {history.length > 0 && (
          <TouchableOpacity 
            onPress={() => setShowClearModal(true)} 
            style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}
          >
            <Feather name="trash-2" size={18} color={theme.accent} />
            <Text style={{ color: theme.accent, marginLeft: 6, fontSize: 14 }}>Wissen</Text>
          </TouchableOpacity>
        )}
      </View>
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

      {/* Clear History Modal */}
      <Modal visible={showClearModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '600' }}>Geschiedenis wissen</Text>
              <TouchableOpacity onPress={() => setShowClearModal(false)}>
                <Feather name="x" size={24} color={theme.textDim} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: theme.textDim, marginBottom: 20, fontSize: 14 }}>
              Kies welke periode je wilt wissen:
            </Text>
            {CLEAR_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleClear(option.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: option.id === 'all' ? 'rgba(239, 68, 68, 0.1)' : theme.card,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              >
                <Feather 
                  name={option.icon} 
                  size={20} 
                  color={option.id === 'all' ? '#EF4444' : theme.accent} 
                />
                <Text style={{ 
                  color: option.id === 'all' ? '#EF4444' : theme.text, 
                  marginLeft: 12, 
                  fontSize: 16,
                  fontWeight: option.id === 'all' ? '600' : '400'
                }}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HistoryView;
