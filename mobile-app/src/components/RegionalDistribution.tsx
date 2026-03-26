import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface RegionalData {
  region: string;
  value: string;
  percentage: number;
}

interface RegionalDistributionProps {
  title: string;
  subtitle: string;
  data: RegionalData[];
}

export const RegionalDistribution: React.FC<RegionalDistributionProps> = ({
  title,
  subtitle,
  data,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <MaterialIcons name="map" size={24} color="#006290" />
      </View>
      
      <View style={styles.regionsContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.regionItem}>
            <View style={styles.regionHeader}>
              <Text style={styles.regionName}>{item.region}</Text>
              <Text style={styles.regionValue}>{item.value}</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${item.percentage}%`,
                    backgroundColor: `rgba(0, 98, 144, ${1 - (index * 0.2)})`
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Inter',
    marginTop: 2,
  },
  regionsContainer: {
    gap: 20,
  },
  regionItem: {
    gap: 8,
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Inter',
  },
  regionValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006290',
    fontFamily: 'Inter',
  },
  progressBar: {
    height: 6,
    width: '100%',
    backgroundColor: '#e5e8ed',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#006290',
    borderRadius: 3,
  },
});
