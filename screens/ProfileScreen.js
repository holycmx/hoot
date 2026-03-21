import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';

const BADGES = [
  { id: 'b1', ico: '🔥', label: '3 Day Streak',   unlocked: false },
  { id: 'b2', ico: '⭐', label: '100 XP',          unlocked: false },
  { id: 'b3', ico: '📖', label: '10 Words',         unlocked: false },
  { id: 'b4', ico: '✅', label: 'First Lesson',     unlocked: true  },
  { id: 'b5', ico: '🔥', label: '7 Day Streak',    unlocked: false },
  { id: 'b6', ico: '🌟', label: '500 XP',           unlocked: false },
  { id: 'b7', ico: '📚', label: '50 Words',         unlocked: false },
  { id: 'b8', ico: '🦊', label: 'Hoot Master',     unlocked: false },
];

export default function ProfileScreen({ onNavigate, userName, userLevel, xp, streak, wordsLearned, lessonsCompleted }) {

  const levelNames = { beginner: 'Cub', elementary: 'Explorer', intermediate: 'Adventurer' };
  const levelName = levelNames[userLevel] || 'Cub';
  const levelNum = userLevel === 'intermediate' ? 3 : userLevel === 'elementary' ? 2 : 1;
  const xpThresholds = [0, 50, 150, 300, 500];
  const xpNext = xpThresholds[levelNum] || 500;
  const xpPct = Math.min(100, Math.round((xp / xpNext) * 100));

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>🦊</Text>
          </View>
          <View style={styles.names}>
            <Text style={styles.enName}>{userName || 'Learner'}</Text>
            <Text style={styles.joined}>Member since March 2026</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editTxt}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Level + XP */}
        <View style={styles.levelRow}>
          <View style={styles.levelChip}>
            <Text style={styles.levelIco}>⚡</Text>
            <View>
              <Text style={styles.levelNum}>Level {levelNum}</Text>
              <Text style={styles.levelLbl}>{levelName}</Text>
            </View>
          </View>
          <View style={styles.xpTrack}>
            <View style={styles.xpLblRow}>
              <Text style={styles.xpCurr}>{xp} XP</Text>
              <Text style={styles.xpNext}>{xpNext} XP</Text>
            </View>
            <View style={styles.xpBg}>
              <View style={[styles.xpFill, { width: `${xpPct}%` }]} />
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          {[
            { ico: '🔥', val: streak || 0,           lbl: 'Day streak' },
            { ico: '⭐', val: xp || 0,               lbl: 'Total XP' },
            { ico: '📖', val: wordsLearned || 0,      lbl: 'Words learned' },
            { ico: '✅', val: lessonsCompleted || 0,  lbl: 'Lessons done' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statIco}>{s.ico}</Text>
              <View>
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statLbl}>{s.lbl}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Badges */}
        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgesGrid}>
          {BADGES.map(b => (
            <View key={b.id} style={[styles.badge, !b.unlocked && styles.badgeLocked]}>
              <Text style={styles.badgeIco}>{b.ico}</Text>
              <Text style={styles.badgeLbl}>{b.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsList}>
          {[
            { ico: '👑', label: 'Upgrade to Premium', accent: true },
            { ico: '🔔', label: 'Notifications', val: 'On' },
            { ico: '🌏', label: 'Language', val: '한국어' },
            { ico: '🔄', label: 'Reset progress', danger: true },
          ].map((s, i) => (
            <TouchableOpacity key={i} style={[styles.settingRow, i === 0 && styles.upgradeRow]}>
              <Text style={styles.settingIco}>{s.ico}</Text>
              <Text style={[styles.settingLbl, s.accent && styles.settingAccent, s.danger && styles.settingDanger]}>
                {s.label}
              </Text>
              {s.val && <Text style={styles.settingVal}>{s.val}</Text>}
              <Text style={styles.settingArr}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Nav bar */}
      <View style={styles.navbar}>
        {[
          { ico: '🏠', label: 'Home',    screen: 'home' },
          { ico: '📚', label: 'Lessons', screen: 'tracks' },
          { ico: '🧩', label: 'Quiz',    screen: 'quiz' },
          { ico: '🏆', label: 'Ranks', screen: 'leaderboard' },
          { ico: '👤', label: 'Profile', screen: 'profile' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.navItem, item.screen === 'profile' && styles.navItemActive]}
            onPress={() => onNavigate && onNavigate(item.screen)}
          >
            <Text style={styles.navIco}>{item.ico}</Text>
            <Text style={[styles.navLabel, item.screen === 'profile' && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingTop: 56, paddingHorizontal: 22, paddingBottom: 20, backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border },
  profRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(124,77,255,0.2)' },
  avatarTxt: { fontSize: 30 },
  names: { flex: 1 },
  enName: { fontSize: 20, fontWeight: '900', color: colors.ink, letterSpacing: -0.3 },
  joined: { fontSize: 11, fontWeight: '500', color: colors.ink3, marginTop: 2 },
  editBtn: { backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  editTxt: { fontSize: 12, fontWeight: '700', color: colors.ink2 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  levelChip: { backgroundColor: colors.primarySoft, borderRadius: 14, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(124,77,255,0.12)' },
  levelIco: { fontSize: 18 },
  levelNum: { fontSize: 15, fontWeight: '900', color: colors.primary, lineHeight: 18 },
  levelLbl: { fontSize: 10, fontWeight: '600', color: colors.ink2 },
  xpTrack: { flex: 1 },
  xpLblRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  xpCurr: { fontSize: 11, fontWeight: '700', color: colors.ink3 },
  xpNext: { fontSize: 11, fontWeight: '700', color: colors.ink3 },
  xpBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  xpFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  body: { flex: 1, paddingHorizontal: 22 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: colors.ink, marginTop: 20, marginBottom: 10, letterSpacing: -0.3 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47.5%', backgroundColor: colors.bg, borderRadius: 18, padding: 15, borderWidth: 1.5, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 10 },
  statIco: { fontSize: 28 },
  statVal: { fontSize: 22, fontWeight: '900', color: colors.ink, letterSpacing: -0.4 },
  statLbl: { fontSize: 11, fontWeight: '500', color: colors.ink2, marginTop: 1 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { width: '22%', backgroundColor: colors.bg, borderRadius: 16, padding: 12, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', gap: 5 },
  badgeLocked: { opacity: 0.25 },
  badgeIco: { fontSize: 26 },
  badgeLbl: { fontSize: 9, fontWeight: '700', color: colors.ink2, textAlign: 'center', lineHeight: 13 },
  settingsList: { backgroundColor: colors.bg, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderBottomWidth: 1, borderBottomColor: colors.border },
  upgradeRow: { backgroundColor: colors.primarySoft },
  settingIco: { fontSize: 20, width: 30, textAlign: 'center' },
  settingLbl: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.ink },
  settingAccent: { color: colors.primary, fontWeight: '800' },
  settingDanger: { color: colors.coral },
  settingVal: { fontSize: 12, fontWeight: '600', color: colors.ink3, marginRight: 4 },
  settingArr: { fontSize: 18, color: colors.ink3 },
  navbar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: 20, paddingTop: 8 },
  navItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6, borderRadius: 14 },
  navItemActive: { backgroundColor: colors.primarySoft },
  navIco: { fontSize: 22 },
  navLabel: { fontSize: 10, fontWeight: '700', color: colors.ink3 },
  navLabelActive: { color: colors.primary },
});