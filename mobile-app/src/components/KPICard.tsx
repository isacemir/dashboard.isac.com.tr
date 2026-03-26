import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: 'primary' | 'secondary' | 'tertiary';
  trend?: string;
  size: 'large' | 'small';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  size,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.06,
      shadowRadius: 40,
      elevation: 10,
      justifyContent: 'space-between',
      flex: 1,
    };
    
    if (size === 'large') {
      baseStyle.minHeight = 140;
    } else {
      baseStyle.width = 160;
      baseStyle.minHeight = 120;
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = '#bfc7d125';
    }
    
    return baseStyle;
  };

  const iconColor = {
    primary: '#006290',
    secondary: '#b7131a',
    tertiary: '#7b5500',
  }[color];

  const iconBackgroundColor = {
    primary: '#8ecdff20',
    secondary: '#ffdad620',
    tertiary: '#ffdeac20',
  }[color];

  const trendColor = {
    primary: '#006290',
    secondary: '#b7131a',
    tertiary: '#7b5500',
  }[color];

  return (
    <View style={getCardStyle()}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
          <MaterialIcons name={icon} size={24} color={iconColor} />
        </View>
        {trend && (
          <View style={[styles.trendBadge, { backgroundColor: trendColor }]}>
            <Text style={styles.trendText}>{trend}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardLabel}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
        {subtitle && (
          <View style={styles.subtitleContainer}>
            <MaterialIcons name="description" size={14} color={iconColor} />
            <Text style={[styles.cardSubtitle, { color: iconColor }]}>
              {subtitle}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  cardLarge: {
    minHeight: 140,
  },
  cardSmall: {
    width: 160,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#bfc7d125',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6f7881',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
    marginBottom: 8,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
});
