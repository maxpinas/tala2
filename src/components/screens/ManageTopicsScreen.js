import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useStyles } from '../../styles';

const ManageTopicsScreen = ({ onClose, categories, setCategories }) => {
    const { theme } = useTheme();
    const styles = useStyles();
    // Filter out Persoonlijk and Aangepast - they are not shown in the interface anymore
    const HIDDEN_CATEGORIES = ['Persoonlijk', 'Aangepast'];
    const [catList, setCatList] = useState(
        Object.keys(categories)
            .filter(k => !HIDDEN_CATEGORIES.includes(k))
            .map(k => ({ key: k, originalKey: k, ...categories[k] }))
    );
    const [newCatName, setNewCatName] = useState("");

    const saveChanges = () => {
        const newCatObj = {};
        // Keep hidden categories intact
        HIDDEN_CATEGORIES.forEach(hiddenKey => {
            if (categories[hiddenKey]) {
                newCatObj[hiddenKey] = categories[hiddenKey];
            }
        });
        // Add visible categories
        catList.forEach(c => {
            newCatObj[c.key] = { icon: c.icon, items: c.items };
        });
        setCategories(newCatObj);
        onClose();
    };

    const move = (index, dir) => {
        const newArr = [...catList];
        const newIndex = index + dir;
        if(newIndex >= 0 && newIndex < newArr.length){
            [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
            setCatList(newArr);
        }
    };
    
    const updateName = (index, txt) => {
        const newArr = [...catList];
        newArr[index] = { ...newArr[index], key: txt };
        setCatList(newArr);
    };
    
    const remove = (index) => {
        setCatList(catList.filter((_, i) => i !== index));
    };
    
    const add = () => {
        if(!newCatName.trim()) return;
        setCatList([...catList, { key: newCatName.trim(), originalKey: newCatName.trim(), icon: 'message-circle', items: [] }]);
        setNewCatName("");
    };

    return (
        <Modal visible={true} animationType="slide">
            <SafeAreaView style={{flex: 1, backgroundColor: theme.bg}}>
                <View style={styles.header}>
                    <Text style={styles.catHeaderSmall}>Onderwerpen Beheer</Text>
                    <TouchableOpacity onPress={saveChanges}>
                        <Text style={{color: theme.primary, fontWeight:'bold'}}>Opslaan & Sluiten</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
                    <ScrollView contentContainerStyle={{padding: 24}}>
                        <View style={{flexDirection: 'row', marginBottom: 20}}>
                            <TextInput 
                                style={[styles.inputField, {flex: 1, marginBottom: 0}]} 
                                placeholder="Nieuw onderwerp..." 
                                placeholderTextColor={theme.textDim} 
                                value={newCatName} 
                                onChangeText={setNewCatName} 
                            />
                            <TouchableOpacity style={[styles.addBtnSmallRound, {marginLeft: 10}]} onPress={add}>
                                <Feather name="plus" size={24} color="#000"/>
                            </TouchableOpacity>
                        </View>
                        {catList.map((item, i) => (
                             <View key={i} style={[styles.listItemRow, {backgroundColor: '#3D3D3D'}]}>
                                 <View style={{flex: 1}}>
                                     <TextInput 
                                         style={{color: '#FFF', fontSize: 16, fontWeight: 'bold'}} 
                                         value={item.key} 
                                         onChangeText={(t) => updateName(i, t)} 
                                     />
                                 </View>
                                 <View style={{flexDirection: 'row', gap: 15, marginLeft: 10}}>
                                     <TouchableOpacity onPress={() => move(i, -1)} disabled={i===0}>
                                         <Feather name="arrow-up" size={20} color={i===0 ? '#5D5D5D' : '#A0A0A0'}/>
                                     </TouchableOpacity>
                                     <TouchableOpacity onPress={() => move(i, 1)} disabled={i===catList.length-1}>
                                         <Feather name="arrow-down" size={20} color={i===catList.length-1 ? '#5D5D5D' : '#A0A0A0'}/>
                                     </TouchableOpacity>
                                     <TouchableOpacity onPress={() => remove(i)}>
                                         <Feather name="trash-2" size={20} color="#FF6B6B"/>
                                     </TouchableOpacity>
                                 </View>
                             </View>
                        ))}
                        <View style={{height: 100}}/>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
};

export default ManageTopicsScreen;
