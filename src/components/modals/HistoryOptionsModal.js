import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';

const HistoryOptionsModal = ({ visible, item, onClose, onAction }) => (
    <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.selectorContainer}>
                <View style={styles.selectorHeader}>
                    <Text style={styles.selectorTitle}>Kies een actie</Text>
                    <TouchableOpacity onPress={onClose}>
                      <Feather name="x" size={24} color="#FFF"/>
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor: theme.surfaceHighlight, padding: 16, borderRadius: 12, marginBottom: 20}}>
                     <Text style={{color: '#FFF', fontStyle:'italic', fontSize: 18}}>"{item?.text}"</Text>
                </View>
                <TouchableOpacity style={styles.menuItem} onPress={() => onAction('speak')}>
                    <Feather name="volume-2" size={24} color={theme.primary} />
                    <Text style={styles.menuItemTitle}>Opnieuw uitspreken</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => onAction('copy')}>
                    <Feather name="copy" size={24} color={theme.primary} />
                    <Text style={styles.menuItemTitle}>Kopiëren</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => onAction('show')}>
                    <Feather name="monitor" size={24} color={theme.primary} />
                    <Text style={styles.menuItemTitle}>Groot tonen</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

export default HistoryOptionsModal;
