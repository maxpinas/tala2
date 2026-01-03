import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';

/**
 * SimpleHome - Ultra-simplified home screen for Gewoon modus
 * Only shows: Snel Reageren, Praat, Laten Zien, Onderwerpen
 * No header clutter, no sentence bar, no complex UI
 */
// Speciale categorieën die bovenaan moeten staan
const SPECIAL_CATEGORIES = ['Persoonlijk', 'Aangepast', 'Herhaal'];

const SimpleHome = ({
  quickResponses,
  categories,
  history = [],
  onQuickResponse,
  onQuickResponseLongPress,
  onPraat,
  onLatenZien,
  onCategory,
  onHerhaal,
  onSettings,
  onSnel, // New: handler for Snel options (Over mij, Medisch, Nood)
  // Context props (hele objecten)
  activeLocation, // { id, label, icon, ... }
  activePerson, // { id, label, icon, name, ... }
  onLocationPress,
  onPersonPress,
}) => {
  // Filter normale categorieën (zonder speciale)
  const normalCategories = Object.keys(categories).filter(
    key => !SPECIAL_CATEGORIES.includes(key)
  );
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Header - app title left, settings right */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingHorizontal: 16, 
        paddingTop: 16,
        paddingBottom: 8
      }}>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '700' }}>Tala</Text>
        <TouchableOpacity 
          onPress={onSettings}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.surface,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Feather name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Context Knoppen - Grote, duidelijke knoppen voor Locatie en Persoon */}
      <View style={styles.contextBar}>
        <TouchableOpacity 
          style={[
            styles.contextButton,
            activeLocation?.id !== 'geen' && styles.contextButtonActive
          ]}
          onPress={onLocationPress}
          activeOpacity={0.7}
        >
          <View style={[
            styles.contextIconCircle,
            activeLocation?.id !== 'geen' && { backgroundColor: theme.primary }
          ]}>
            <Feather 
              name={activeLocation?.icon || 'map-pin'} 
              size={28} 
              color={activeLocation?.id !== 'geen' ? '#000' : theme.textDim} 
            />
          </View>
          <Text style={[
            styles.contextButtonLabel,
            activeLocation?.id !== 'geen' && styles.contextButtonLabelActive
          ]}>
            {activeLocation?.id !== 'geen' ? activeLocation?.label : 'Waar?'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.contextButton,
            activePerson?.id !== 'geen' && styles.contextButtonActive
          ]}
          onPress={onPersonPress}
          activeOpacity={0.7}
        >
          <View style={[
            styles.contextIconCircle,
            activePerson?.id !== 'geen' && { backgroundColor: theme.accent }
          ]}>
            <Feather 
              name={activePerson?.icon || 'user'} 
              size={28} 
              color={activePerson?.id !== 'geen' ? '#000' : theme.textDim} 
            />
          </View>
          <Text style={[
            styles.contextButtonLabel,
            activePerson?.id !== 'geen' && styles.contextButtonLabelActive
          ]}>
            {activePerson?.id !== 'geen' ? (activePerson?.name || activePerson?.label) : 'Met wie?'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* SNEL REAGEREN - Horizontal scroll of big tiles */}
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>Snel Reageren</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {quickResponses.map((qr, i) => (
              <QuickTile 
                key={i} 
                label={qr} 
                icon={getQuickIcon(qr)}
                onPress={() => onQuickResponse(qr)}
                onLongPress={() => onQuickResponseLongPress && onQuickResponseLongPress(qr)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Large Praat/Laten Zien removed — replaced by action row above */}

        {/* SNEL - Quick access to important info */}
              {/* ACTION ROW - Praat, Laten Zien, Snel (single tile) */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionTile, { backgroundColor: theme.surface }]}
                  onPress={onPraat}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIcon, { backgroundColor: theme.primary }]}> 
                    <Feather name="volume-2" size={22} color="#000" />
                  </View>
                  <Text style={styles.actionText}>Praat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionTile, { backgroundColor: theme.surface }]}
                  onPress={onLatenZien}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIcon, { backgroundColor: '#60A5FA' }]}> 
                    <Feather name="image" size={22} color="#000" />
                  </View>
                  <Text style={styles.actionText}>Laten Zien</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionTile, { backgroundColor: theme.surface }]}
                  onPress={() => onSnel && onSnel()}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIcon, { backgroundColor: '#F59E0B' }]}> 
                    <Feather name="zap" size={22} color="#000" />
                  </View>
                  <Text style={styles.actionText}>Snel</Text>
                </TouchableOpacity>
              </View>

        {/* ONDERWERPEN */}
        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Onderwerpen</Text>
          
          {/* SPECIALE TILES - 3 naast elkaar bovenaan */}
          <View style={styles.specialRow}>
            {/* Persoonlijk */}
            {categories['Persoonlijk'] && (
              <SpecialTile
                label="Persoonlijk"
                icon="user"
                color={theme.primary}
                count={categories['Persoonlijk'].items?.length || 0}
                onPress={() => onCategory('Persoonlijk')}
              />
            )}
            
            {/* Aangepast */}
            {categories['Aangepast'] && (
              <SpecialTile
                label="Aangepast"
                icon="edit-3"
                color={theme.accent}
                count={categories['Aangepast'].items?.length || 0}
                onPress={() => onCategory('Aangepast')}
              />
            )}
            
            {/* Herhaal (Geschiedenis) */}
            <SpecialTile
              label="Herhaal"
              icon="rotate-ccw"
              color="#F59E0B"
              count={history.length}
              onPress={onHerhaal}
            />
          </View>
          
          {/* NORMALE CATEGORIEËN - 2 koloms */}
          <View style={styles.categoryGrid}>
            {normalCategories.map((catKey) => (
              <CategoryTile
                key={catKey}
                label={catKey}
                icon={categories[catKey].icon || 'grid'}
                onPress={() => onCategory(catKey)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Quick response tile
const QuickTile = ({ label, icon, onPress, onLongPress }) => (
  <TouchableOpacity 
    style={styles.quickTile}
    onPress={onPress}
    onLongPress={onLongPress}
    delayLongPress={500}
    activeOpacity={0.8}
  >
    <View style={styles.quickTileIcon}>
      <Feather name={icon} size={24} color={theme.primary} />
    </View>
    <Text style={styles.quickTileText}>{label}</Text>
  </TouchableOpacity>
);

// Special tile (Persoonlijk, Aangepast, Herhaal) - 3 in a row
const SpecialTile = ({ label, icon, color, count, onPress }) => (
  <TouchableOpacity 
    style={[styles.specialTile, { backgroundColor: color }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.specialTileIcon}>
      <Feather name={icon} size={20} color={color} />
    </View>
    <Text style={styles.specialTileText}>{label}</Text>
    {count > 0 && (
      <View style={styles.specialTileBadge}>
        <Text style={styles.specialTileBadgeText}>{count}</Text>
      </View>
    )}
  </TouchableOpacity>
);

// Category tile
const CategoryTile = ({ label, icon, onPress }) => (
  <TouchableOpacity 
    style={styles.categoryTile}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.categoryTileIcon}>
      <Feather name={icon} size={28} color={theme.primary} />
    </View>
    <Text style={styles.categoryTileText}>{label}</Text>
  </TouchableOpacity>
);

// Get icon for quick response
const getQuickIcon = (text) => {
  const lower = text.toLowerCase();
  if (lower === 'ja') return 'check';
  if (lower === 'nee') return 'x';
  if (lower === 'moment' || lower === 'wacht') return 'clock';
  if (lower === 'misschien') return 'help-circle';
  return 'message-circle';
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: theme.textDim,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  quickTile: {
    width: 90,
    height: 100,
    backgroundColor: '#0369A1',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickTileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickTileText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryTile: {
    width: '47%',
    backgroundColor: theme.surfaceHighlight,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  categoryTileIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTileText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Special tiles row (3 in a row)
  specialRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  specialTile: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    minHeight: 90,
    justifyContent: 'center',
  },
  specialTileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialTileText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  specialTileBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  specialTileBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  /* New action row styles */
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  actionTile: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '700',
  },
  /* Context button styles - grote, duidelijke knoppen */
  contextBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  contextButton: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contextButtonActive: {
    borderColor: theme.primary,
    backgroundColor: theme.surfaceHighlight,
  },
  contextIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contextButtonLabel: {
    color: theme.textDim,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  contextButtonLabelActive: {
    color: theme.text,
    fontWeight: '700',
  },
});

export default SimpleHome;
