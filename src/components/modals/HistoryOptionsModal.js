import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius } from '../../theme';
import { useStyles } from '../../styles';

const HistoryOptionsModal = ({ visible, item, onClose, onAction }) => {
    const { theme } = useTheme();
    const styles = useStyles();
    
    return (
        <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.selectorContainer}>
                <View style={styles.selectorHeader}>
                    <Text style={styles.selectorTitle}>Kies een actie</Text>
                    <TouchableOpacity onPress={onClose} style={{padding: spacing.sm, backgroundColor: theme.surface, borderRadius: borderRadius.full}}>
                      <Feather name="x" size={24} color={theme.text}/>
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor: theme.surface, padding: spacing.lg, borderRadius: borderRadius.md, marginBottom: spacing.xl, borderWidth: 1, borderColor: theme.surfaceHighlight}}>
                     <Text style={{color: theme.text, fontStyle:'italic', fontSize: 18}}>"{item?.text}"</Text>
                </View>
                <TouchableOpacity style={styles.menuItem} onPress={() => onAction('speak')}>
                    <View style={{width: 44, height: 44, borderRadius: borderRadius.full, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md}}>
                      <Feather name="volume-2" size={22} color={theme.text} />
                    </View>
                    <Text style={[styles.menuItemTitle, {marginLeft: 0}]}>Opnieuw uitspreken</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => onAction('copy')}>
                    <View style={{width: 44, height: 44, borderRadius: borderRadius.full, backgroundColor: theme.categories.thuis, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md}}>
                      <Feather name="copy" size={22} color={theme.text} />
                    </View>
                    <Text style={[styles.menuItemTitle, {marginLeft: 0}]}>Kopiëren</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => onAction('show')}>
                    <View style={{width: 44, height: 44, borderRadius: borderRadius.full, backgroundColor: theme.accent, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md}}>
                      <Feather name="monitor" size={22} color={theme.textInverse} />
                    </View>
                    <Text style={[styles.menuItemTitle, {marginLeft: 0}]}>Groot tonen</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
    );
};

export default HistoryOptionsModal;
