import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SalesTrendData {
  month: string;
  value: number;
}

interface SalesTrendChartProps {
  title: string;
  subtitle: string;
  data: SalesTrendData[];
}

const { width } = Dimensions.get('window');

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  title,
  subtitle,
  data,
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const chartWidth = width - 64; // 32px padding each side
  const barWidth = (chartWidth / data.length) - 4;

  const getBarHeight = (value: number): number => {
    return (value / maxValue) * 100; // Percentage height
  };

  const getBarOpacity = (index: number): number => {
    const opacity = 0.1 + (index * 0.1);
    return Math.min(opacity + 0.2, 1); // Match HTML opacity values
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{subtitle}</Text>
        </View>
      </View>
      
      <View style={styles.chartContent}>
        <View style={styles.chart}>
          {data.map((item, index) => {
            const height = getBarHeight(item.value);
            const isHighest = item.value === maxValue;
            const opacity = getBarOpacity(index);
            
            return (
              <View key={index} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${height}%`,
                      width: barWidth,
                      backgroundColor: `rgba(0, 98, 144, ${opacity})`,
                    },
                  ]}
                />
                {isHighest && (
                  <View style={styles.valueLabel}>
                    <Text style={styles.valueText}>
                      €{(item.value / 1000000).toFixed(1)}M
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        
        <View style={styles.chartLabels}>
          <Text style={styles.chartLabel}>OCAK</Text>
          <Text style={styles.chartLabel}>MART</Text>
          <Text style={[styles.chartLabel, styles.chartLabelActive]}>HAZİRAN</Text>
          <Text style={styles.chartLabel}>EYLÜL</Text>
        </View>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
  },
  badge: {
    backgroundColor: '#e5e8ed',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6f7881',
    fontFamily: 'Inter',
  },
  chartContent: {
    flex: 1,
  },
  chart: {
    height: 160,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  bar: {
    backgroundColor: '#006290',
    borderRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    minHeight: 8,
  },
  valueLabel: {
    position: 'absolute',
    top: -32,
    backgroundColor: '#181c20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  valueText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6f7881',
    fontFamily: 'Inter',
  },
  chartLabelActive: {
    color: '#006290',
  },
});
