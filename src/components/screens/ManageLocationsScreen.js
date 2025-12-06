import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';

const ListManagerScreenEmbedded = ({ items, onUpdate, type = 'object' }) => {
    const [newItemText, setNewItemText] = useState("");
    
    const move = (index, direction) => {
        const newArr = [...items];
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < newArr.length) {
            [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
            onUpdate(newArr);
        }
    };

    const updateName = (index, text) => {
        const newArr = [...items];
        if (type === 'object') newArr[index] = { ...newArr[index], label: text };
        else newArr[index] = text;
        onUpdate(newArr);
    };

    const remove = (index) => {
        onUpdate(items.filter((_, i) => i !== index));
    };

    const add = () => {
        if (!newItemText.trim()) return;
        if (type === 'object') {
            onUpdate([...items, { id: Date.now().toString(), label: newItemText.trim(), icon: 'circle' }]);
        } else {
            onUpdate([...items, newItemText.trim()]);
        }
        setNewItemText("");
    };

    return (
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
            {items.map((item, i) => (
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
                        <TouchableOpacity onPress={() => move(i, 1)} disabled={i === items.length - 1}>
                            <Feather name="arrow-down" size={20} color={i === items.length - 1 ? theme.surfaceHighlight : theme.textDim} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => remove(i)}>
                            <Feather name="trash-2" size={20} color={theme.danger} />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            <View style={{height: 100}}/>
        </ScrollView>
        </KeyboardAvoidingView>
    );
};

const ManageLocationsScreen = ({ onClose, contexts, setContexts }) => {
    return (
        <Modal visible={true} animationType="slide">
            <SafeAreaView style={{flex: 1, backgroundColor: theme.bg}}>
                <View style={styles.header}>
                    <Text style={styles.catHeaderSmall}>Locaties</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={{color: theme.primary, fontWeight:'bold'}}>Klaar</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{padding: 16, paddingBottom: 0, color: theme.textDim, fontSize: 14}}>
                    Voeg hier de plaatsen toe waar je veel bent.
                </Text>
                <ListManagerScreenEmbedded items={contexts} onUpdate={setContexts} type="object" />
            </SafeAreaView>
        </Modal>
    );
};

export default ManageLocationsScreen;
