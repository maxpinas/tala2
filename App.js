import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';

// --- THEMA ---
import { theme } from './src/theme';

// --- DATA ---
import { INITIAL_CATEGORIES, DEFAULT_CONTEXTS, DEFAULT_QUICK } from './src/data';

// --- UTILS ---
import { loadOnboarded, saveOnboarded } from './src/utils/storage';

// --- CONTEXT ---
import { AppProviders, useApp, useCategories } from './src/context';

// --- COMMON COMPONENTS ---
import { CustomPopup, SimpleInputModal, EditToolbar, OutputBar, SelectorModal } from './src/components/common';

// --- SCREENS ---
import { 
  OnboardingFlow, 
  BasicSetupFlow, 
  CustomTextsFlow, 
  HistoryView, 
  ListManagerScreen, 
  ManageTopicsScreen, 
  ManagePeopleLocations, 
  ManagePartnersScreen,
  ManageLocationsScreen,
  ExtendedModeSetup, 
  SmartSentenceBuilder,
  ProfileSetupFlow
} from './src/components/screens';

// --- MODALS ---
import { 
  SettingsMenuModal,
  ProfileMenuModal,
  ContentMenuModal,
  QuickAccessModal,
  EmergencyModal, 
  MedicalScreen, 
  PartnerScreen, 
  HistoryOptionsModal, 
  AddOrEditPhotoModal, 
  FullScreenShow 
} from './src/components/modals';

// --- MAIN APP WRAPPER (checks loading state) ---
const MainAppWrapper = ({ onReset }) => {
  const { isLoading } = useApp();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return <MainApp onReset={onReset} />;
};

// --- MAIN APP ---
const MainApp = ({ onReset }) => {
  // Get shared state from AppContext
  const { 
    profile, setProfile,
    extendedProfile, setExtendedProfile,
    contexts, setContexts,
    customPartners, setCustomPartners,
    quickResponses, setQuickResponses,
    activePartners,
    currentContext, setCurrentContext,
    currentPartner, setCurrentPartner,
    history, addToHistory,
    gallery, setGallery, addPhoto, updatePhoto,
    addContext, addPartner, addQuickResponse
  } = useApp();

  // Get categories state from CategoriesContext
  const {
    categories,
    setCategories,
    activeCategory,
    setActiveCategory,
    isEditingCategory,
    setIsEditingCategory
  } = useCategories();

  // Local UI state
  const [currentView, setCurrentView] = useState('HOME');
  const [sentence, setSentence] = useState([]);
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [builderMode, setBuilderMode] = useState('SENTENCE');
  const [isInstantMode, setIsInstantMode] = useState(false);

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showContentMenu, setShowContentMenu] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);       
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showPartnersScreen, setShowPartnersScreen] = useState(false);
  const [showLocationsScreen, setShowLocationsScreen] = useState(false);
  
  const [photoToEdit, setPhotoToEdit] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showPartnerScreen, setShowPartnerScreen] = useState(false);
  const [showMedicalScreen, setShowMedicalScreen] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  // currentContext and currentPartner now come from AppContext
  const [showContextModal, setShowContextModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  const handleBackFromSettings = () => { setCurrentView('HOME'); };
  const addPhraseToCategory = (text) => { if(!activeCategory) return; setCategories(prev => ({ ...prev, [activeCategory]: { ...prev[activeCategory], items: [...prev[activeCategory].items, text] } })); };
  const deletePhraseFromCategory = (idx) => { setCategories(prev => ({ ...prev, [activeCategory]: { ...prev[activeCategory], items: prev[activeCategory].items.filter((_, i) => i !== idx) } })); };
  const movePhrase = (idx, dir) => { const items = [...categories[activeCategory].items]; const newIdx = idx + dir; if(newIdx < 0 || newIdx >= items.length) return; [items[idx], items[newIdx]] = [items[newIdx], items[idx]]; setCategories(prev => ({ ...prev, [activeCategory]: { ...prev[activeCategory], items } })); };
  const handleSaveBuilder = (text) => { if (builderMode === 'ADD_TO_CATEGORY') { addPhraseToCategory(text); setIsBuilding(false); } else { setSentence(text.split(' ')); setIsBuilding(false); } };
  
  const handleSpeak = (textToSpeak) => {
    const txt = textToSpeak || sentence.join(' ');
    if (!txt) return;
    triggerPopup("Ik zeg:", txt, 'info');
    addToHistory(txt);
  };

  const handlePhrasePress = (text) => { if (isInstantMode) { handleSpeak(text); } else { setSentence(prev => [...prev, text]); } };

  const handleSavePhoto = (caption, category) => {
    const finalCaption = caption.trim() || "Kijk eens";
    if (photoToEdit) {
        updatePhoto(photoToEdit.id, finalCaption, category);
        setPhotoToEdit(null);
    } else {
        addPhoto(finalCaption, category);
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
      addContext(name);
  };

  const handleAddPartner = (name) => {
      addPartner(name);
  };

  const handleAddQuick = (text) => {
      addQuickResponse(text);
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
      <SettingsMenuModal visible={showSettingsMenu} onClose={() => setShowSettingsMenu(false)} onProfileMenu={() => setShowProfileMenu(true)} onContentMenu={() => setShowContentMenu(true)} onReset={onReset} />
      <ProfileMenuModal visible={showProfileMenu} onClose={() => setShowProfileMenu(false)} onNavigate={(v) => { if(v === 'PROFILE_SETUP') setShowProfileSetup(true); else if(v === 'CUSTOM_TEXTS') setCurrentView(v); }} />
      <ContentMenuModal visible={showContentMenu} onClose={() => setShowContentMenu(false)} onNavigate={(v) => { setCurrentView(v); }} onShowPartners={() => setShowPartnersScreen(true)} onShowLocations={() => setShowLocationsScreen(true)} />
      {showProfileSetup && <ProfileSetupFlow profile={profile} extendedProfile={extendedProfile} onSaveProfile={setProfile} onSaveExtended={setExtendedProfile} onClose={() => { setShowProfileSetup(false); setShowProfileMenu(true); }} onTriggerPopup={triggerPopup} />}
      {showPartnersScreen && <ManagePartnersScreen onClose={() => setShowPartnersScreen(false)} partners={customPartners} setPartners={setCustomPartners} />}
      {showLocationsScreen && <ManageLocationsScreen onClose={() => setShowLocationsScreen(false)} contexts={contexts} setContexts={setContexts} />}
      <QuickAccessModal visible={showQuickAccess} onClose={() => setShowQuickAccess(false)} onNavigate={(v) => { if(v === 'PARTNER_SCREEN') setShowPartnerScreen(true); else if(v === 'MEDICAL_SCREEN') setShowMedicalScreen(true); else if(v === 'EMERGENCY') setShowEmergency(true); }} />
      <EmergencyModal visible={showEmergency} onClose={() => setShowEmergency(false)} profile={profile} extended={extendedProfile} onTriggerPopup={triggerPopup} />
      <PartnerScreen visible={showPartnerScreen} onClose={() => setShowPartnerScreen(false)} text={profile.customPartnerText} name={profile.name} />
      <MedicalScreen visible={showMedicalScreen} onClose={() => setShowMedicalScreen(false)} profile={profile} extended={extendedProfile} text={profile.customMedicalText} />
      {showFullScreen && <FullScreenShow text={sentence.join(' ')} onClose={() => setShowFullScreen(false)} />}
      
      <SelectorModal visible={showContextModal} title="Waar ben je?" options={contexts} selectedId={currentContext} onSelect={setCurrentContext} onClose={() => setShowContextModal(false)} onAdd={() => { setShowContextModal(false); setShowAddContext(true); }} />
      <SelectorModal visible={showPartnerModal} title="Met wie praat je?" options={activePartners} selectedId={currentPartner} onSelect={setCurrentPartner} onClose={() => setShowPartnerModal(false)} onAdd={() => { setShowPartnerModal(false); setShowAddPartner(true); }} />

      {currentView === 'TOPIC_MANAGER' && <ManageTopicsScreen onClose={handleBackFromSettings} categories={categories} setCategories={setCategories} />}
      {currentView === 'MANAGE_QUICK' && <ListManagerScreen title="Beheer Snel Reageren" items={quickResponses} onUpdate={setQuickResponses} onClose={handleBackFromSettings} type="string" />}

      <View style={styles.container}>
        {!isBuilding && !['BASIC_SETUP', 'CUSTOM_TEXTS', 'EXTENDED_SETUP', 'TOPIC_MANAGER', 'MANAGE_QUICK'].includes(currentView) && (
          <View style={styles.header}>
            <View style={{flex: 1, paddingRight: 10}}>
                <TouchableOpacity onPress={() => setCurrentView('HOME')}><Text numberOfLines={1} ellipsizeMode="tail" style={styles.greeting}>Hoi {profile.name}</Text></TouchableOpacity>
                <View style={styles.statusRowNew}><TouchableOpacity style={styles.statusPill} onPress={() => setShowContextModal(true)}><Feather name="home" size={12} color={theme.primary}/><Text style={styles.statusText}>{contexts.find(c=>c.id===currentContext)?.label || "Locatie"}</Text></TouchableOpacity><TouchableOpacity style={styles.statusPill} onPress={() => setShowPartnerModal(true)}><Feather name="user" size={12} color={theme.accent}/><Text style={[styles.statusText, {fontWeight:'bold'}]}>{activePartners.find(p=>p.id===currentPartner)?.label || "Partner"}</Text></TouchableOpacity></View>
            </View>
            <TouchableOpacity style={styles.profileBadge} onPress={() => setShowSettingsMenu(true)}><Text style={styles.profileText}>{profile.name ? profile.name[0] : '?'}</Text></TouchableOpacity>
          </View>
        )}

        {!isBuilding && !['BASIC_SETUP', 'CUSTOM_TEXTS', 'EXTENDED_SETUP', 'TOPIC_MANAGER', 'MANAGE_QUICK'].includes(currentView) && (
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

        {sentence.length > 0 && selectedWordIndex === null && !isBuilding && !['BASIC_SETUP', 'CUSTOM_TEXTS', 'EXTENDED_SETUP', 'TOPIC_MANAGER', 'MANAGE_QUICK', 'MANAGE_PEOPLE_LOCATIONS', 'PROFILE_SETUP'].includes(currentView) ? (
          <OutputBar onSpeak={() => handleSpeak()} onCopy={handleCopy} onShow={handleShow} onClear={() => setSentence([])} />
        ) : !isBuilding && (currentView === 'HOME' || currentView === 'CATEGORY' || currentView === 'GALLERY' || currentView === 'HISTORY') ? (
           <View style={styles.fixedBottomNav}>
              <TouchableOpacity style={[styles.navBtn, styles.navBtnPrimary]} onPress={() => { setBuilderMode('SENTENCE'); setIsBuilding(true); }}>
                  <Feather name="message-circle" size={28} color="#000" />
                  <Text style={styles.navLabelPrimary}>Praten</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentView('HISTORY')}>
                  <View style={styles.navIconContainer}><Feather name="clock" size={24} color={theme.text} /></View>
                  <Text style={styles.navLabel}>Herhaal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn} onPress={() => setIsInstantMode(!isInstantMode)}>
                  <View style={styles.navIconContainer}><Feather name={isInstantMode ? "zap" : "circle"} size={24} color={isInstantMode ? theme.warning : theme.textDim} /></View>
                  <Text style={[styles.navLabel, isInstantMode && {color: theme.warning}]}>Direct</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn} onPress={() => setShowQuickAccess(true)}>
                  <View style={styles.navIconContainer}><Feather name="shield" size={24} color={theme.danger} /></View>
                  <Text style={[styles.navLabel, {color: theme.danger}]}>Snel</Text>
              </TouchableOpacity>
           </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default function App() { 
  const [onboarded, setOnboarded] = useState(null); // null = loading
  const [appKey, setAppKey] = useState(0); // Key to force re-mount

  // Check onboarding status on mount
  useEffect(() => {
    loadOnboarded().then(value => setOnboarded(value === true));
  }, [appKey]); // Re-check when appKey changes

  // Handle app reset
  const handleReset = () => {
    setOnboarded(null);
    setAppKey(prev => prev + 1); // Force re-mount
  };

  // Show loading while checking onboarding status
  if (onboarded === null) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  if (!onboarded) {
    return (
      <OnboardingFlow 
        onComplete={(n, p) => { 
          // Save profile data immediately during onboarding
          saveOnboarded(true);
          setOnboarded(true); 
        }} 
      />
    );
  }

  // Profile data is now loaded from AsyncStorage in AppContext
  return (
    <AppProviders key={appKey}>
      <MainAppWrapper onReset={handleReset} />
    </AppProviders>
  );
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
  phraseRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: theme.surfaceHighlight, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  phraseText: { color: theme.text, fontSize: 18 },
  sentenceContainer: { marginHorizontal: 24, marginBottom: 16, height: 70, backgroundColor: '#0F1623', borderRadius: 16, borderWidth: 1, borderColor: theme.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, justifyContent:'space-between' },
  wordBubble: { backgroundColor: theme.surfaceHighlight, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, height: 46, justifyContent: 'center' },
  wordText: { color: theme.text, fontSize: 16, fontWeight: '600' },
  placeholderText: { color: theme.textDim, fontStyle: 'italic', marginLeft: 8 },
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

  quickBtn: { backgroundColor: theme.surface, paddingHorizontal: 20, paddingVertical: 16, borderRadius: 12, marginRight: 10, borderWidth:1, borderColor: theme.surfaceHighlight },
  quickText: { color: '#FFF', fontWeight:'bold', fontSize: 16 },
  addPhraseBtn: { flexDirection:'row', alignItems:'center', backgroundColor: theme.surfaceHighlight, padding: 16, borderRadius: 12, marginBottom: 20 },
  addPhraseText: { color: theme.text, fontWeight:'bold', marginLeft: 10 },
  catHeaderBig: { fontSize: 28, fontWeight:'bold', color:'#FFF', marginBottom: 20 },
});
