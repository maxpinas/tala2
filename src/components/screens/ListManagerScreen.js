import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';

const ListManagerScreen = ({ title, items, onUpdate, onClose, type = 'object' }) => {
    // type 'object' expects {id, label, icon}, type 'string' expects "string"
    const [localItems, setLocalItems] = useState(items);
    const [newItemText, setNewItemText] = useState("");

    const move = (index, direction) => {
        const newArr = [...localItems];
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < newArr.length) {
            [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
            setLocalItems(newArr);
        }
    };

    const updateName = (index, text) => {
        const newArr = [...localItems];
        if (type === 'object') newArr[index] = { ...newArr[index], label: text };
        else newArr[index] = text;
        setLocalItems(newArr);
    };

    const remove = (index) => {
        setLocalItems(localItems.filter((_, i) => i !== index));
    };

    const add = () => {
        if (!newItemText.trim()) return;
        if (type === 'object') {
            setLocalItems([...localItems, { id: Date.now().toString(), label: newItemText.trim(), icon: 'circle' }]);
        } else {
            setLocalItems([...localItems, newItemText.trim()]);
        }
        setNewItemText("");
    };

    const handleSave = () => {
        onUpdate(localItems);
        onClose();
    };

    return (
        <Modal visible={true} animationType="slide">
            <SafeAreaView style={{flex: 1, backgroundColor: theme.bg}}>
                <View style={styles.header}>
                    <Text style={styles.catHeaderSmall}>{title}</Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={{color: theme.primary, fontWeight:'bold'}}>Opslaan & Sluiten</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
                <ScrollView contentContainerStyle={{padding: 24}}>
                    <View style={{flexDirection: 'row', marginBottom: 20}}>
                        <TextInput 
                            style={[styles.inputField, {flex: 1, marginBottom: 0}]} 
                            placeholder="Nieuw item..." 
                            placeholderTextColor={theme.textDim} 
                            value={newItemText} 
                            onChangeText={setNewItemText} 
                        />
                        <TouchableOpacity style={[styles.addBtnSmallRound, {marginLeft: 10}]} onPress={add}>
                            <Feather name="plus" size={24} color="#000"/>
                        </TouchableOpacity>
                    </View>
                    {localItems.map((item, i) => (
                        <View key={i} style={styles.listItemRow}>
                            <View style={{flex: 1}}>
                                <TextInput 
                                    style={{color: '#FFF', fontSize: 16}} 
                                    value={type === 'object' ? item.label : item} 
                                    onChangeText={(t) => updateName(i, t)} 
                                />
                            </View>
                            <View style={{flexDirection: 'row', gap: 15, marginLeft: 10}}>
                                <TouchableOpacity onPress={() => move(i, -1)} disabled={i === 0}>
                                    <Feather name="arrow-up" size={20} color={i === 0 ? theme.surfaceHighlight : theme.textDim} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => move(i, 1)} disabled={i === localItems.length - 1}>
                                    <Feather name="arrow-down" size={20} color={i === localItems.length - 1 ? theme.surfaceHighlight : theme.textDim} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => remove(i)}>
                                    <Feather name="trash-2" size={20} color={theme.danger} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
};

export default ListManagerScreen;
