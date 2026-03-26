import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '../components/Header';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 380;
const isTablet = width > 768;

const activities = [
  {
    id: 1,
    title: 'Müşteri Tanıtım Toplantısı',
    description: 'Global Tech Solutions - Yeni Proje Sunumu',
    time: '10:30',
    type: 'meeting',
    icon: 'groups',
    color: '#006290',
    bgColor: '#00629020',
    person: 'Ahmet Yılmaz',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa2MUyrUGEq1rpS-xX-io6ve9FKI_14KohPQChgtECYfOjg2qJ9foSQ3L6AJgMxpWZMdr8YTRUDAUxDegCHBi9sYaECqsjgCLFk5qWXE3J62tiEmhGce8ZEqSEcOlSoRofg-dqEnT9swCpeh-Z2UuyrzuCvzL2qKpDFnwoEotb5F-oju2zb_ur6Z3V8B3Dbba2EoGKY5arMzPr-16RzgzdNFj0E5186nGgTYXbXGLMagGeeY__jo0a1mcKWffCTNyKiKAm2B5z5w',
  },
  {
    id: 2,
    title: 'Sözleşme Revizyonu',
    description: 'Artı Mimarlık - Yıllık Bakım Anlaşması',
    time: '14:00',
    type: 'contract',
    icon: 'handshake',
    color: '#db322f',
    bgColor: '#db322f20',
    person: 'Elif Demir',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2ZKkFpEHRzw_bVtExc743aeJiKRIlFNNa1AAB2h8HXgfD1jQcCJOe3oEaRtTKAwhQLqAcBPDfYwsGY4TNBSSn3J1tfSYRzKNgQYPBdNEyEmtA2XZfqR_ux3_MMd4pmKEJGvywb9HVdxDjG0aSqEb4IvnKJxcqfIxHYFvxfRjZ_Fb1MAySGSvE-G3o9I4BoHtRdMlZd4BDrosKNJvFoGoWtTfKsoRrgtczENK4lx76H-fy8xzKKGCXjmy2j3fNsMjaCwoPfmnS6A',
  },
];

const personnel = [
  {
    id: 1,
    name: 'Selim Ak',
    role: 'Satış Temsilcisi',
    performance: 85,
    status: 'online',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDROuJrK5KAB_fT7WlBXSKcYqxDgj9wYq5CQZkRVXQLzdmS6bFWkCPNlu5CBfqTiEEwBewjWq_3XrgQ6YD3sAlzhZr_ApXTfx4-kEa1PCMciHvAgPIaBiTfIDLhXMKWIZ5j1Oj1BUDR7DiJ-2-qnyqTUbU2TXFpP2RYPmPeM0Ewmr9Xspu9v-6mJG1-VXYH65JPB0iq5LIxEkzdZ4_EAg7lyAyeABRiHa6lj6T7cqyRiYXhRVwsy4l22Mj5aveF-hH8Sw6b_hEAAQ',
    isHighlighted: false,
  },
  {
    id: 2,
    name: 'Canan Mert',
    role: 'Müşteri İlişkileri',
    performance: 94,
    status: 'online',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgucVaaWFj5MkTZ57Gl5ERh9fH4FHU9ffr8Kt7ZpyWLkA6Jt4WdV7G6ThnPNKhNRK6LA5qw0_5GwiBoUQs2vuk1kX4Qv5HBiS-YK76SRGy2mZyA0-SFdKwlgxjkirscDvRzHQx_pRlttkXRmkt7okUKkz6OP3YTrQzfoF0ATgnvgKkc6KFeBArfQZ0frRIDq7Ol2-DJMIrmds54RaQzw6c95P9vMPYD6l1pdmfYegRUc4IOE30Pg36HpsgkL0PbjcnNh3SQdHmTA',
    isHighlighted: true,
  },
  {
    id: 3,
    name: 'Murat Soydan',
    role: 'Kıdemli Uzman',
    performance: 62,
    status: 'busy',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeOKwSuJoItbcWy9aBJJ-sCqwHH1Mog7aTnQmZqqtKk-Qm91NvHt6dTb7Hkwshi2bgMPUY2-14fLa9_COu3krwgq7NyIFdPN3__JVQiJOQVd8lId_UY96nCj6UVaphOqHHCpVugDtAmqb_DNNHtNR2aHqy82xnMNuelTPoFuMFVvMW5sEznEYr5jTbzxrM9m0XcFIXq_hB9y6PgAERVX40HAibLtx6-06xrb55qb6Bi9pL385st8fEWngoIctTjRmB_0V86KMTJg',
    isHighlighted: false,
  },
];

const reminders = [
  {
    id: 1,
    title: 'Teklif Onayı Bekleniyor',
    time: '16:30 - Digital Ocean',
    type: 'urgent',
    color: '#ffba38',
  },
  {
    id: 2,
    title: 'Haftalık Rapor',
    time: 'Yarın - 09:00',
    type: 'normal',
    color: '#64748b',
  },
];

export const CRMScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(24);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="ISAC Sense Digital"
        subtitle="CRM"
        showNotification={true}
        showProfile={true}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.addButton}>
            <MaterialIcons name="add" size={16} color="#ffffff" />
            <Text style={styles.addButtonText}>Aktivite Ekle</Text>
          </TouchableOpacity>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="call" size={20} color="#006290" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="mail" size={20} color="#006290" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.dateDisplay}>
            <Text style={styles.dateText}>Pazartesi, 24 Haziran 2024</Text>
          </View>
        </View>

        {/* Today's Activities */}
        <View style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>Bugün Yapılacaklar</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activitiesScrollContent}
          >
            {activities.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <View style={[styles.activityIcon, { backgroundColor: activity.bgColor }]}>
                    <MaterialIcons name={activity.icon as any} size={20} color={activity.color} />
                  </View>
                  <View style={[styles.timeBadge, { backgroundColor: activity.bgColor }]}>
                    <Text style={[styles.timeText, { color: activity.color }]}>
                      {activity.time}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                
                <View style={styles.activityFooter}>
                  <Image source={{ uri: activity.avatar }} style={styles.avatar} />
                  <Text style={styles.personName}>{activity.person}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Personnel Performance */}
        <View style={styles.personnelSection}>
          <View style={styles.personnelHeader}>
            <Text style={styles.sectionTitle}>Personel Performansı</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.personnelGrid}>
            {personnel.map((person) => (
              <View
                key={person.id}
                style={[
                  styles.personCard,
                  person.isHighlighted && styles.personCardHighlighted,
                ]}
              >
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: person.avatar }} style={styles.personAvatar} />
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          person.status === 'online'
                            ? '#10b981'
                            : person.status === 'busy'
                            ? '#f59e0b'
                            : '#64748b',
                      },
                    ]}
                  />
                </View>
                
                <Text style={styles.personName}>{person.name}</Text>
                <Text style={styles.personRole}>{person.role}</Text>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${person.performance}%`,
                          backgroundColor:
                            person.performance >= 90
                              ? '#db322f'
                              : person.performance >= 70
                              ? '#006290'
                              : '#ffba38',
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.performanceText,
                      {
                        color:
                          person.performance >= 90
                            ? '#db322f'
                            : person.performance >= 70
                            ? '#006290'
                            : '#ffba38',
                      },
                    ]}
                  >
                    %{person.performance} Hedef
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Calendar & Insights */}
        <View style={styles.calendarSection}>
          {/* Mini Calendar */}
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Haziran 2024</Text>
              <View style={styles.calendarNav}>
                <TouchableOpacity>
                  <MaterialIcons name="chevron-left" size={16} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <MaterialIcons name="chevron-right" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.weekDays}>
              {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map((day) => (
                <Text key={day} style={styles.weekDay}>{day}</Text>
              ))}
            </View>
            
            <View style={styles.calendarGrid}>
              {[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3].map((day, index) => (
                <Text
                  key={day}
                  style={[
                    styles.calendarDay,
                    day === 24 && styles.selectedDay,
                    index < 4 && styles.dimDay,
                  ]}
                >
                  {day}
                </Text>
              ))}
            </View>
            
            <View style={styles.reminders}>
              <Text style={styles.remindersTitle}>Yaklaşan Hatırlatıcılar</Text>
              
              {reminders.map((reminder) => (
                <View key={reminder.id} style={styles.reminder}>
                  <View
                    style={[
                      styles.reminderDot,
                      { backgroundColor: reminder.color },
                    ]}
                  />
                  <View style={styles.reminderContent}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <Text style={styles.reminderTime}>{reminder.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Visual Insight Card */}
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightLabel}>Aylık Kazanım</Text>
            </View>
            <Text style={styles.insightAmount}>₺842.000</Text>
            <View style={styles.insightTrend}>
              <MaterialIcons name="trending-up" size={14} color="#ffffff" />
              <Text style={styles.insightTrendText}>Geçen aya göre %12 artış</Text>
            </View>
            <MaterialIcons name="payments" size={96} color="#ffffff" style={styles.insightIcon} />
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f9fe',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'Inter',
  },
  
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 40,
    marginBottom: 32,
  },
  addButton: {
    backgroundColor: '#006290',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#006290',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 5,
  },
  dateDisplay: {
    marginLeft: 'auto',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Inter',
  },
  
  // Activities Section
  activitiesSection: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#181c20',
    fontFamily: 'Manrope',
    marginBottom: 24,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  activitiesScrollContent: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 24,
  },
  activityCard: {
    width: isSmallScreen ? width - 48 : 280,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 5,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontFamily: 'Inter',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  activityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  personName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
    marginBottom: 4,
  },
  personRole: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  
  // Personnel Section
  personnelSection: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  personnelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006290',
    fontFamily: 'Inter',
  },
  personnelGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  personCard: {
    flex: 1,
    backgroundColor: '#f1f4f9',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  personCardHighlighted: {
    borderWidth: 2,
    borderColor: '#00629020',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  personAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  performanceText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 8,
    fontFamily: 'Inter',
  },
  
  // Calendar Section
  calendarSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    flexDirection: isSmallScreen ? 'column' : 'row',
    gap: 32,
  },
  calendarCard: {
    flex: 1,
    backgroundColor: '#f1f4f9',
    borderRadius: 16,
    padding: 24,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
  },
  calendarNav: {
    flexDirection: 'row',
    gap: 8,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weekDay: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    fontFamily: 'Inter',
    flex: 1,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  calendarDay: {
    width: 24,
    height: 24,
    textAlign: 'center',
    fontSize: 12,
    color: '#181c20',
    fontFamily: 'Inter',
  },
  selectedDay: {
    backgroundColor: '#006290',
    color: '#ffffff',
    borderRadius: 12,
    fontWeight: '700',
  },
  dimDay: {
    color: '#94a3b8',
  },
  reminders: {
    gap: 16,
  },
  remindersTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#64748B',
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  reminder: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  reminderDot: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginTop: 2,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
    marginBottom: 2,
  },
  reminderTime: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Inter',
  },
  
  // Insight Card
  insightCard: {
    width: isSmallScreen ? '100%' : 200,
    height: 192,
    backgroundColor: '#007bb5',
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  insightHeader: {
    marginBottom: 8,
  },
  insightLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#ffffff',
    opacity: 0.8,
    fontFamily: 'Inter',
  },
  insightAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Manrope',
    marginBottom: 8,
  },
  insightTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  insightTrendText: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  insightIcon: {
    position: 'absolute',
    top: 16,
    right: 24,
    opacity: 0.2,
  },
  
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 96,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#db322f',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
});
