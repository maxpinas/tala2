import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

// --- THEMA ---
const theme = {
  bg: '#0B1120',
  surface: '#1E293B',
  surfaceHighlight: '#334155',
  text: '#F1F5F9',
  textDim: '#94A3B8',
  textHighContrast: '#FFFFFF',
  primary: '#06B6D4', 
  accent: '#F43F5E',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  partnerBg: '#0F172A',
  partnerText: '#E0F2FE',
  emergencyBg: '#450A0A',
  emergencyCard: '#7F1D1D',
  catPeople: '#EAB308',
  catAction: '#22C55E',
  catThing: '#3B82F6',
  catPlace: '#F97316',
};

// --- DATA ---
const WORD_CATEGORIES = {
  WIE:  ["Ik", "Jij", "Wij", "Zij", "De dokter", "Iemand", "Bezoek"],
  DOE:  ["Wil", "Ga", "Heb", "Ben", "Moet", "Kan", "Vind", "Zie"],
  WAT:  ["Koffie", "Water", "Eten", "Pijn", "Hulp", "Rust", "Huis", "Auto"],
  WAAR: ["Hier", "Daar", "Thuis", "Buiten", "Boven", "Nu", "Straks", "Morgen"]
};

const INITIAL_CATEGORIES = {
  Persoonlijk: { icon: 'user', items: [] }, 
  Sociaal: { icon: 'smile', items: ["Hoe is het?", "Leuk je te zien"] },
  Werk: { icon: 'briefcase', items: ["Ik zit in een meeting", "Even overleggen"] },
  Thuis: { icon: 'home', items: ["Ik heb honger", "Ik ga slapen"] },
  Medisch: { icon: 'activity', items: ["Ik heb pijn", "Medicatie tijd"] },
};

const DEFAULT_CONTEXTS = [
  { id: 'thuis', label: 'Thuis', icon: 'home' },
  { id: 'dokter', label: 'Dokter', icon: 'activity' },
  { id: 'winkel', label: 'Winkel', icon: 'shopping-cart' },
];

const DEFAULT_QUICK = ["Ja", "Nee", "Moment", "Misschien"];

const EXTENDED_SECTIONS = [
  { id: 'intro', title: 'Introductie' },
  { id: 'personal', title: '1. Persoonlijk' },
  { id: 'family', title: '2. Familie' },
  { id: 'medical', title: '3. Medisch' },
  { id: 'daily', title: '4. Dagelijks' },
  { id: 'emergency', title: '9. Nood' },
];

// --- AI LOGICA ---
const getAISuggestions = (currentSentence) => {
  const lastWord = currentSentence[currentSentence.length - 1]?.toLowerCase();
  if (!lastWord) return ["Ik", "Mag ik", "Hoe gaat", "Waar is"];
  switch (lastWord) {
    case 'ik': return ["wil", "ben", "heb", "ga"];
    case 'jij': return ["bent", "moet", "kunt", "wilt"];
    case 'wil': return ["graag", "niet", "even", "naar huis"];
    case 'heb': return ["pijn", "honger", "dorst", "het koud"];
    default: return ["graag", "niet", "nu", "even"];
  }
};

const getAIFullSentences = (sentenceArray) => {
  const base = sentenceArray.join(' ');
  if (!base) return ["Ik wil graag koffie.", "Ik heb hulp nodig.", "Hoe gaat het?"];
  if (base.includes("pijn")) return [base + " in mijn hoofd.", base + ", bel de dokter.", base + ", ik wil liggen."];
  if (base.includes("wil")) return [base + " naar huis.", base + " wat eten.", base + " even rusten."];
  return [base + " alstublieft.", base + " en bedankt.", base + ", snap je?"];
};

// --- COMPONENTS ---

const CustomPopup = ({ visible, title, message, onClose, type = 'info' }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={[styles.popupCard, type === 'danger' && {borderColor: theme.danger}]}>
        <View style={{alignItems: 'center', marginBottom: 15}}>
           <View style={[styles.popupIcon, {backgroundColor: type === 'danger' ? theme.danger : theme.primary}]}>
             <Feather name={type === 'danger' ? "alert-circle" : type === 'copy' ? "copy" : "volume-2"} size={32} color="#FFF" />
           </View>
        </View>
        <Text style={styles.popupTitle}>{title}</Text>
        <Text style={styles.popupMessage}>{message}</Text>
        <TouchableOpacity style={styles.popupBtn} onPress={onClose}>
          <Text style={styles.popupBtnText}>Sluiten</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const SimpleInputModal = ({ visible, title, placeholder, onSave, onClose }) => {
    const [val, setVal] = useState("");
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.selectorContainer}>
                    <View style={styles.selectorHeader}>
                        <Text style={styles.selectorTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}><Feather name="x" size={24} color="#FFF"/></TouchableOpacity>
                    </View>
                    <TextInput 
                        style={styles.inputField} 
                        placeholder={placeholder} 
                        placeholderTextColor={theme.textDim}
                        value={val}
                        onChangeText={setVal}
                        autoFocus
                    />
                    <TouchableOpacity style={styles.saveBtn} onPress={() => { if(val.trim()){ onSave(val.trim()); setVal(""); onClose(); } }}>
                        <Text style={styles.saveBtnText}>Toevoegen</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

// Generic List Manager for Locations, Partners, Quick Responses
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
                    <TouchableOpacity onPress={handleSave}><Text style={{color: theme.primary, fontWeight:'bold'}}>Opslaan & Sluiten</Text></TouchableOpacity>
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

const EditToolbar = ({ word, onMoveLeft, onMoveRight, onDelete, onDeselect }) => (
  <View style={styles.editToolbar}>
    <View style={styles.editInfo}><Text style={styles.editLabel}>Geselecteerd: </Text><Text style={styles.editWord}>"{word}"</Text></View>
    <View style={styles.editActions}>
       <TouchableOpacity style={styles.editBtn} onPress={onMoveLeft}><Feather name="arrow-left" size={24} color="#FFF" /></TouchableOpacity>
       <TouchableOpacity style={styles.editBtn} onPress={onMoveRight}><Feather name="arrow-right" size={24} color="#FFF" /></TouchableOpacity>
       <TouchableOpacity style={[styles.editBtn, {backgroundColor: theme.danger}]} onPress={onDelete}><Feather name="trash-2" size={20} color="#FFF" /></TouchableOpacity>
       <TouchableOpacity style={[styles.editBtn, {backgroundColor: theme.surfaceHighlight}]} onPress={onDeselect}><Feather name="check" size={20} color={theme.success} /></TouchableOpacity>
    </View>
  </View>
);

const ListEditor = ({ items, onItemAdd, onItemRemove, placeholder, title }) => {
  const [text, setText] = useState("");
  return (
    <View style={{marginBottom: 20}}>
      <Text style={styles.inputLabel}>{title}</Text>
      {items.map((item, i) => (
        <View key={i} style={styles.listItemRow}><Text style={{color: '#FFF', flex: 1}}>{typeof item === 'object' ? item.name : item}</Text><TouchableOpacity onPress={() => onItemRemove(i)}><Feather name="trash-2" size={18} color={theme.danger} /></TouchableOpacity></View>
      ))}
      <View style={{flexDirection: 'row', marginTop: 8}}>
         <TextInput style={[styles.inputField, {marginBottom: 0, flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0}]} value={text} onChangeText={setText} placeholder={placeholder} placeholderTextColor={theme.textDim} />
         <TouchableOpacity style={{backgroundColor: theme.surfaceHighlight, justifyContent:'center', padding: 16, borderTopRightRadius: 12, borderBottomRightRadius: 12}} onPress={() => { if(text) { onItemAdd(text); setText(""); } }}><Feather name="plus" size={24} color={theme.primary} /></TouchableOpacity>
      </View>
    </View>
  );
};

const SmartSentenceBuilder = ({ initialSentence, mode = 'SENTENCE', onSave, onCancel }) => {
  const [sentence, setSentence] = useState([]);
  const [builderTab, setBuilderTab] = useState('WIE');
  const [customInput, setCustomInput] = useState("");
  const [selIdx, setSelIdx] = useState(null); 
  const [showAiModal, setShowAiModal] = useState(false);
  
  useEffect(() => {
      if(mode === 'ADD_TO_CATEGORY') setSentence([]);
      else setSentence(initialSentence || []);
  }, [mode, initialSentence]);

  const aiSuggestions = getAISuggestions(sentence);
  const aiFullSentences = getAIFullSentences(sentence);
  const addWord = (w) => { setSentence([...sentence, w]); setSelIdx(null); };
  const moveWord = (dir) => { if (selIdx === null) return; const newIdx = selIdx + dir; if (newIdx >= 0 && newIdx < sentence.length) { const newS = [...sentence]; [newS[selIdx], newS[newIdx]] = [newS[newIdx], newS[selIdx]]; setSentence(newS); setSelIdx(newIdx); } };
  const deleteWord = () => { if (selIdx !== null) { setSentence(sentence.filter((_, i) => i !== selIdx)); setSelIdx(null); } };
  const handleSave = () => { const finalSentence = sentence.join(' ') + (customInput ? " " + customInput : ""); if (!finalSentence.trim()) return; onSave(finalSentence.trim()); };
  const addCustomWord = () => { if(customInput.trim()) { addWord(customInput.trim()); setCustomInput(""); } };

  return (
    <View style={styles.builderContainerFull}>
      <Modal visible={showAiModal} transparent animationType="fade"><View style={styles.modalOverlay}><View style={styles.selectorContainer}><View style={styles.selectorHeader}><Text style={styles.selectorTitle}>✨ Bedoel je misschien:</Text><TouchableOpacity onPress={() => setShowAiModal(false)}><Feather name="x" size={24} color="#FFF"/></TouchableOpacity></View>{aiFullSentences.map((s, i) => (<TouchableOpacity key={i} style={styles.aiFullSentenceBtn} onPress={() => { setSentence(s.split(' ')); setShowAiModal(false); }}><Text style={styles.aiFullSentenceText}>{s}</Text><Feather name="chevron-right" size={20} color={theme.textDim} /></TouchableOpacity>))}</View></View></Modal>
      <View style={styles.builderHeader}><Text style={styles.label}>{mode === 'ADD_TO_CATEGORY' ? 'ZIN TOEVOEGEN' : 'ZINSBOUWER'}</Text><View style={{flexDirection:'row'}}><TouchableOpacity onPress={() => setSentence([])} style={{marginRight: 20}}><Text style={{color: theme.warning}}>Wis Alles</Text></TouchableOpacity><TouchableOpacity onPress={onCancel}><Text style={{color: theme.danger}}>Sluiten</Text></TouchableOpacity></View></View>
      <View style={styles.builderPreview}><ScrollView horizontal contentContainerStyle={{alignItems:'center'}}>{sentence.length === 0 && !customInput ? <Text style={{color: theme.textDim, fontSize: 18}}>Tik op woorden...</Text> : null}{sentence.map((w, i) => (<TouchableOpacity key={i} onPress={() => setSelIdx(selIdx === i ? null : i)} style={[styles.builderWordChip, selIdx === i && {backgroundColor: theme.primary}]}><Text style={{color: selIdx === i ? '#000' : '#FFF', fontWeight:'bold', fontSize: 18}}>{w}</Text></TouchableOpacity>))}</ScrollView></View>
      {selIdx !== null && (<EditToolbar word={sentence[selIdx]} onMoveLeft={() => moveWord(-1)} onMoveRight={() => moveWord(1)} onDelete={deleteWord} onDeselect={() => setSelIdx(null)} />)}
      <TouchableOpacity style={styles.aiMagicBtnFull} onPress={() => setShowAiModal(true)}><View style={{flexDirection:'row', alignItems:'center'}}><Feather name="star" size={18} color="#000" /><Text style={styles.aiMagicTextFull}>✨ Maak zin af</Text></View><Feather name="chevron-right" size={18} color="#000" /></TouchableOpacity>
      <View style={{marginBottom: 15, height: 50}}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems:'center'}}><View style={styles.aiBadge}><Feather name="zap" size={12} color="#000" /><Text style={styles.aiBadgeText}>Tips:</Text></View>{aiSuggestions.map((sug, i) => (<TouchableOpacity key={i} style={styles.suggestionBubble} onPress={() => addWord(sug)}><Text style={styles.suggestionText}>{sug}</Text></TouchableOpacity>))}</ScrollView></View>
      <View style={styles.wordTabs}>{Object.keys(WORD_CATEGORIES).map(cat => (<TouchableOpacity key={cat} style={[styles.wordTab, builderTab === cat && {backgroundColor: theme[cat === 'WIE' ? 'catPeople' : cat === 'DOE' ? 'catAction' : cat === 'WAT' ? 'catThing' : 'catPlace']}]} onPress={() => setBuilderTab(cat)}><Text style={[styles.wordTabText, builderTab === cat && {color: '#000'}]}>{cat}</Text></TouchableOpacity>))}</View>
      <View style={{flex: 1}}><View style={styles.coreWordsGrid}>{WORD_CATEGORIES[builderTab].map((word, i) => (<TouchableOpacity key={i} style={styles.coreWordTileLarge} onPress={() => addWord(word)}><Text style={styles.coreWordTextLarge}>{word}</Text></TouchableOpacity>))}</View></View>
      <View style={{flexDirection:'row', alignItems:'center', marginTop: 10, marginBottom: 10}}><TextInput style={styles.builderInputSmall} placeholder="Of typ zelf..." placeholderTextColor={theme.textDim} value={customInput} onChangeText={setCustomInput}/><TouchableOpacity style={styles.addBtnSmallRound} onPress={addCustomWord}><Feather name="plus" size={24} color="#000" /></TouchableOpacity></View>
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveBtnText}>{mode === 'ADD_TO_CATEGORY' ? 'Nieuwe zin toevoegen' : 'Plaats in Balk'}</Text></TouchableOpacity>
    </View>
  );
};

// --- SETTINGS & MANAGERS ---

const SettingsMenuModal = ({ visible, onClose, onNavigate }) => (
  <Modal visible={visible} transparent animationType="slide"><View style={styles.modalOverlay}><View style={styles.selectorContainer}><View style={styles.selectorHeader}><Text style={styles.selectorTitle}>Profiel & Instellingen</Text><TouchableOpacity onPress={onClose}><Feather name="x" size={24} color={theme.text} /></TouchableOpacity></View>
        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('BASIC_SETUP'); }}>
            <View style={{flexDirection:'row', alignItems:'center'}}><View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}><Feather name="user" size={24} color="#000" /></View><Text style={styles.menuItemTitle}>Profiel</Text></View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('EXTENDED_SETUP'); }}>
            <View style={{flexDirection:'row', alignItems:'center'}}><View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}><Feather name="layers" size={24} color="#000" /></View><Text style={styles.menuItemTitle}>Profiel uitgebreid</Text></View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('MANAGE_PEOPLE_LOCATIONS'); }}>
            <View style={{flexDirection:'row', alignItems:'center'}}><View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}><Feather name="map-pin" size={24} color="#000" /></View><Text style={styles.menuItemTitle}>Personen & Locaties</Text></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('MANAGE_QUICK'); }}>
            <View style={{flexDirection:'row', alignItems:'center'}}><View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}><Feather name="zap" size={24} color="#000" /></View><Text style={styles.menuItemTitle}>Snel Reageren</Text></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('TOPIC_MANAGER'); }}>
            <View style={{flexDirection:'row', alignItems:'center'}}><View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}><Feather name="grid" size={24} color="#000" /></View><Text style={styles.menuItemTitle}>Onderwerpen Beheer</Text></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('CUSTOM_TEXTS'); }}>
            <View style={{flexDirection:'row', alignItems:'center'}}><View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}><Feather name="message-square" size={24} color="#000" /></View><Text style={styles.menuItemTitle}>Uitleg Teksten</Text></View>
        </TouchableOpacity>
  </View></View></Modal>
);

const ManagePeopleLocations = ({ onClose, contexts, setContexts, partners, setPartners }) => {
    const [tab, setTab] = useState('PEOPLE');
    return (
        <Modal visible={true} animationType="slide"><SafeAreaView style={{flex: 1, backgroundColor: theme.bg}}>
            <View style={styles.header}>
                <Text style={styles.catHeaderSmall}>Beheer</Text>
                <TouchableOpacity onPress={onClose}><Text style={{color: theme.primary, fontWeight:'bold'}}>Sluiten</Text></TouchableOpacity>
            </View>
            <View style={styles.wordTabs}>
                <TouchableOpacity style={[styles.wordTab, tab === 'PEOPLE' && {borderBottomColor: theme.primary}]} onPress={() => setTab('PEOPLE')}><Text style={[styles.wordTabText, {fontSize: 16, color: tab === 'PEOPLE' ? theme.primary : theme.textDim}]}>Personen</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.wordTab, tab === 'LOCATIONS' && {borderBottomColor: theme.primary}]} onPress={() => setTab('LOCATIONS')}><Text style={[styles.wordTabText, {fontSize: 16, color: tab === 'LOCATIONS' ? theme.primary : theme.textDim}]}>Locaties</Text></TouchableOpacity>
            </View>
            
            {tab === 'PEOPLE' ? (
                <ListManagerScreenEmbedded items={partners} onUpdate={setPartners} type="object" />
            ) : (
                <ListManagerScreenEmbedded items={contexts} onUpdate={setContexts} type="object" />
            )}
        </SafeAreaView></Modal>
    );
};

// Embedded version of list manager to use inside another screen
const ListManagerScreenEmbedded = ({ items, onUpdate, type = 'object' }) => {
    const [newItemText, setNewItemText] = useState("");
    
    // Copy to local state is not strictly needed if we update parent directly, but cleaner for UI updates
    // Here we update parent directly via onUpdate wrapper
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

const ManageTopicsScreen = ({ onClose, categories, setCategories }) => {
    // Categories is an object. To reorder, we need to convert to array of [key, val], manipulate, then reconstruct (or use an order array).
    // Simple approach: Convert to array of objects { key, ...data }, manage list, then rebuild object.
    const [catList, setCatList] = useState(Object.keys(categories).map(k => ({ key: k, originalKey: k, ...categories[k] })));
    const [newCatName, setNewCatName] = useState("");

    const saveChanges = () => {
        const newCatObj = {};
        catList.forEach(c => {
            // If renamed, use new key, else original
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
        <Modal visible={true} animationType="slide"><SafeAreaView style={{flex: 1, backgroundColor: theme.bg}}>
            <View style={styles.header}>
                <Text style={styles.catHeaderSmall}>Onderwerpen Beheer</Text>
                <TouchableOpacity onPress={saveChanges}><Text style={{color: theme.primary, fontWeight:'bold'}}>Opslaan & Sluiten</Text></TouchableOpacity>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
                <ScrollView contentContainerStyle={{padding: 24}}>
                    <View style={{flexDirection: 'row', marginBottom: 20}}>
                        <TextInput style={[styles.inputField, {flex: 1, marginBottom: 0}]} placeholder="Nieuw onderwerp..." placeholderTextColor={theme.textDim} value={newCatName} onChangeText={setNewCatName} />
                        <TouchableOpacity style={[styles.addBtnSmallRound, {marginLeft: 10}]} onPress={add}><Feather name="plus" size={24} color="#000"/></TouchableOpacity>
                    </View>
                    {catList.map((item, i) => (
                         <View key={i} style={styles.listItemRow}>
                             <View style={{flex: 1}}>
                                 <TextInput style={{color: '#FFF', fontSize: 16, fontWeight: 'bold'}} value={item.key} onChangeText={(t) => updateName(i, t)} />
                             </View>
                             <View style={{flexDirection: 'row', gap: 15, marginLeft: 10}}>
                                 <TouchableOpacity onPress={() => move(i, -1)} disabled={i===0}><Feather name="arrow-up" size={20} color={i===0?theme.surfaceHighlight:theme.textDim}/></TouchableOpacity>
                                 <TouchableOpacity onPress={() => move(i, 1)} disabled={i===catList.length-1}><Feather name="arrow-down" size={20} color={i===catList.length-1?theme.surfaceHighlight:theme.textDim}/></TouchableOpacity>
                                 {item.key !== 'Persoonlijk' && <TouchableOpacity onPress={() => remove(i)}><Feather name="trash-2" size={20} color={theme.danger}/></TouchableOpacity>}
                             </View>
                         </View>
                    ))}
                    <View style={{height: 100}}/>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView></Modal>
    );
};

const BasicSetupFlow = ({ onBack, initialData, onSave, onTriggerPopup }) => {
  const [data, setData] = useState(initialData);
  const update = (key, val) => setData({...data, [key]: val});
  return (
    <SafeAreaView style={{flex:1, backgroundColor: theme.bg}}>
      <View style={{padding: 24, flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:1, borderColor:theme.surfaceHighlight}}><Text style={styles.catHeaderBig}>Profiel</Text><TouchableOpacity onPress={onBack}><Feather name="x" size={32} color="#FFF"/></TouchableOpacity></View>
      <ScrollView contentContainerStyle={{padding: 24}}>
         <Text style={styles.formLabel}>1. Persoonlijk</Text><TextInput style={styles.inputField} placeholder="Naam" placeholderTextColor={theme.textDim} value={data.name} onChangeText={t => update('name', t)} /><TextInput style={styles.inputField} placeholder="Telefoon" placeholderTextColor={theme.textDim} value={data.phone} onChangeText={t => update('phone', t)} /><TextInput style={styles.inputField} placeholder="Email" placeholderTextColor={theme.textDim} value={data.email} onChangeText={t => update('email', t)} /><TextInput style={styles.inputField} placeholder="Adres" placeholderTextColor={theme.textDim} value={data.address} onChangeText={t => update('address', t)} />
         <Text style={styles.formLabel}>2. Partner / Contact 1</Text><TextInput style={styles.inputField} placeholder="Naam Partner" placeholderTextColor={theme.textDim} value={data.partnerName} onChangeText={t => update('partnerName', t)} /><TextInput style={styles.inputField} placeholder="Telefoon Partner" placeholderTextColor={theme.textDim} value={data.partnerPhone} onChangeText={t => update('partnerPhone', t)} /><TextInput style={styles.inputField} placeholder="Email Partner" placeholderTextColor={theme.textDim} value={data.partnerEmail} onChangeText={t => update('partnerEmail', t)} />
         <Text style={styles.formLabel}>3. Contact 2</Text><TextInput style={styles.inputField} placeholder="Naam 2e Contact" placeholderTextColor={theme.textDim} value={data.contact2Name} onChangeText={t => update('contact2Name', t)} /><TextInput style={styles.inputField} placeholder="Tel 2e Contact" placeholderTextColor={theme.textDim} value={data.contact2Phone} onChangeText={t => update('contact2Phone', t)} />
         <Text style={styles.formLabel}>4. Medisch</Text><TextInput style={styles.inputField} placeholder="Ziekenhuis / Huisarts" placeholderTextColor={theme.textDim} value={data.hospitalName} onChangeText={t => update('hospitalName', t)} /><TextInput style={styles.inputField} placeholder="Tel Arts" placeholderTextColor={theme.textDim} value={data.doctorPhone} onChangeText={t => update('doctorPhone', t)} /><TextInput style={styles.inputField} placeholder="Medicatie" placeholderTextColor={theme.textDim} value={data.medication} onChangeText={t => update('medication', t)} /><TextInput style={styles.inputField} placeholder="Allergieën" placeholderTextColor={theme.textDim} value={data.allergies} onChangeText={t => update('allergies', t)} />
         <TouchableOpacity style={styles.saveBtn} onPress={() => { onSave(data); onTriggerPopup("Succes", "Gegevens opgeslagen!", "info"); }}><Text style={styles.saveBtnText}>Opslaan</Text></TouchableOpacity><View style={{height: 50}}/>
      </ScrollView>
    </SafeAreaView>
  );
};

const CustomTextsFlow = ({ onBack, initialData, onSave, onTriggerPopup }) => {
  const [data, setData] = useState(initialData);
  const update = (key, val) => setData({...data, [key]: val});
  return (
    <SafeAreaView style={{flex:1, backgroundColor: theme.bg}}>
      <View style={{padding: 24, flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:1, borderColor:theme.surfaceHighlight}}><Text style={styles.catHeaderBig}>Uitleg Teksten</Text><TouchableOpacity onPress={onBack}><Feather name="x" size={32} color="#FFF"/></TouchableOpacity></View>
      <ScrollView contentContainerStyle={{padding: 24}}>
         <Text style={styles.onbText}>Hier kun je de tekst aanpassen die getoond wordt op de uitlegschermen.</Text>
         <Text style={styles.formLabel}>Scherm: "Ik heb afasie"</Text><TextInput style={[styles.inputField,{height:100}]} multiline value={data.customPartnerText} onChangeText={t => update('customPartnerText', t)} placeholder="Standaard tekst..." placeholderTextColor={theme.textDim} />
         <Text style={styles.formLabel}>Scherm: "Medisch Paspoort Intro"</Text><TextInput style={[styles.inputField,{height:100}]} multiline value={data.customMedicalText} onChangeText={t => update('customMedicalText', t)} placeholder="Standaard tekst..." placeholderTextColor={theme.textDim} />
         <TouchableOpacity style={styles.saveBtn} onPress={() => { onSave(data); onTriggerPopup("Succes", "Teksten opgeslagen!", "info"); }}><Text style={styles.saveBtnText}>Opslaan</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const ExtendedModeSetup = ({ profile, extendedProfile, onSave, onClose, onTriggerPopup }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState(extendedProfile);
  const steps = EXTENDED_SECTIONS;
  const currentStep = steps[stepIndex];
  const update = (key, val) => setData(prev => ({...prev, [key]: val}));
  const addToList = (listKey, item) => setData(prev => ({...prev, [listKey]: [...(prev[listKey]||[]), item]}));
  const removeFromList = (listKey, idx) => setData(prev => ({...prev, [listKey]: prev[listKey].filter((_, i) => i !== idx)}));
  const handleNext = () => { if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1); else { onSave(data); onClose(); onTriggerPopup("Klaar", "Uitgebreid profiel opgeslagen.", "info"); } };
  
  const renderContent = () => {
    switch(currentStep.id) {
      case 'intro': return <View style={{alignItems:'center', padding:20}}><Feather name="layers" size={60} color={theme.primary} style={{marginBottom:20}} /><Text style={styles.onbTitle}>Profiel uitgebreid</Text><Text style={styles.onbText}>Hier kun je extra details invullen. Dit helpt in noodsituaties of bij de dokter.</Text></View>;
      case 'personal': return <View><Text style={styles.helperText}>Wanneer ben je geboren?</Text><Text style={styles.inputLabel}>Geboortedatum</Text><TextInput style={styles.inputField} value={data.dob} onChangeText={t=>update('dob',t)} placeholder="DD-MM-JJJJ" /><Text style={styles.helperText}>Wat is je exacte adres?</Text><Text style={styles.inputLabel}>Huisadres (aanvulling)</Text><TextInput style={styles.inputField} value={data.address} onChangeText={t=>update('address',t)} /></View>;
      case 'medical': return <View><Text style={styles.helperText}>Belangrijk voor hulpverleners.</Text><Text style={styles.inputLabel}>Bloedgroep</Text><TextInput style={styles.inputField} value={data.bloodType} onChangeText={t=>update('bloodType',t)} /><ListEditor title="Medicijnen (Lijst)" items={data.meds || []} onItemAdd={t=>addToList('meds',t)} onItemRemove={i=>removeFromList('meds',i)} placeholder="Naam medicijn..." /></View>;
      case 'emergency': return <View><Text style={styles.helperText}>Wie bellen we als partner niet opneemt?</Text><Text style={styles.inputLabel}>Naam Noodcontact 2</Text><TextInput style={styles.inputField} value={data.emergencyName2} onChangeText={t=>update('emergencyName2',t)} /><Text style={styles.inputLabel}>Tel Noodcontact 2</Text><TextInput style={styles.inputField} value={data.emergencyPhone2} onChangeText={t=>update('emergencyPhone2',t)} /></View>;
      default: return <ListEditor title={currentStep.title} items={data.generic || []} onItemAdd={t=>addToList('generic',t)} onItemRemove={i=>removeFromList('generic',i)} placeholder="Toevoegen..." />;
    }
  };
  return <Modal visible={true} animationType="slide"><SafeAreaView style={{flex:1, backgroundColor:theme.bg}}><View style={styles.header}><Text style={styles.catHeaderSmall}>{currentStep.title}</Text><TouchableOpacity onPress={()=>onClose()}><Text style={{color:theme.textDim}}>Sluiten</Text></TouchableOpacity></View><View style={{height:4, backgroundColor:theme.surfaceHighlight, width:'100%'}}><View style={{height:'100%', backgroundColor:theme.primary, width:`${(stepIndex/(steps.length-1))*100}%`}}/></View><ScrollView contentContainerStyle={{padding:24}}>{renderContent()}</ScrollView><View style={{padding:24, flexDirection:'row', justifyContent:'space-between'}}>{stepIndex>0?<TouchableOpacity onPress={()=>setStepIndex(stepIndex-1)}><Text style={{color:'#FFF'}}>Terug</Text></TouchableOpacity>:<View/>}<TouchableOpacity onPress={handleNext}><Text style={{color:theme.primary, fontWeight:'bold'}}>Volgende</Text></TouchableOpacity></View></SafeAreaView></Modal>;
};

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [partner, setPartner] = useState("");
  const handleNext = () => { if(step === 0) setStep(1); else if(step === 1) setStep(2); else onComplete(name || "Gebruiker", partner || "Partner"); };
  return (
    <SafeAreaView style={styles.onbContainer}><KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={styles.onbCard}>
          <Feather name={step===0?"message-circle":step===1?"user":"heart"} size={48} color={theme.primary} style={{marginBottom: 20}} />
          <Text style={styles.onbTitle}>{step===0?"Welkom":step===1?"Wie ben jij?":"Partner?"}</Text><Text style={styles.onbText}>{step===0?"Ik help je communiceren.":step===1?"Hoe heet je?":"Hoe heet je partner?"}</Text>
          {step===1 && <TextInput style={[styles.onbInput,{borderColor:theme.primary,borderWidth:1}]} placeholder="Naam" placeholderTextColor={theme.textDim} value={name} onChangeText={setName} autoFocus/>}
          {step===2 && <TextInput style={[styles.onbInput,{borderColor:theme.primary,borderWidth:1}]} placeholder="Partner naam" placeholderTextColor={theme.textDim} value={partner} onChangeText={setPartner} autoFocus/>}
          <TouchableOpacity style={styles.onbBtn} onPress={handleNext}><Text style={styles.onbBtnText}>{step===2?"Starten":"Volgende"}</Text></TouchableOpacity>
    </KeyboardAvoidingView></SafeAreaView>
  );
};

// --- MODALS (GALLERY, EMERGENCY, MEDICAL, PARTNER) ---
const AddOrEditPhotoModal = ({ visible, onClose, onSave, categories, initialData, onTriggerPopup }) => {
  const [caption, setCaption] = useState(initialData ? initialData.text : '');
  const [selectedTag, setSelectedTag] = useState(initialData ? initialData.category : null);
  useEffect(() => { if(visible) { setCaption(initialData ? initialData.text : ''); setSelectedTag(initialData ? initialData.category : null); } }, [visible, initialData]);
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.selectorContainer}>
          <View style={styles.selectorHeader}>
            <Text style={styles.selectorTitle}>{initialData ? "Foto Bewerken" : "Foto Toevoegen"}</Text>
            <TouchableOpacity onPress={onClose}><Feather name="x" size={24} color={theme.text}/></TouchableOpacity>
          </View>
          <ScrollView>
            {!initialData && (
                <View style={styles.photoSourceRow}>
                   <TouchableOpacity style={styles.photoSourceBtn} onPress={() => onTriggerPopup("Camera", "Klik! (Simulatie)", "info")}>
                      <Feather name="camera" size={32} color={theme.primary} />
                      <Text style={styles.sourceText}>Camera</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.photoSourceBtn} onPress={() => onTriggerPopup("Fotorol", "Galerij opent... (Simulatie)", "info")}>
                      <Feather name="image" size={32} color={theme.primary} />
                      <Text style={styles.sourceText}>Fotorol</Text>
                   </TouchableOpacity>
                </View>
            )}
            <Text style={styles.label}>CATEGORIE (Optioneel)</Text>
            <View style={styles.tagContainer}>
              {Object.keys(categories).map(cat => (
                <TouchableOpacity key={cat} style={[styles.tagChip, selectedTag === cat && styles.tagChipActive]} onPress={() => setSelectedTag(cat)}>
                   <Feather name={categories[cat].icon} size={14} color={selectedTag === cat ? '#000' : theme.textDim} style={{marginRight:6}}/>
                   <Text style={[styles.tagText, selectedTag === cat && {color:'#000', fontWeight:'bold'}]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.label, {marginTop: 20}]}>BIJSCHRIFT</Text>
            <TextInput style={styles.builderInput} placeholder="Bijv. Onze hond Max..." placeholderTextColor={theme.textDim} value={caption} onChangeText={setCaption} />
            <TouchableOpacity style={styles.saveBtn} onPress={() => { onSave(caption, selectedTag); onClose(); }}>
              <Text style={styles.saveBtnText}>Opslaan</Text>
            </TouchableOpacity>
            <View style={{height:40}}/>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const FullScreenHelp = ({ visible, onClose }) => (
    <Modal visible={visible} animationType="slide" transparent={false}>
        <SafeAreaView style={{flex:1, backgroundColor: '#FFF000'}}>
             <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:20}}>
                 <View style={{padding: 20, backgroundColor: 'red', borderRadius: 20, marginBottom: 40}}>
                     <Feather name="alert-triangle" size={80} color="#FFF" />
                 </View>
                 <Text style={{fontSize: 40, fontWeight:'900', textAlign:'center', marginBottom: 20}}>IK HEB HULP NODIG</Text>
                 <Text style={{fontSize: 30, fontWeight:'bold', textAlign:'center', color: 'red'}}>BEL 112</Text>
             </View>
             <TouchableOpacity style={{position:'absolute', top: 50, right: 30, backgroundColor:'rgba(0,0,0,0.1)', padding:10, borderRadius:20}} onPress={onClose}>
                 <Feather name="x" size={40} color="#000" />
             </TouchableOpacity>
        </SafeAreaView>
    </Modal>
);

const EmergencyModal = ({ visible, onClose, profile, extended, onTriggerPopup }) => {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <Modal visible={visible} animationType="slide"><SafeAreaView style={styles.emergencyContainer}>
        <FullScreenHelp visible={showHelp} onClose={() => setShowHelp(false)} />
        <View style={styles.emergencyHeader}><View style={{flexDirection:'row', alignItems:'center'}}><Feather name="alert-triangle" size={32} color="#FFF" /><Text style={styles.emergencyTitle}>NOOD</Text></View><TouchableOpacity onPress={onClose}><Feather name="x" size={32} color="#FFF" /></TouchableOpacity></View>
        <ScrollView contentContainerStyle={{padding: 20}}>
            <View style={styles.emergencyCard}><Text style={styles.emLabel}>PERSOON</Text><Text style={styles.emValue}>{profile.name}</Text><Text style={styles.emValueSub}>{profile.address || extended.address || "Adres onbekend"}</Text></View>
            <TouchableOpacity style={styles.call112Btn} onPress={() => onTriggerPopup("NOOD", "Belt 112... (Simulatie)", "danger")}><Text style={styles.callText}>BEL 112</Text></TouchableOpacity>
            
            <TouchableOpacity style={[styles.call112Btn, {backgroundColor: theme.warning, marginTop: 10}]} onPress={() => setShowHelp(true)}>
                <Feather name="eye" size={28} color="#000"/>
                <Text style={[styles.callText, {color:'#000'}]}>LAAT HULP SCHERM ZIEN</Text>
            </TouchableOpacity>

            <View style={{gap: 10, marginTop: 20}}>
                <TouchableOpacity style={styles.callBtnSmall} onPress={() => onTriggerPopup("Bellen", `Belt ${profile.partnerName}...`, "info")}><Feather name="heart" size={24} color="#FFF" /><Text style={styles.callSmallText}>{profile.partnerName || "Partner"} ({profile.partnerPhone})</Text></TouchableOpacity>
                {(profile.contact2Name || extended.emergencyName2) && <TouchableOpacity style={styles.callBtnSmall} onPress={() => onTriggerPopup("Bellen", `Belt ${profile.contact2Name || extended.emergencyName2}...`, "info")}><Feather name="user-plus" size={24} color="#FFF" /><Text style={styles.callSmallText}>{profile.contact2Name || extended.emergencyName2} ({profile.contact2Phone || extended.emergencyPhone2})</Text></TouchableOpacity>}
                {profile.hospitalName && <TouchableOpacity style={[styles.callBtnSmall, {backgroundColor: theme.surfaceHighlight}]} onPress={() => onTriggerPopup("Bellen", `Belt ${profile.hospitalName}...`, "info")}><Feather name="activity" size={24} color="#FFF" /><Text style={styles.callSmallText}>{profile.hospitalName} ({profile.doctorPhone})</Text></TouchableOpacity>}
            </View>
        </ScrollView></SafeAreaView></Modal>
  );
};

const MedicalScreen = ({ visible, onClose, profile, text, extended }) => (
  <Modal visible={visible} animationType="fade" transparent={false}><SafeAreaView style={{flex:1, backgroundColor: '#FFF'}}><View style={{padding: 20, alignItems: 'flex-end'}}><TouchableOpacity onPress={onClose} style={{padding: 10, backgroundColor:'#EEE', borderRadius: 20}}><Feather name="x" size={32} color="#000" /></TouchableOpacity></View><ScrollView contentContainerStyle={{padding: 30}}><Text style={{fontSize: 28, fontWeight: 'bold', color: theme.danger, marginBottom: 20}}>MEDISCHE INFO</Text><Text style={{fontSize: 16, color: '#444', marginBottom: 20}}>{text || "Dit zijn mijn medische gegevens."}</Text><Text style={styles.medLabel}>NAAM</Text><Text style={styles.medValue}>{profile.name} {extended.dob ? `(${extended.dob})` : ''}</Text><Text style={styles.medLabel}>ADRES</Text><Text style={styles.medValue}>{profile.address || extended.address || "Niet opgegeven"}</Text><Text style={styles.medLabel}>BLOEDGROEP</Text><Text style={styles.medValue}>{extended.bloodType || "Onbekend"}</Text><Text style={styles.medLabel}>MEDICATIE</Text><Text style={styles.medValue}>{profile.medication || "Geen basislijst"}</Text>{extended.meds && extended.meds.map((m,i)=><Text key={i} style={styles.medValue}>- {m}</Text>)}<Text style={styles.medLabel}>ALLERGIEËN</Text><Text style={styles.medValue}>{profile.allergies || "Geen bekend"}</Text><Text style={styles.medLabel}>CONTACTPERSONEN</Text><Text style={styles.medValue}>1. {profile.partnerName} ({profile.partnerPhone})</Text>{(profile.contact2Name || extended.emergencyName2) && <Text style={styles.medValue}>2. {profile.contact2Name || extended.emergencyName2} ({profile.contact2Phone || extended.emergencyPhone2})</Text>}{profile.hospitalName && <Text style={styles.medValue}>Arts: {profile.hospitalName} ({profile.doctorPhone})</Text>}</ScrollView></SafeAreaView></Modal>
);

const PartnerScreen = ({ visible, onClose, text, name }) => (
  <Modal visible={visible} animationType="fade" transparent={false}><SafeAreaView style={{flex:1, backgroundColor: theme.partnerBg}}><View style={{padding: 20, alignItems: 'flex-end'}}><TouchableOpacity onPress={onClose} style={{padding: 10, backgroundColor:'rgba(255,255,255,0.1)', borderRadius: 20}}><Feather name="x" size={32} color={theme.partnerText} /></TouchableOpacity></View><View style={{flex:1, justifyContent:'center', alignItems:'center', padding: 30}}>
      <Feather name="message-circle" size={60} color={theme.primary} style={{marginBottom: 20}} />
      <Text style={{fontSize: 28, fontWeight: 'bold', color: theme.partnerText, textAlign: 'center', marginBottom: 10}}>Hoi, ik ben {name}</Text>
      <Text style={{fontSize: 20, fontWeight: '600', color: theme.textDim, textAlign: 'center', marginBottom: 30}}>En ik praat via deze app</Text>
      <View style={{backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16}}>
        <Text style={{fontSize: 18, color: '#E0F2FE', textAlign: 'center', lineHeight: 28}}>{text || "Ik heb afasie (moeite met taal). Mijn verstand is helder. Geef me even de tijd om te typen."}</Text>
      </View>
  </View></SafeAreaView></Modal>
);

const ToolsMenuModal = ({ visible, onClose, onNavigate }) => (
  <Modal visible={visible} transparent animationType="slide"><View style={styles.modalOverlay}><View style={styles.selectorContainer}><View style={styles.selectorHeader}><Text style={styles.selectorTitle}>Hulpmiddelen</Text><TouchableOpacity onPress={onClose}><Feather name="x" size={24} color={theme.text} /></TouchableOpacity></View><TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('HISTORY'); }}><View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}><Feather name="clock" size={24} color="#000" /></View><Text style={styles.menuItemTitle}>Geschiedenis</Text></TouchableOpacity><TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('PARTNER_SCREEN'); }}><View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}><Feather name="message-circle" size={24} color="#000" /></View><Text style={styles.menuItemTitle}>Uitleg voor de ander</Text></TouchableOpacity><TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('MEDICAL_SCREEN'); }}><View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}><Feather name="activity" size={24} color="#000" /></View><Text style={styles.menuItemTitle}>Medisch Paspoort</Text></TouchableOpacity></View></View></Modal>
);

const HistoryOptionsModal = ({ visible, item, onClose, onAction }) => (
    <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.selectorContainer}>
                <View style={styles.selectorHeader}>
                    <Text style={styles.selectorTitle}>Kies een actie</Text>
                    <TouchableOpacity onPress={onClose}><Feather name="x" size={24} color="#FFF"/></TouchableOpacity>
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

const HistoryView = ({ history, onBack, onSelect }) => (
  <View style={styles.section}><TouchableOpacity onPress={onBack} style={{flexDirection:'row', marginBottom:20}}><Feather name="arrow-left" size={20} color={theme.textDim}/><Text style={{color:theme.textDim, marginLeft:10}}>Terug</Text></TouchableOpacity><Text style={styles.catHeaderBig}>Geschiedenis</Text><ScrollView>{history.length === 0 ? <Text style={styles.emptyText}>Nog niets gezegd vandaag.</Text> : history.map((h, i) => (<TouchableOpacity key={i} style={styles.historyItem} onPress={() => onSelect(h)}><Text style={styles.historyTime}>{h.time}</Text><Text style={styles.historyText}>{h.text}</Text></TouchableOpacity>))}</ScrollView></View>
);

const FullScreenShow = ({ text, onClose }) => (
  <Modal animationType="fade" visible={true}><View style={styles.fullScreenContainer}><TouchableOpacity style={styles.fullScreenClose} onPress={onClose}><Feather name="x" size={32} color="#FFF" /><Text style={{color:'#FFF', marginTop:4}}>Sluiten</Text></TouchableOpacity><View style={styles.fullScreenContent}><Text style={styles.fullScreenText}>{text}</Text></View></View></Modal>
);

const SelectorModal = ({ visible, title, options, selectedId, onSelect, onClose, onAdd }) => (
  <Modal visible={visible} transparent animationType="slide"><View style={styles.modalOverlay}><View style={styles.selectorContainer}><View style={styles.selectorHeader}><Text style={styles.selectorTitle}>{title}</Text><TouchableOpacity onPress={onClose}><Feather name="x" size={24} color={theme.text} /></TouchableOpacity></View>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {options.map(opt => (<TouchableOpacity key={opt.id} style={[styles.selectorItem, selectedId === opt.id && styles.selectorItemActive]} onPress={() => { onSelect(opt.id); onClose(); }}><View style={[styles.selectorIcon, selectedId === opt.id && {backgroundColor: theme.primary}]}><Feather name={opt.icon} size={24} color={selectedId === opt.id ? '#000' : theme.text} /></View><Text style={styles.selectorLabel}>{opt.label}</Text></TouchableOpacity>))}
      {onAdd && (
          <TouchableOpacity style={styles.selectorItem} onPress={onAdd}>
              <View style={[styles.selectorIcon, {backgroundColor: theme.surfaceHighlight, borderWidth:1, borderColor: theme.primary}]}>
                  <Feather name="plus" size={24} color={theme.primary} />
              </View>
              <Text style={styles.selectorLabel}>Toevoegen</Text>
          </TouchableOpacity>
      )}
  </ScrollView>
  </View></View></Modal>
);

const OutputBar = ({ onSpeak, onCopy, onShow, onClear }) => (
  <View style={styles.outputBar}><TouchableOpacity style={styles.outputBtnDestructive} onPress={onClear}><Feather name="trash-2" size={24} color={theme.textDim} /></TouchableOpacity><View style={styles.outputActions}><TouchableOpacity style={[styles.outputBtn, {backgroundColor: theme.primary}]} onPress={onSpeak}><Feather name="volume-2" size={24} color="#000" /><Text style={styles.outputBtnTextDark}>Spreek</Text></TouchableOpacity><TouchableOpacity style={[styles.outputBtn, {backgroundColor: theme.surfaceHighlight}]} onPress={onCopy}><Feather name="copy" size={24} color="#FFF" /><Text style={styles.outputBtnText}>Kopieer</Text></TouchableOpacity><TouchableOpacity style={[styles.outputBtn, {backgroundColor: theme.surfaceHighlight}]} onPress={onShow}><Feather name="monitor" size={24} color="#FFF" /><Text style={styles.outputBtnText}>Toon</Text></TouchableOpacity></View></View>
);

// --- MAIN APP ---
const MainApp = ({ initialName, initialPartner }) => {
  const [profile, setProfile] = useState({ name: initialName, partnerName: initialPartner, phone: "", email: "", address: "", partnerPhone: "", partnerEmail: "", contact2Name: "", contact2Phone: "", hospitalName: "", doctorPhone: "", medication: "", allergies: "", customPartnerText: "", customMedicalText: "" });
  const [extendedProfile, setExtendedProfile] = useState({});
  const [currentView, setCurrentView] = useState('HOME');
  const [activeCategory, setActiveCategory] = useState(null);
  const [sentence, setSentence] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [gallery, setGallery] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [builderMode, setBuilderMode] = useState('SENTENCE');
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isInstantMode, setIsInstantMode] = useState(false);
  
  // DYNAMIC LISTS STATE
  const [contexts, setContexts] = useState(DEFAULT_CONTEXTS);
  const [customPartners, setCustomPartners] = useState([]);
  const [quickResponses, setQuickResponses] = useState(DEFAULT_QUICK);

  // POPUP & MODAL STATE
  const [popup, setPopup] = useState({ visible: false, title: '', message: '', type: 'info' });
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  
  // "ADD" MODALS STATE
  const [showAddContext, setShowAddContext] = useState(false);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [showAddQuick, setShowAddQuick] = useState(false);

  const triggerPopup = (title, message, type = 'info') => {
      setPopup({ visible: true, title, message, type });
  };

  const activePartners = [
      { id: 'niemand', label: 'Niemand', icon: 'user' },
      { id: 'partner', label: profile.partnerName || 'Partner', icon: 'heart' },
      { id: 'dokter', label: 'Arts', icon: 'plus-circle' },
      ...customPartners
  ];

  useEffect(() => {
      if(categories['Persoonlijk']) {
          const personalItems = [
              profile.name ? `Ik heet ${profile.name}` : null,
              profile.address ? `Ik woon in ${profile.address}` : null,
              profile.partnerName ? `Mijn partner heet ${profile.partnerName}` : null,
              profile.contact2Name ? `Bel ${profile.contact2Name}` : null,
              "Ik heb afasie"
          ].filter(Boolean);
          setCategories(prev => ({...prev, Persoonlijk: { ...prev.Persoonlijk, items: personalItems } }));
      }
  }, [profile, extendedProfile]);

  const [showSettingsMenu, setShowSettingsMenu] = useState(false); 
  const [showToolsMenu, setShowToolsMenu] = useState(false);       
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  
  const [photoToEdit, setPhotoToEdit] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showPartnerScreen, setShowPartnerScreen] = useState(false);
  const [showMedicalScreen, setShowMedicalScreen] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentContext, setCurrentContext] = useState('thuis');
  const [currentPartner, setCurrentPartner] = useState('partner');
  const [showContextModal, setShowContextModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  const handleBackFromSettings = () => { setCurrentView('HOME'); setShowSettingsMenu(true); };
  const addPhraseToCategory = (text) => { if(!activeCategory) return; setCategories(prev => ({ ...prev, [activeCategory]: { ...prev[activeCategory], items: [...prev[activeCategory].items, text] } })); };
  const deletePhraseFromCategory = (idx) => { setCategories(prev => ({ ...prev, [activeCategory]: { ...prev[activeCategory], items: prev[activeCategory].items.filter((_, i) => i !== idx) } })); };
  const movePhrase = (idx, dir) => { const items = [...categories[activeCategory].items]; const newIdx = idx + dir; if(newIdx < 0 || newIdx >= items.length) return; [items[idx], items[newIdx]] = [items[newIdx], items[idx]]; setCategories(prev => ({ ...prev, [activeCategory]: { ...prev[activeCategory], items } })); };
  const handleSaveBuilder = (text) => { if (builderMode === 'ADD_TO_CATEGORY') { addPhraseToCategory(text); setIsBuilding(false); } else { setSentence(text.split(' ')); setIsBuilding(false); } };
  
  const handleSpeak = (textToSpeak) => {
    const txt = textToSpeak || sentence.join(' ');
    if (!txt) return;
    triggerPopup("Ik zeg:", txt, 'info');
    const newEntry = { text: txt, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) };
    setHistory(prev => [newEntry, ...prev]);
  };

  const handlePhrasePress = (text) => { if (isInstantMode) { handleSpeak(text); } else { setSentence(prev => [...prev, text]); } };

  const handleSavePhoto = (caption, category) => {
    const finalCaption = caption.trim() || "Kijk eens";
    if (photoToEdit) {
        setGallery(prev => prev.map(p => p.id === photoToEdit.id ? {...p, text: finalCaption, category} : p));
        setPhotoToEdit(null);
    } else {
        const newPhoto = { id: Date.now(), color: ['#F59E0B', '#10B981', '#3B82F6'][Math.floor(Math.random()*3)], text: finalCaption, category };
        setGallery(prev => [...prev, newPhoto]);
        if(category && categories[category]) {
            setCategories(prev => ({ ...prev, [category]: { ...prev[category], items: [...prev[category].items, finalCaption + " 📷"] } }));
        }
    }
    if (category) setActiveCategory(category);
    setCurrentView(category ? 'CATEGORY' : 'GALLERY');
  };

  const handleCopy = () => { if(sentence.length > 0) triggerPopup("Gekopieerd:", sentence.join(' '), 'copy'); };
  const handleShow = () => { if(sentence.length > 0) setShowFullScreen(true); };

  const handleHistoryAction = (action) => {
     if (!selectedHistoryItem) return;
     const text = selectedHistoryItem.text;
     setSelectedHistoryItem(null);
     
     if (action === 'speak') {
         triggerPopup("Opnieuw:", text, 'info');
     } else if (action === 'copy') {
         triggerPopup("Gekopieerd:", text, 'copy');
     } else if (action === 'show') {
         setSentence(text.split(' ')); 
         setShowFullScreen(true);
     }
  };

  const handleAddContext = (name) => {
      const newId = name.toLowerCase().replace(/\s/g, '_') + Date.now();
      setContexts([...contexts, { id: newId, label: name, icon: 'map-pin' }]);
  };

  const handleAddPartner = (name) => {
      const newId = name.toLowerCase().replace(/\s/g, '_') + Date.now();
      setCustomPartners([...customPartners, { id: newId, label: name, icon: 'user' }]);
  };

  const handleAddQuick = (text) => {
      setQuickResponses([...quickResponses, text]);
  };

  const moveWordMain = (dir) => { if (selectedWordIndex === null) return; const newIdx = selectedWordIndex + dir; if (newIdx >= 0 && newIdx < sentence.length) { const newS = [...sentence]; [newS[selectedWordIndex], newS[newIdx]] = [newS[newIdx], newS[selectedWordIndex]]; setSentence(newS); setSelectedWordIndex(newIdx); } };
  const deleteWordMain = () => { if (selectedWordIndex !== null) { setSentence(sentence.filter((_, i) => i !== selectedWordIndex)); setSelectedWordIndex(null); } };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />
      
      <CustomPopup visible={popup.visible} title={popup.title} message={popup.message} type={popup.type} onClose={() => setPopup(prev => ({ ...prev, visible: false }))} />
      <HistoryOptionsModal visible={!!selectedHistoryItem} item={selectedHistoryItem} onClose={() => setSelectedHistoryItem(null)} onAction={handleHistoryAction} />

      <SimpleInputModal visible={showAddContext} title="Nieuwe locatie" placeholder="Bijv. Bij de fysio" onClose={() => setShowAddContext(false)} onSave={handleAddContext} />
      <SimpleInputModal visible={showAddPartner} title="Persoon toevoegen" placeholder="Bijv. Kleinkind" onClose={() => setShowAddPartner(false)} onSave={handleAddPartner} />
      <SimpleInputModal visible={showAddQuick} title="Snel reageren toevoegen" placeholder="Bijv. Bedankt!" onClose={() => setShowAddQuick(false)} onSave={handleAddQuick} />

      <AddOrEditPhotoModal visible={showPhotoModal} onClose={() => { setShowPhotoModal(false); setPhotoToEdit(null); }} onSave={handleSavePhoto} categories={categories} initialData={photoToEdit} onTriggerPopup={triggerPopup} />
      <SettingsMenuModal visible={showSettingsMenu} onClose={() => setShowSettingsMenu(false)} onNavigate={(v) => { setCurrentView(v); }} />
      <ToolsMenuModal visible={showToolsMenu} onClose={() => setShowToolsMenu(false)} onNavigate={(v) => { if(v === 'PARTNER_SCREEN') setShowPartnerScreen(true); else if(v === 'MEDICAL_SCREEN') setShowMedicalScreen(true); else if(v === 'HISTORY') setCurrentView('HISTORY'); }} />
      <EmergencyModal visible={showEmergency} onClose={() => setShowEmergency(false)} profile={profile} extended={extendedProfile} onTriggerPopup={triggerPopup} />
      <PartnerScreen visible={showPartnerScreen} onClose={() => setShowPartnerScreen(false)} text={profile.customPartnerText} name={profile.name} />
      <MedicalScreen visible={showMedicalScreen} onClose={() => setShowMedicalScreen(false)} profile={profile} extended={extendedProfile} text={profile.customMedicalText} />
      {showFullScreen && <FullScreenShow text={sentence.join(' ')} onClose={() => setShowFullScreen(false)} />}
      
      <SelectorModal visible={showContextModal} title="Waar ben je?" options={contexts} selectedId={currentContext} onSelect={setCurrentContext} onClose={() => setShowContextModal(false)} onAdd={() => { setShowContextModal(false); setShowAddContext(true); }} />
      <SelectorModal visible={showPartnerModal} title="Met wie praat je?" options={activePartners} selectedId={currentPartner} onSelect={setCurrentPartner} onClose={() => setShowPartnerModal(false)} onAdd={() => { setShowPartnerModal(false); setShowAddPartner(true); }} />

      {currentView === 'TOPIC_MANAGER' && <ManageTopicsScreen onClose={handleBackFromSettings} categories={categories} setCategories={setCategories} />}
      {currentView === 'MANAGE_QUICK' && <ListManagerScreen title="Beheer Snel Reageren" items={quickResponses} onUpdate={setQuickResponses} onClose={handleBackFromSettings} type="string" />}
      {currentView === 'MANAGE_PEOPLE_LOCATIONS' && <ManagePeopleLocations onClose={handleBackFromSettings} contexts={contexts} setContexts={setContexts} partners={customPartners} setPartners={setCustomPartners} />}

      <View style={styles.container}>
        {!isBuilding && !['BASIC_SETUP', 'CUSTOM_TEXTS', 'EXTENDED_SETUP', 'TOPIC_MANAGER', 'MANAGE_QUICK', 'MANAGE_PEOPLE_LOCATIONS'].includes(currentView) && (
          <View style={styles.header}>
            <View style={{flex: 1, paddingRight: 10}}>
                <TouchableOpacity onPress={() => setCurrentView('HOME')}><Text numberOfLines={1} ellipsizeMode="tail" style={styles.greeting}>Hoi {profile.name}</Text></TouchableOpacity>
                <View style={styles.statusRowNew}><TouchableOpacity style={styles.statusPill} onPress={() => setShowContextModal(true)}><Feather name="home" size={12} color={theme.primary}/><Text style={styles.statusText}>{contexts.find(c=>c.id===currentContext)?.label || "Locatie"}</Text></TouchableOpacity><TouchableOpacity style={styles.statusPill} onPress={() => setShowPartnerModal(true)}><Feather name="user" size={12} color={theme.accent}/><Text style={[styles.statusText, {fontWeight:'bold'}]}>{activePartners.find(p=>p.id===currentPartner)?.label || "Partner"}</Text></TouchableOpacity></View>
            </View>
            <TouchableOpacity style={styles.profileBadge} onPress={() => setShowSettingsMenu(true)}><Text style={styles.profileText}>{profile.name ? profile.name[0] : '?'}</Text></TouchableOpacity>
          </View>
        )}

        {!isBuilding && !['BASIC_SETUP', 'CUSTOM_TEXTS', 'EXTENDED_SETUP', 'TOPIC_MANAGER', 'MANAGE_QUICK', 'MANAGE_PEOPLE_LOCATIONS'].includes(currentView) && (
          <><View style={styles.sentenceContainer}>{sentence.length === 0 ? <Text style={styles.placeholderText}>Zin wordt hier gebouwd...</Text> : <ScrollView horizontal>{sentence.map((w, i) => (<TouchableOpacity key={i} style={[styles.wordBubble, selectedWordIndex === i && {backgroundColor: theme.primary}]} onPress={() => setSelectedWordIndex(selectedWordIndex === i ? null : i)}><Text style={[styles.wordText, selectedWordIndex === i && {color:'#FFF'}]}>{w}</Text></TouchableOpacity>))}</ScrollView>}{sentence.length > 0 && <TouchableOpacity onPress={() => setSentence([])}><Feather name="x" size={24} color={theme.textDim}/></TouchableOpacity>}</View>{selectedWordIndex !== null && (<EditToolbar word={sentence[selectedWordIndex]} onMoveLeft={() => moveWordMain(-1)} onMoveRight={() => moveWordMain(1)} onDelete={deleteWordMain} onDeselect={() => setSelectedWordIndex(null)} />)}</>
        )}

        <ScrollView contentContainerStyle={[styles.scrollContent, {paddingBottom: 100}]} showsVerticalScrollIndicator={false}>
          {currentView === 'BASIC_SETUP' && <BasicSetupFlow onBack={handleBackFromSettings} initialData={profile} onSave={(d) => { setProfile(d); handleBackFromSettings(); }} onTriggerPopup={triggerPopup} />}
          {currentView === 'CUSTOM_TEXTS' && <CustomTextsFlow onBack={handleBackFromSettings} initialData={profile} onSave={(d) => { setProfile(d); handleBackFromSettings(); }} onTriggerPopup={triggerPopup} />}
          {currentView === 'EXTENDED_SETUP' && <ExtendedModeSetup profile={profile} extendedProfile={extendedProfile} onSave={(d) => { setExtendedProfile(d); handleBackFromSettings(); }} onClose={handleBackFromSettings} onTriggerPopup={triggerPopup} />}
          {currentView === 'HISTORY' && <HistoryView history={history} onBack={() => setCurrentView('HOME')} onSelect={setSelectedHistoryItem} />}
          
          {isBuilding && <SmartSentenceBuilder initialSentence={builderMode === 'ADD_TO_CATEGORY' ? [] : sentence} mode={builderMode} onCancel={() => setIsBuilding(false)} onSave={handleSaveBuilder} />}
          
          {currentView === 'HOME' && !isBuilding && (
             <>
               <View style={styles.section}><Text style={styles.label}>SNEL REAGEREN</Text>
               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                   {quickResponses.map((qr, i) => (<TouchableOpacity key={i} style={styles.quickBtn} onPress={() => handlePhrasePress(qr)}><Text style={styles.quickText}>{qr}</Text></TouchableOpacity>))}
                   <TouchableOpacity style={[styles.quickBtn, {backgroundColor: theme.surfaceHighlight, borderStyle:'dashed', borderColor: theme.primary}]} onPress={() => setShowAddQuick(true)}>
                       <Feather name="plus" size={20} color={theme.primary} />
                   </TouchableOpacity>
               </ScrollView>
               </View>
               <View style={styles.section}>
                  <TouchableOpacity style={styles.galleryBannerLarge} onPress={() => setCurrentView('GALLERY')}>
                      <View style={{flexDirection:'row', alignItems:'center'}}>
                          <View style={styles.galleryIconBadge}><Feather name="image" size={24} color="#FFF"/></View>
                          <Text style={styles.galleryBannerText}>Laten Zien</Text>
                      </View>
                      <Feather name="chevron-right" size={28} color="#FFF" />
                  </TouchableOpacity>
               </View>
               <View style={styles.section}><Text style={styles.label}>ONDERWERPEN</Text><View style={styles.catGrid}>{Object.keys(categories).map(catKey => (<TouchableOpacity key={catKey} style={styles.catTile} onPress={() => { setActiveCategory(catKey); setCurrentView('CATEGORY'); setIsEditingCategory(false); }}><Feather name={categories[catKey].icon || 'grid'} size={24} color={theme.primary} /><Text style={styles.catTitle}>{catKey}</Text></TouchableOpacity>))}</View></View>
             </>
          )}
          
          {currentView === 'CATEGORY' && !isBuilding && (
             <View style={styles.section}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 20}}><TouchableOpacity onPress={() => setCurrentView('HOME')} style={{flexDirection:'row'}}><Feather name="arrow-left" size={20} color={theme.textDim}/><Text style={{color:theme.textDim, marginLeft:10}}>Terug</Text></TouchableOpacity><TouchableOpacity onPress={() => setIsEditingCategory(!isEditingCategory)}><Text style={{color: isEditingCategory ? theme.primary : theme.textDim}}>{isEditingCategory ? "Klaar" : "Lijst Bewerken"}</Text></TouchableOpacity></View><Text style={styles.catHeaderBig}>{activeCategory}</Text><TouchableOpacity style={styles.addPhraseBtn} onPress={() => { setBuilderMode('ADD_TO_CATEGORY'); setIsBuilding(true); }}><Feather name="plus" size={24} color={theme.text} /><Text style={styles.addPhraseText}>Nieuwe zin toevoegen</Text></TouchableOpacity>
                <View style={styles.wordList}>{categories[activeCategory].items.map((item, i) => (<View key={i} style={styles.phraseRow}><TouchableOpacity style={{flex:1}} onPress={() => handlePhrasePress(item)}><Text style={styles.phraseText}>{item}</Text></TouchableOpacity>{isEditingCategory && (<View style={{flexDirection:'row', gap: 15}}><TouchableOpacity onPress={() => movePhrase(i, -1)}><Feather name="arrow-up" size={18} color={theme.textDim}/></TouchableOpacity><TouchableOpacity onPress={() => movePhrase(i, 1)}><Feather name="arrow-down" size={18} color={theme.textDim}/></TouchableOpacity><TouchableOpacity onPress={() => deletePhraseFromCategory(i)}><Feather name="trash-2" size={18} color={theme.danger}/></TouchableOpacity></View>)}</View>))}</View>
             </View>
          )}
          
          {currentView === 'GALLERY' && !isBuilding && (
            <View style={styles.section}><TouchableOpacity onPress={() => setCurrentView('HOME')} style={{marginBottom: 20, flexDirection:'row', alignItems:'center'}}><Feather name="arrow-left" size={20} color={theme.textDim} /><Text style={{color: theme.textDim, marginLeft: 10, fontWeight:'600'}}>Terug</Text></TouchableOpacity><Text style={styles.catHeaderBig}>Laten Zien</Text>
            <View style={styles.galleryGrid}>
                <TouchableOpacity style={styles.addPhotoCard} onPress={() => { setPhotoToEdit(null); setShowPhotoModal(true); }}><Feather name="plus" size={32} color={theme.primary} /><Text style={{color: theme.primary, marginTop: 8, fontWeight:'bold'}}>Foto</Text></TouchableOpacity>
                {gallery.map(photo => (<TouchableOpacity key={photo.id} style={styles.photoCard} onPress={() => handlePhrasePress(photo.text)} onLongPress={() => { setPhotoToEdit(photo); setShowPhotoModal(true); }}><View style={[styles.photoPlaceholder, {backgroundColor: photo.color}]} /><View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}><Text style={styles.photoCaption} numberOfLines={1}>{photo.text}</Text><Feather name="edit-2" size={12} color={theme.textDim} /></View></TouchableOpacity>))}
            </View></View>
          )}
        </ScrollView>

        {sentence.length > 0 && selectedWordIndex === null && !isBuilding && !['BASIC_SETUP', 'CUSTOM_TEXTS', 'EXTENDED_SETUP', 'TOPIC_MANAGER', 'MANAGE_QUICK', 'MANAGE_PEOPLE_LOCATIONS'].includes(currentView) ? (
          <OutputBar onSpeak={() => handleSpeak()} onCopy={handleCopy} onShow={handleShow} onClear={() => setSentence([])} />
        ) : !isBuilding && (currentView === 'HOME' || currentView === 'CATEGORY' || currentView === 'GALLERY' || currentView === 'HISTORY') ? (
           <View style={styles.fixedBottomNav}>
              <TouchableOpacity style={styles.navBtn} onPress={() => setShowEmergency(true)}>
                  <View style={styles.navIconContainer}><Feather name="shield" size={24} color={theme.danger} /></View>
                  <Text style={[styles.navLabel, {color: theme.danger}]}>Nood</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn} onPress={() => setIsInstantMode(!isInstantMode)}>
                  <View style={styles.navIconContainer}><Feather name={isInstantMode ? "zap" : "circle"} size={24} color={isInstantMode ? theme.warning : theme.textDim} /></View>
                  <Text style={[styles.navLabel, isInstantMode && {color: theme.warning}]}>Direct</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn} onPress={() => setShowToolsMenu(true)}>
                  <View style={styles.navIconContainer}><Feather name="grid" size={24} color={theme.text} /></View>
                  <Text style={styles.navLabel}>Menu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navBtn, styles.navBtnPrimary]} onPress={() => { setBuilderMode('SENTENCE'); setIsBuilding(true); }}>
                  <Feather name="edit-3" size={28} color="#000" />
                  <Text style={styles.navLabelPrimary}>Bouwen</Text>
              </TouchableOpacity>
           </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default function App() { 
  const [onboarded, setOnboarded] = useState(false);
  const [initialName, setInitialName] = useState("");
  const [initialPartner, setInitialPartner] = useState("");
  if(!onboarded) return <OnboardingFlow onComplete={(n, p) => { setInitialName(n); setInitialPartner(p); setOnboarded(true); }} />;
  return <MainApp initialName={initialName} initialPartner={initialPartner} />;
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.bg, paddingTop: Platform.OS === 'android' ? 35 : 0 },
  container: { flex: 1, backgroundColor: theme.bg },
  header: { padding: 24, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 26, fontWeight: '800', color: theme.text, marginBottom: 4 },
  statusRowNew: { flexDirection: 'row', marginTop: 4, flexWrap: 'wrap' },
  statusPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8, marginTop: 4, borderWidth: 1, borderColor: theme.surfaceHighlight },
  statusText: { color: theme.textHighContrast, fontSize: 12, marginLeft: 6, fontWeight: '600' },
  profileBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.surfaceHighlight, marginTop: 4 },
  profileText: { color: theme.primary, fontSize: 18, fontWeight: 'bold' },
  onbContainer: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' },
  onbCard: { width: '85%', backgroundColor: theme.surface, borderRadius: 24, padding: 30, alignItems: 'center' },
  onbTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  onbText: { fontSize: 16, color: theme.textDim, textAlign: 'center', marginBottom: 20 },
  onbInput: { width: '100%', backgroundColor: '#000', color: '#FFF', padding: 16, borderRadius: 12, fontSize: 18, marginBottom: 20, textAlign: 'center' },
  onbBtn: { backgroundColor: theme.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 30, marginTop: 10, alignItems: 'center' },
  onbBtnText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  phraseRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: theme.surfaceHighlight, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  phraseText: { color: theme.text, fontSize: 18 },
  sentenceContainer: { marginHorizontal: 24, marginBottom: 16, height: 70, backgroundColor: '#0F1623', borderRadius: 16, borderWidth: 1, borderColor: theme.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, justifyContent:'space-between' },
  wordBubble: { backgroundColor: theme.surfaceHighlight, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, height: 46, justifyContent: 'center' },
  wordText: { color: theme.text, fontSize: 16, fontWeight: '600' },
  placeholderText: { color: theme.textDim, fontStyle: 'italic', marginLeft: 8 },
  editToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.surface, padding: 12, marginHorizontal: 24, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: theme.primary },
  editInfo: { flex: 1 },
  editLabel: { color: theme.textDim, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  editWord: { color: theme.primary, fontSize: 16, fontWeight: 'bold' },
  editActions: { flexDirection: 'row' },
  editBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.surfaceHighlight, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  scrollContent: { paddingHorizontal: 24 },
  section: { marginBottom: 32 },
  label: { color: theme.textDim, fontSize: 12, fontWeight: '700', marginBottom: 12, letterSpacing: 1.2 },
  
  // GALLERY & GRID FIXES
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  catTile: { width: '48%', backgroundColor: theme.surface, padding: 20, borderRadius: 20, marginBottom: 16, height: 110, justifyContent: 'space-between' },
  catTitle: { color: theme.text, fontSize: 16, fontWeight: 'bold' },
  galleryBannerLarge: { width: '100%', backgroundColor: theme.primary, borderRadius: 20, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  galleryIconBadge: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center', marginRight: 16 },
  galleryBannerText: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  addPhotoCard: { width: '48%', aspectRatio: 1, backgroundColor: theme.surfaceHighlight, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderStyle: 'dashed', borderWidth: 2, borderColor: theme.primary },
  photoCard: { width: '48%', aspectRatio: 1, backgroundColor: theme.surface, borderRadius: 16, padding: 8, marginBottom: 16 },
  photoPlaceholder: { flex: 1, borderRadius: 8, marginBottom: 8 },
  photoCaption: { color: '#FFF', fontWeight: 'bold', flex: 1, marginRight: 4 },

  listItemRow: { flexDirection: 'row', backgroundColor: theme.surfaceHighlight, padding: 12, borderRadius: 8, marginBottom: 8, alignItems: 'center' },
  
  // FIXED BOTTOM NAV (NEW)
  fixedBottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: '#162032', borderTopWidth: 1, borderTopColor: theme.surfaceHighlight, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10, paddingHorizontal: 10 },
  navBtn: { alignItems: 'center', flex: 1, paddingVertical: 10 },
  navBtnPrimary: { backgroundColor: theme.primary, borderRadius: 16, flex: 1.2, marginHorizontal: 5, paddingVertical: 10, height: 60, justifyContent: 'center', transform: [{translateY: -5}] },
  navIconContainer: { marginBottom: 4 },
  navLabel: { fontSize: 11, color: theme.textDim, fontWeight: '600' },
  navLabelPrimary: { fontSize: 12, color: '#000', fontWeight: 'bold' },

  outputBar: { position: 'absolute', bottom: 30, left: 24, right: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  outputActions: { flexDirection: 'row', backgroundColor: '#162032', borderRadius: 30, padding: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  outputBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 24, marginLeft: 6 },
  outputBtnTextDark: { color: '#000', fontWeight: 'bold', marginLeft: 6 },
  outputBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 6 },
  outputBtnDestructive: { width: 50, height: 50, borderRadius: 25, backgroundColor: theme.surfaceHighlight, justifyContent: 'center', alignItems: 'center' },
  
  emergencyContainer: { flex: 1, backgroundColor: theme.emergencyBg },
  emergencyHeader: { padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  emergencyTitle: { color: theme.danger, fontSize: 24, fontWeight: '900', marginLeft: 16 },
  emergencyCard: { backgroundColor: theme.emergencyCard, padding: 20, borderRadius: 16, marginBottom: 20 },
  emLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  emValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  emValueSub: { color: '#EEE', fontSize: 16 },
  call112Btn: { backgroundColor: theme.danger, padding: 20, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  callText: { color: '#FFF', fontSize: 24, fontWeight: '900', marginLeft: 16 },
  callBtnSmall: { flex:1, backgroundColor: theme.surfaceHighlight, padding: 16, borderRadius: 16, alignItems: 'center', marginRight: 10 },
  callSmallText: { color: '#FFF', fontWeight: 'bold', marginTop: 8 },
  medLabel: { color: theme.danger, fontWeight: 'bold', marginTop: 20, marginBottom: 4 },
  medValue: { color: '#000', fontSize: 16 },
  historyItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.surfaceHighlight },
  historyTime: { color: theme.primary, fontSize: 12, marginBottom: 4 },
  historyText: { color: '#FFF', fontSize: 16 },
  aiFullSentenceBtn: { backgroundColor: theme.surfaceHighlight, padding: 16, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aiFullSentenceText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surfaceHighlight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 10 },
  aiBadgeText: { color: theme.textDim, fontWeight: 'bold', fontSize: 10, marginLeft: 4 },
  selectorItem: { alignItems: 'center', marginRight: 24, opacity: 0.5 },
  selectorItemActive: { opacity: 1 },
  selectorIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: theme.surfaceHighlight, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  selectorLabel: { color: '#FFF', fontWeight: 'bold' },
  formLabel: { color: theme.primary, fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  inputField: { backgroundColor: theme.surface, color: '#FFF', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 16 },
  quickBtn: { backgroundColor: theme.surface, paddingHorizontal: 20, paddingVertical: 16, borderRadius: 12, marginRight: 10, borderWidth:1, borderColor: theme.surfaceHighlight },
  quickText: { color: '#FFF', fontWeight:'bold', fontSize: 16 },
  addPhraseBtn: { flexDirection:'row', alignItems:'center', backgroundColor: theme.surfaceHighlight, padding: 16, borderRadius: 12, marginBottom: 20 },
  addPhraseText: { color: theme.text, fontWeight:'bold', marginLeft: 10 },
  catHeaderSmall: { fontSize: 20, fontWeight:'bold', color:'#FFF' },
  catHeaderBig: { fontSize: 28, fontWeight:'bold', color:'#FFF', marginBottom: 20 },
  builderContainerFull: { flex:1, backgroundColor: theme.bg, padding: 24 },
  builderHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 20 },
  builderPreview: { backgroundColor: theme.surface, minHeight: 80, borderRadius: 16, justifyContent:'center', marginBottom: 20, padding: 10 },
  builderWordChip: { backgroundColor: theme.surfaceHighlight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginHorizontal: 4 },
  aiMagicBtnFull: { backgroundColor: theme.primary, borderRadius: 12, padding: 12, flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 15 },
  aiMagicTextFull: { fontWeight:'bold', fontSize: 16 },
  suggestionBubble: { backgroundColor: theme.surfaceHighlight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth:1, borderColor: theme.primary },
  suggestionText: { color: '#FFF' },
  wordTabs: { flexDirection:'row', marginBottom: 15 },
  wordTab: { flex:1, alignItems:'center', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: theme.surfaceHighlight },
  wordTabText: { color: theme.textDim, fontWeight:'bold', fontSize: 12 },
  coreWordsGrid: { flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between' },
  coreWordTileLarge: { width:'48%', backgroundColor: theme.surface, padding: 20, borderRadius: 12, marginBottom: 12, alignItems:'center' },
  coreWordTextLarge: { color:'#FFF', fontSize: 18, fontWeight:'bold' },
  builderInputSmall: { flex:1, backgroundColor: theme.surface, borderRadius: 25, paddingHorizontal: 20, color:'#FFF', height: 50 },
  addBtnSmallRound: { width: 50, height: 50, borderRadius: 25, backgroundColor: theme.primary, justifyContent:'center', alignItems:'center', marginLeft: 10 },
  saveBtn: { backgroundColor: theme.primary, padding: 16, borderRadius: 16, alignItems:'center', marginTop: 10 },
  saveBtnText: { fontWeight:'bold', fontSize: 18 },
  fullScreenContainer: { flex:1, backgroundColor:'#000', justifyContent:'center', alignItems:'center', padding: 20 },
  fullScreenClose: { position:'absolute', top: 50, right: 30, alignItems:'center' },
  fullScreenContent: { transform: [{ rotate: '90deg'}] },
  fullScreenText: { color:'#FFF', fontSize: 50, fontWeight:'bold', textAlign:'center' },
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.8)', justifyContent:'flex-end' },
  selectorContainer: { backgroundColor: theme.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  selectorHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 24 },
  selectorTitle: { color:'#FFF', fontSize: 20, fontWeight:'bold' },
  menuItem: { flexDirection:'row', alignItems:'center', paddingVertical: 16, borderBottomWidth:1, borderBottomColor: theme.surfaceHighlight },
  menuItemTitle: { color:'#FFF', fontSize: 18, marginLeft: 16, fontWeight:'bold' },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tagChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: theme.surfaceHighlight, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: theme.surfaceHighlight },
  tagChipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  tagText: { color: theme.textDim, fontSize: 12 },
  builderInput: { backgroundColor: theme.surface, color: '#FFF', padding: 16, borderRadius: 12, fontSize: 16, marginTop: 10 },
  photoSourceRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  photoSourceBtn: { alignItems: 'center', backgroundColor: theme.surface, padding: 20, borderRadius: 16, width: '40%' },
  sourceText: { color: theme.textDim, marginTop: 8 },
  
  // NEW POPUP STYLES
  popupCard: { backgroundColor: theme.surface, width: '90%', alignSelf:'center', padding: 24, borderRadius: 24, alignItems: 'center', borderWidth:1, borderColor: theme.surfaceHighlight, marginBottom: '50%' },
  popupTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  popupMessage: { color: theme.textDim, fontSize: 18, textAlign: 'center', marginBottom: 24 },
  popupBtn: { backgroundColor: theme.surfaceHighlight, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 30 },
  popupBtnText: { color: '#FFF', fontWeight: 'bold' },
  popupIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },

  // HELPER TEXT
  helperText: { color: theme.primary, fontSize: 14, marginBottom: 4, marginTop: 12, fontStyle:'italic' }
});