import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import { WORD_CATEGORIES } from '../../data';
import { getAISuggestions, getAIFullSentences } from '../../services';
import { EditToolbar, CompactBuilderView } from '../common';
import { useApp } from '../../context';
import styles from '../../styles';

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

  const { isGebruikMode } = useApp();

  const aiSuggestions = getAISuggestions(sentence);
  const aiFullSentences = getAIFullSentences(sentence);
  
  const addWord = (w) => { setSentence([...sentence, w]); setSelIdx(null); };
  const moveWord = (dir) => { 
    if (selIdx === null) return; 
    const newIdx = selIdx + dir; 
    if (newIdx >= 0 && newIdx < sentence.length) { 
      const newS = [...sentence]; 
      [newS[selIdx], newS[newIdx]] = [newS[newIdx], newS[selIdx]]; 
      setSentence(newS); 
      setSelIdx(newIdx); 
    } 
  };
  const deleteWord = () => { 
    if (selIdx !== null) { 
      setSentence(sentence.filter((_, i) => i !== selIdx)); 
      setSelIdx(null); 
    } 
  };
  const handleSave = () => { 
    const finalSentence = sentence.join(' ') + (customInput ? " " + customInput : ""); 
    if (!finalSentence.trim()) return; 
    onSave(finalSentence.trim()); 
  };
  const addCustomWord = () => { 
    if(customInput.trim()) { 
      addWord(customInput.trim()); 
      setCustomInput(""); 
    } 
  };

  return (
    <View style={styles.builderContainerFull}>
      <Modal visible={showAiModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.selectorContainer}>
            <View style={styles.selectorHeader}>
              <Text style={styles.selectorTitle}>✨ Bedoel je misschien:</Text>
              <TouchableOpacity onPress={() => setShowAiModal(false)}>
                <Feather name="x" size={24} color="#FFF"/>
              </TouchableOpacity>
            </View>
            {aiFullSentences.map((s, i) => (
              <TouchableOpacity 
                key={i} 
                style={styles.aiFullSentenceBtn} 
                onPress={() => { setSentence(s.split(' ')); setShowAiModal(false); }}
              >
                <Text style={styles.aiFullSentenceText}>{s}</Text>
                <Feather name="chevron-right" size={20} color={theme.textDim} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      
      <View style={styles.builderHeader}>
        <Text style={styles.label}>{mode === 'ADD_TO_CATEGORY' ? 'ZIN TOEVOEGEN' : 'ZINSBOUWER'}</Text>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={() => setSentence([])} style={{marginRight: 20}}>
            <Text style={{color: theme.warning}}>Wis Alles</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel}>
            <Text style={{color: theme.danger}}>Sluiten</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.builderPreview}>
        <ScrollView horizontal contentContainerStyle={{alignItems:'center'}}>
          {sentence.length === 0 && !customInput ? (
            <Text style={{color: theme.textDim, fontSize: 18}}>Tik op woorden...</Text>
          ) : null}
          {sentence.map((w, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => setSelIdx(selIdx === i ? null : i)} 
              style={[styles.builderWordChip, selIdx === i && {backgroundColor: theme.primary}]}
            >
              <Text style={{color: selIdx === i ? '#000' : '#FFF', fontWeight:'bold', fontSize: 18}}>{w}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {selIdx !== null && (
        <EditToolbar 
          word={sentence[selIdx]} 
          onMoveLeft={() => moveWord(-1)} 
          onMoveRight={() => moveWord(1)} 
          onDelete={deleteWord} 
          onDeselect={() => setSelIdx(null)} 
        />
      )}
      
      <TouchableOpacity style={styles.aiMagicBtnFull} onPress={() => setShowAiModal(true)}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Feather name="star" size={18} color="#000" />
          <Text style={styles.aiMagicTextFull}>✨ Maak zin af</Text>
        </View>
        <Feather name="chevron-right" size={18} color="#000" />
      </TouchableOpacity>
      
      <View style={{marginBottom: 15, height: 50}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems:'center'}}>
          <View style={styles.aiBadge}>
            <Feather name="zap" size={12} color="#000" />
            <Text style={styles.aiBadgeText}>Tips:</Text>
          </View>
          {aiSuggestions.map((sug, i) => (
            <TouchableOpacity key={i} style={styles.suggestionBubble} onPress={() => addWord(sug)}>
              <Text style={styles.suggestionText}>{sug}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {isGebruikMode ? (
        <CompactBuilderView
          onWho={() => setBuilderTab('WIE')}
          onDo={() => setBuilderTab('DOE')}
          onWhat={() => setBuilderTab('WAT')}
          onWhere={() => setBuilderTab('WAAR')}
        />
      ) : (
        <View style={styles.wordTabs}>
          {Object.keys(WORD_CATEGORIES).map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.wordTab, builderTab === cat && {backgroundColor: theme[cat === 'WIE' ? 'catPeople' : cat === 'DOE' ? 'catAction' : cat === 'WAT' ? 'catThing' : 'catPlace']}]} 
              onPress={() => setBuilderTab(cat)}
            >
              <Text style={[styles.wordTabText, builderTab === cat && {color: '#000'}]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <View style={{flex: 1}}>
        <View style={styles.coreWordsGrid}>
          {WORD_CATEGORIES[builderTab].map((word, i) => (
            <TouchableOpacity key={i} style={styles.coreWordTileLarge} onPress={() => addWord(word)}>
              <Text style={styles.coreWordTextLarge}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={{flexDirection:'row', alignItems:'center', marginTop: 10, marginBottom: 10}}>
        <TextInput 
          style={styles.builderInputSmall} 
          placeholder="Of typ zelf..." 
          placeholderTextColor={theme.textDim} 
          value={customInput} 
          onChangeText={setCustomInput}
        />
        <TouchableOpacity style={styles.addBtnSmallRound} onPress={addCustomWord}>
          <Feather name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>
          {mode === 'ADD_TO_CATEGORY' ? 'Nieuwe zin toevoegen' : 'Plaats in Balk'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SmartSentenceBuilder;
