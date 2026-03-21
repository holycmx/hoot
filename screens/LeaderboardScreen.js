import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Animated, Modal, ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { colors } from '../constants/colors';

// Dummy data — swap with fetchLeaderboard() once auth is wired up
const DUMMY_USERS = [
  { id: '1',  name: 'Jiwoo',    xp: 890, streak: 12, level: 'intermediate', words: 47, badges: ['✅','🔥','⭐'] },
  { id: '2',  name: 'Minho',    xp: 820, streak: 8,  level: 'intermediate', words: 41, badges: ['✅','🔥'] },
  { id: '3',  name: 'Soyeon',   xp: 780, streak: 15, level: 'elementary',   words: 38, badges: ['✅','⭐'] },
  { id: '4',  name: 'Taehyun',  xp: 640, streak: 5,  level: 'elementary',   words: 30, badges: ['✅'] },
  { id: '5',  name: 'Yuna',     xp: 590, streak: 7,  level: 'elementary',   words: 28, badges: ['✅','🔥'] },
  { id: '6',  name: 'Junho',    xp: 540, streak: 3,  level: 'beginner',     words: 22, badges: ['✅'] },
  { id: '7',  name: 'Chaeyeon', xp: 480, streak: 6,  level: 'beginner',     words: 19, badges: ['✅'] },
  { id: '8',  name: 'Seojun',   xp: 420, streak: 2,  level: 'beginner',     words: 15, badges: ['✅'] },
  { id: '9',  name: 'Nayeon',   xp: 380, streak: 4,  level: 'beginner',     words: 13, badges: ['✅'] },
  { id: '10', name: 'Hyunwoo',  xp: 310, streak: 1,  level: 'beginner',     words: 10, badges: ['✅'] },
  { id: '11', name: 'Jisoo',    xp: 280, streak: 3,  level: 'beginner',     words: 9,  badges: ['✅'] },
  { id: '12', name: 'You',      xp: 240, streak: 2,  level: 'beginner',     words: 8,  badges: ['✅'], isMe: true },
  { id: '13', name: 'Minji',    xp: 190, streak: 1,  level: 'beginner',     words: 6,  badges: ['✅'] },
];

const GEO_TABS = ['🏘️ Gimpo', '🗺️ Gyeonggi', '🇰🇷 Korea', '🌏 Global'];
const TIME_TABS = ['🔥 This Week', '⭐ All Time'];
const AGE_TABS  = ['All Ages', '5–8', '9–13', '14–18'];

const LEVEL_NAMES = { beginner: 'Cub', elementary: 'Explorer', intermediate: 'Adventurer' };
const PODIUM_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const PODIUM_HEIGHTS = [120, 90, 70];

export default function LeaderboardScreen({ onNavigate, userName }) {
  const [geoTab, setGeoTab]   = useState(0);
  const [timeTab, setTimeTab] = useState(0);
  const [ageTab, setAgeTab]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  // Podium bounce animations
  const bounce1 = useRef(new Animated.Value(0)).current;
  const bounce2 = useRef(new Animated.Value(0)).current;
  const bounce3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    function bounceLoop(anim, delay) {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.spring(anim, { toValue: -12, useNativeDriver: true, tension: 80, friction: 4 }),
          Animated.spring(anim, { toValue: 0,   useNativeDriver: true, tension: 80, friction: 4 }),
          Animated.delay(2000),
        ])
      ).start();
    }
    bounceLoop(bounce1, 0);
    bounceLoop(bounce2, 400);
    bounceLoop(bounce3, 800);
  }, []);

  const top3 = DUMMY_USERS.slice(0, 3);
  const rest = DUMMY_USERS.slice(3);
  const myEntry = DUMMY_USERS.find(u => u.isMe);
  const myRank = DUMMY_USERS.findIndex(u => u.isMe) + 1;
  const bounces = [bounce1, bounce2, bounce3];
  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd visual order
  const podiumBounces = [bounce2, bounce1, bounce3];
  const podiumPositions = [1, 0, 2]; // maps visual position to rank index

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard 🏆</Text>
        <Text style={styles.headerSub}>See how you rank across Korea</Text>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {GEO_TABS.map((t, i) => (
            <TouchableOpacity key={i} style={[styles.chip, geoTab === i && styles.chipActive]} onPress={() => setGeoTab(i)}>
              <Text style={[styles.chipTxt, geoTab === i && styles.chipTxtActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {TIME_TABS.map((t, i) => (
            <TouchableOpacity key={i} style={[styles.chip, timeTab === i && styles.chipActive]} onPress={() => setTimeTab(i)}>
              <Text style={[styles.chipTxt, timeTab === i && styles.chipTxtActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
          {AGE_TABS.map((t, i) => (
            <TouchableOpacity key={i} style={[styles.chip, ageTab === i && styles.chipActive]} onPress={() => setAgeTab(i)}>
              <Text style={[styles.chipTxt, ageTab === i && styles.chipTxtActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* Podium */}
        <View style={styles.podiumWrap}>
          {podiumOrder.map((user, vi) => {
            const rank = podiumPositions[vi];
            const height = PODIUM_HEIGHTS[rank];
            const color = PODIUM_COLORS[rank];
            const medals = ['🥇','🥈','🥉'];
            return (
              <TouchableOpacity key={user.id} style={styles.podiumSlot} onPress={() => setSelected(user)}>
                <Animated.Text style={[styles.podiumFox, { transform: [{ translateY: podiumBounces[vi] }] }]}>
                  🦊
                  {/* TODO: replace 🦊 with user.avatar when custom avatars are ready */}
                </Animated.Text>
                <Text style={styles.podiumMedal}>{medals[rank]}</Text>
                <Text style={styles.podiumName} numberOfLines={1}>{user.name}</Text>
                <Text style={styles.podiumXp}>{user.xp} XP</Text>
                <View style={[styles.podiumBase, { height, backgroundColor: color }]}>
                  <Text style={styles.podiumRank}>#{rank + 1}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Your rank card */}
        {myEntry && (
          <View style={styles.myCard}>
            <Text style={styles.myCardIco}>🦊</Text>
            <View style={styles.myCardInfo}>
              <Text style={styles.myCardName}>You · {myEntry.xp} XP</Text>
              <Text style={styles.myCardSub}>#{myRank} in {GEO_TABS[geoTab]} · {TIME_TABS[timeTab]}</Text>
            </View>
            <View style={styles.myCardRank}>
              <Text style={styles.myCardRankTxt}>#{myRank}</Text>
            </View>
          </View>
        )}

        {/* List */}
        <View style={styles.list}>
          {rest.map((user, i) => {
            const rank = i + 4;
            const isMe = user.isMe;
            return (
              <TouchableOpacity
                key={user.id}
                style={[styles.row, isMe && styles.rowMe]}
                onPress={() => setSelected(user)}
              >
                <Text style={[styles.rowRank, isMe && styles.rowRankMe]}>#{rank}</Text>
                <Text style={styles.rowFox}>🦊</Text>
                <View style={styles.rowInfo}>
                  <Text style={[styles.rowName, isMe && styles.rowNameMe]}>
                    {isMe ? `${userName || 'You'} (You)` : user.name}
                  </Text>
                  <Text style={styles.rowSub}>{LEVEL_NAMES[user.level]} · {user.words} words</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={[styles.rowXp, isMe && styles.rowXpMe]}>{user.xp} XP</Text>
                  <Text style={styles.rowStreak}>🔥 {user.streak}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Student profile modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelected(null)}>
          <TouchableOpacity style={styles.modalCard} activeOpacity={1}>
            {selected && (
              <>
                <View style={styles.modalHandle} />
                <Text style={styles.modalFox}>🦊</Text>
                <Text style={styles.modalName}>{selected.isMe ? (userName || 'You') : selected.name}</Text>
                <View style={styles.modalLevelBadge}>
                  <Text style={styles.modalLevelTxt}>⚡ {LEVEL_NAMES[selected.level]}</Text>
                </View>
                <View style={styles.modalStats}>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatVal}>{selected.xp}</Text>
                    <Text style={styles.modalStatLbl}>XP</Text>
                  </View>
                  <View style={styles.modalStatDiv} />
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatVal}>{selected.streak}</Text>
                    <Text style={styles.modalStatLbl}>Streak 🔥</Text>
                  </View>
                  <View style={styles.modalStatDiv} />
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatVal}>{selected.words}</Text>
                    <Text style={styles.modalStatLbl}>Words</Text>
                  </View>
                </View>
                <Text style={styles.modalBadgesTitle}>Badges</Text>
                <View style={styles.modalBadges}>
                  {selected.badges.map((b, i) => (
                    <View key={i} style={styles.modalBadge}>
                      <Text style={styles.modalBadgeIco}>{b}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.modalFunStat}>
                  🌟 {selected.isMe ? (userName || 'You') : selected.name} has learned {selected.words} English words!
                </Text>
                <TouchableOpacity style={styles.modalClose} onPress={() => setSelected(null)}>
                  <Text style={styles.modalCloseTxt}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Nav bar */}
      <View style={styles.navbar}>
        {[
          { ico: '🏠', label: 'Home',    screen: 'home' },
          { ico: '📚', label: 'Lessons', screen: 'tracks' },
          { ico: '🧩', label: 'Quiz',    screen: 'quiz' },
          { ico: '🦊', label: 'Hoot',    screen: 'ai' },
          { ico: '👤', label: 'Profile', screen: 'profile' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.navItem}
            onPress={() => onNavigate && onNavigate(item.screen)}
          >
            <Text style={styles.navIco}>{item.ico}</Text>
            <Text style={styles.navLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingTop: 56, paddingHorizontal: 22, paddingBottom: 12, backgroundColor: colors.bg },
  headerTitle: { fontSize: 27, fontWeight: '900', color: colors.ink, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, fontWeight: '500', color: colors.ink2, marginTop: 2 },
  filters: { paddingHorizontal: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  filterRow: { marginBottom: 6 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.border, marginRight: 8 },
  chipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  chipTxt: { fontSize: 12, fontWeight: '700', color: colors.ink2 },
  chipTxtActive: { color: colors.primary },
  body: { flex: 1 },
  podiumWrap: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8, gap: 8 },
  podiumSlot: { flex: 1, alignItems: 'center' },
  podiumFox: { fontSize: 36, marginBottom: 4 },
  podiumMedal: { fontSize: 20, marginBottom: 2 },
  podiumName: { fontSize: 11, fontWeight: '800', color: colors.ink, marginBottom: 2, textAlign: 'center' },
  podiumXp: { fontSize: 10, fontWeight: '600', color: colors.ink2, marginBottom: 4 },
  podiumBase: { width: '100%', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(0,0,0,0.08)' },
  podiumRank: { fontSize: 18, fontWeight: '900', color: '#fff', textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  myCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: colors.primarySoft, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: colors.primary },
  myCardIco: { fontSize: 28 },
  myCardInfo: { flex: 1 },
  myCardName: { fontSize: 15, fontWeight: '800', color: colors.primary },
  myCardSub: { fontSize: 11, fontWeight: '500', color: colors.ink2, marginTop: 2 },
  myCardRank: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  myCardRankTxt: { fontSize: 14, fontWeight: '900', color: '#fff' },
  list: { paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 16, marginBottom: 6, backgroundColor: colors.bg, borderWidth: 1.5, borderColor: colors.border },
  rowMe: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  rowRank: { fontSize: 12, fontWeight: '900', color: colors.ink3, width: 30, textAlign: 'center' },
  rowRankMe: { color: colors.primary },
  rowFox: { fontSize: 22 },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 13, fontWeight: '800', color: colors.ink },
  rowNameMe: { color: colors.primary },
  rowSub: { fontSize: 10, fontWeight: '500', color: colors.ink3, marginTop: 1 },
  rowRight: { alignItems: 'flex-end', gap: 2 },
  rowXp: { fontSize: 13, fontWeight: '900', color: colors.ink },
  rowXpMe: { color: colors.primary },
  rowStreak: { fontSize: 11, fontWeight: '600', color: colors.ink3 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, alignItems: 'center' },
  modalHandle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, marginBottom: 20 },
  modalFox: { fontSize: 72, marginBottom: 12 },
  modalName: { fontSize: 24, fontWeight: '900', color: colors.ink, letterSpacing: -0.4, marginBottom: 8 },
  modalLevelBadge: { backgroundColor: colors.primarySoft, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(124,77,255,0.15)' },
  modalLevelTxt: { fontSize: 13, fontWeight: '800', color: colors.primary },
  modalStats: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: colors.bg2, borderRadius: 18, padding: 16, width: '100%', justifyContent: 'space-around' },
  modalStat: { alignItems: 'center' },
  modalStatVal: { fontSize: 22, fontWeight: '900', color: colors.ink },
  modalStatLbl: { fontSize: 11, fontWeight: '500', color: colors.ink2, marginTop: 2 },
  modalStatDiv: { width: 1, height: 30, backgroundColor: colors.border },
  modalBadgesTitle: { fontSize: 13, fontWeight: '800', color: colors.ink2, marginBottom: 10, alignSelf: 'flex-start' },
  modalBadges: { flexDirection: 'row', gap: 10, marginBottom: 16, alignSelf: 'flex-start' },
  modalBadge: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  modalBadgeIco: { fontSize: 22 },
  modalFunStat: { fontSize: 13, fontWeight: '600', color: colors.ink2, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  modalClose: { width: '100%', backgroundColor: colors.bg2, borderRadius: 16, padding: 15, alignItems: 'center', borderWidth: 1.5, borderColor: colors.border },
  modalCloseTxt: { fontSize: 15, fontWeight: '700', color: colors.ink2 },
  navbar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: 20, paddingTop: 8 },
  navItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6, borderRadius: 14 },
  navIco: { fontSize: 22 },
  navLabel: { fontSize: 10, fontWeight: '700', color: colors.ink3 },
});