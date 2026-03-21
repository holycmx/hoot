import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

export default function HomeScreen({ onNavigate, userName }) {
return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🦊</Text>
            </View>
            <View>
              <Text style={styles.greeting}>{new Date().getHours() < 12 ? 'GOOD MORNING' : new Date().getHours() < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING'}</Text>
              <Text style={styles.name}>{userName || 'Learner'}</Text>
            </View>
          </View>
          <View style={styles.bell}>
            <Text>🔔</Text>
          </View>
        </View>
        <Text style={styles.headline}>Ready to learn{'\n'}English today?</Text>
        <Text style={styles.subline}>Keep your streak going! 🔥</Text>

        {/* Streak tracker */}
        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>🔥 Daily Streak</Text>
          <View style={styles.streakDays}>
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <View key={i} style={styles.dayWrap}>
                <Text style={styles.dayLbl}>{d}</Text>
                <View style={[styles.dayCircle, i === 4 && styles.dayToday]}>
                  <Text style={styles.dayText}>{i < 4 ? '🔥' : d}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* Continue */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
        </View>
        <TouchableOpacity style={styles.continueCard}>
          <View style={styles.continueIco}>
            <Text style={styles.continueIcoText}>📖</Text>
          </View>
          <View style={styles.continueInfo}>
            <Text style={styles.continueTag}>VOCABULARY · LEVEL 1</Text>
            <Text style={styles.continueTitle}>Nouns — People & Things</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '30%' }]} />
            </View>
          </View>
          <Text style={styles.continueArr}>›</Text>
        </TouchableOpacity>

        {/* Practice grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Practice</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>
        <View style={styles.grid}>
          {[
            { ico: '📖', label: 'Vocabulary', sub: '10 words', color: colors.vocabSoft, accent: colors.vocab },
            { ico: '🔤', label: 'Phonics', sub: 'a vs an', color: colors.phonicsSoft, accent: colors.phonics },
            { ico: '📝', label: 'Grammar', sub: 'a and an', color: colors.grammarSoft, accent: colors.grammar },
            { ico: '🎧', label: 'Listening', sub: '4 exercises', color: colors.listeningSoft, accent: colors.listening },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={[styles.card, { backgroundColor: item.color }]}>
              <Text style={styles.cardIco}>{item.ico}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardSub}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Nav bar */}
      <View style={styles.navbar}>
   {[
  { ico: '🏠', label: 'Home', screen: 'home' },
  { ico: '📚', label: 'Lessons', screen: 'tracks' },
  { ico: '🧩', label: 'Quiz', screen: 'quiz' },
  { ico: '🏆', label: 'Ranks', screen: 'leaderboard' },
  { ico: '👤', label: 'Profile', screen: 'profile' },
].map((item, i) => (
  <TouchableOpacity
    key={i}
    style={[styles.navItem, item.screen === 'home' && styles.navItemActive]}
    onPress={() => onNavigate && onNavigate(item.screen)}
  >
    <Text style={styles.navIco}>{item.ico}</Text>
    <Text style={[styles.navLabel, item.screen === 'home' && styles.navLabelActive]}>
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
  header: { paddingTop: 56, paddingHorizontal: 22, paddingBottom: 16, backgroundColor: colors.bg },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20 },
  greeting: { fontSize: typography.xs, fontWeight: typography.bold, color: colors.ink3, letterSpacing: 1 },
  name: { fontSize: typography.lg, fontWeight: typography.extrabold, color: colors.ink },
  bell: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.border },
  headline: { fontSize: 27, fontWeight: '900', color: colors.ink, letterSpacing: -0.6, lineHeight: 34, marginBottom: 4 },
  subline: { fontSize: typography.md, color: colors.ink2, marginBottom: 16 },
  streakCard: { backgroundColor: colors.primarySoft, borderRadius: 22, padding: 16 },
  streakTitle: { fontSize: typography.sm, fontWeight: typography.extrabold, color: colors.primaryDark, marginBottom: 12 },
  streakDays: { flexDirection: 'row', justifyContent: 'space-between' },
  dayWrap: { alignItems: 'center', gap: 5 },
  dayLbl: { fontSize: 9, fontWeight: '800', color: colors.primaryDark, opacity: 0.6 },
  dayCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.45)', alignItems: 'center', justifyContent: 'center' },
  dayToday: { backgroundColor: '#fff', borderWidth: 2, borderColor: colors.primary },
  dayText: { fontSize: 11, fontWeight: '800', color: colors.primary },
  body: { flex: 1, paddingHorizontal: 22 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.ink },
  sectionLink: { fontSize: 13, fontWeight: '700', color: colors.primary },
  continueCard: { backgroundColor: '#EDE7FF', borderRadius: 22, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1.5, borderColor: 'rgba(124,77,255,0.14)' },
  continueIco: { width: 52, height: 52, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  continueIcoText: { fontSize: 27 },
  continueInfo: { flex: 1 },
  continueTag: { fontSize: 11, fontWeight: '700', color: colors.primary, marginBottom: 3, letterSpacing: 0.4 },
  continueTitle: { fontSize: 15, fontWeight: '800', color: colors.ink, marginBottom: 10 },
  progressBar: { height: 5, backgroundColor: 'rgba(124,77,255,0.15)', borderRadius: 4 },
  progressFill: { height: 5, backgroundColor: colors.primary, borderRadius: 4 },
  continueArr: { fontSize: 24, color: colors.primaryMid },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '47.5%', borderRadius: 22, padding: 18 },
  cardIco: { fontSize: 36, marginBottom: 10 },
  cardLabel: { fontSize: 13, fontWeight: '800', color: colors.ink, marginBottom: 2 },
  cardSub: { fontSize: 11, fontWeight: '500', color: colors.ink2 },
  navbar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: 20, paddingTop: 8 },
  navItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6, borderRadius: 14 },
  navItemActive: { backgroundColor: colors.primarySoft },
  navIco: { fontSize: 22 },
  navLabel: { fontSize: 10, fontWeight: '700', color: colors.ink3 },
  navLabelActive: { color: colors.primary },
});