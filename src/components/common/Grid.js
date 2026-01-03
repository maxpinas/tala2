import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { spacing } from '../../theme';

/**
 * Grid Component
 * Herbruikbare grid layout voor tiles
 * 
 * @param {number} columns - Aantal kolommen (standaard 2)
 * @param {number} gap - Ruimte tussen items (standaard tileGap)
 * @param {React.ReactNode} children - Grid items
 * @param {object} style - Extra styling
 */
const Grid = ({ 
  columns = 2, 
  gap = spacing.tileGap || 12, 
  children, 
  style 
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const childArray = React.Children.toArray(children);
  
  // Bereken de beschikbare breedte (scherm - container padding van parent)
  const containerPadding = (spacing.lg || 16) * 2; // Gebruikt lg padding van tabContentContainer
  const availableWidth = screenWidth - containerPadding;
  
  // Bereken de breedte van elk item
  const totalGapWidth = gap * (columns - 1);
  const itemWidth = (availableWidth - totalGapWidth) / columns;

  return (
    <View style={[styles.grid, style]}>
      {childArray.map((child, index) => {
        // Bepaal of dit item rechts moet staan (elke tweede kolom)
        const isRightColumn = (index % columns) === (columns - 1);
        
        return (
          <View 
            key={index} 
            style={[
              styles.gridItem, 
              { 
                width: itemWidth,
                marginRight: isRightColumn ? 0 : gap,
                marginBottom: gap,
              }
            ]}
          >
            {child}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    // Basis stijl voor grid items
  },
});

export default Grid;
