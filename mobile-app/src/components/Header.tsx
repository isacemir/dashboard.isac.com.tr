import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showNotification?: boolean;
  showProfile?: boolean;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showNotification = true,
  showProfile = true,
  onMenuPress,
  onNotificationPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <MaterialIcons name="menu" size={24} color="#006290" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.headerRight}>
        {showProfile && (
          <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
            <View style={styles.profileAvatar}>
              <Image 
                source={{ 
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl6wY5qRLLT47D5aBPK7iXmj7yWrF-H38dDh3qCyt8Ry6szr3ROZXA1v-YKaeA3ifh58rdunyv1V2sPS6RMXB3DAPW94cvs4TpzwBYYqjiDpkdNlZ5WyrpBoHheulf39NtaFxFxMZ1kdkfyD50btenYWw_vxs6H2WY9rl1JojzqjwV1fSJ67_QdjHiP7jRdrXaCiaz35ND-YWIQ-NHn90SsA4UqUdWtP9q2acdEx-JeZJgs9q8Jn0_NAQDihD_HTOLpA-7d73Dzw' 
                }}
                style={styles.profileImage}
              />
            </View>
          </TouchableOpacity>
        )}
        {showNotification && (
          <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
            <MaterialIcons name="notifications" size={24} color="#006290" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuButton: {
    padding: 4,
    borderRadius: 8,
  },
  headerText: {
    justifyContent: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#006290',
    fontFamily: 'Manrope',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 8,
    color: '#64748B',
    fontFamily: 'Inter',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
