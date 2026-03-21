import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';

const TRACKS = [
  {
    id: 'vocab',
    ico: '📖',
    name: 'Vocabulary',
    desc: 'Words, meanings & usage',
    color: colors.vocabSoft,
    accent: colors.vocab,
    progress: 0.1,
    lessons: [
      { id: 'v1', title: 'Lesson 1: People, Places & Things', sub: '10 words · 4 exercises', done: false },
      { id: 'v2', title: 'Unit 2: Colours & Adjectives', sub: 'Coming soon', locked: true },
    ],
  },
  {
    id: 'phonics',
    ico: '🔤',
    name: 'Phonics',
    desc: 'Sounds, letters & patterns',
    color: colors.phonicsSoft,
    accent: colors.phonics,
    progress: 0.1,
    lessons: [
      { id: 'p1', title: 'Lesson 1: Vowel Sounds', sub: 'a vs an rule · sort & identify', done: false },
      { id: 'p2', title: 'Unit 2: Short Vowels', sub: 'Coming soon', locked: true },
    ],
  },
  {
    id: 'grammar',
    ico: '📝',
    name: 'Grammar',
    desc: 'Rules, structures & patterns',
    color: colors.grammarSoft,
    accent: colors.grammar,
    progress: 0.1,
    lessons: [
      { id: 'g1', title: 'Lesson 1: Using a and an', sub: 'Hoot Grammar · Lesson 1', done: false },
      { id: 'g2', title: 'Unit 2: Can / Can\'t', sub: 'Coming soon', locked: true },
    ],
  },
  {
    id: 'listen',
    ico: '🎧',
    name: 'Listening',
    desc: 'Hear it, understand it',
    color: colors.listeningSoft,
    accent: colors.listening,
    progress: 0.1,
    lessons: [
      { id: 'l1', title: 'Lesson 1: Nouns in Sentences', sub: 'Listen & answer · true/false', done: false },
      { id: 'l2', title: 'Unit 2: Simple Descriptions', sub: 'Coming soon', locked: true },
    ],
  },
];

export default function TracksScreen({ onSelectLesson, onNavigate }) {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Hoot 🦊</Text>
            <Text style={styles.headerSub}>Choose a track to practise</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>🐾 Level 1 — Cub</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {TRACKS.map(track => (
          <TrackCard key={track.id} track={track} onSelectLesson={onSelectLesson} />
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Nav bar — OUTSIDE ScrollView, INSIDE container */}
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
            style={[styles.navItem, item.screen === 'tracks' && styles.navItemActive]}
            onPress={() => onNavigate && onNavigate(item.screen)}
          >
            <Text style={styles.navIco}>{item.ico}</Text>
            <Text style={[styles.navLabel, item.screen === 'tracks' && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

function TrackCard({ track, onSelectLesson }) {
  return (
    <View style={styles.trackCard}>
      <View style={styles.trackHeader}>
        <View style={[styles.trackIco, { backgroundColor: track.color }]}>
          <Text style={styles.trackIcoText}>{track.ico}</Text>
        </View>
        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{track.name}</Text>
          <Text style={styles.trackDesc}>{track.desc}</Text>
        </View>
        <Text style={[styles.trackProgress, { color: track.accent }]}>1/10</Text>
      </View>

      <View style={styles.trackProgBg}>
        <View style={[styles.trackProgFill, { width: `${track.progress * 100}%`, backgroundColor: track.accent }]} />
      </View>

      <View style={styles.lessonList}>
        {track.lessons.map(lesson => (
          <TouchableOpacity
            key={lesson.id}
            style={[styles.lessonRow, lesson.locked && styles.lessonLocked]}
            onPress={() => !lesson.locked && onSelectLesson && onSelectLesson(track.id, lesson.id)}
            disabled={lesson.locked}
          >
            <View style={[styles.lessonNum, lesson.done ? styles.lessonDone : { backgroundColor: track.color }]}>
              <Text style={[styles.lessonNumText, { color: lesson.done ? colors.mint : track.accent }]}>
                {lesson.done ? '✓' : '1'}
              </Text>
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonSub}>{lesson.sub}</Text>
            </View>
            <Text style={styles.lessonStatus}>{lesson.locked ? '🔒' : '▶'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.bg },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 27, fontWeight: '900', color: colors.ink, letterSpacing: -0.4 },
  headerSub: { fontSize: 14, fontWeight: '500', color: colors.ink2, marginTop: 2 },
  levelBadge: { backgroundColor: colors.primarySoft, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: 'rgba(124,77,255,0.15)' },
  levelText: { fontSize: 12, fontWeight: '800', color: colors.primary },
  body: { flex: 1, paddingHorizontal: 20 },
  trackCard: { backgroundColor: colors.bg, borderRadius: 24, marginBottom: 14, borderWidth: 1.5, borderColor: colors.border, overflow: 'hidden', shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  trackHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  trackIco: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  trackIcoText: { fontSize: 26 },
  trackInfo: { flex: 1 },
  trackName: { fontSize: 16, fontWeight: '900', color: colors.ink },
  trackDesc: { fontSize: 12, fontWeight: '500', color: colors.ink2, marginTop: 2 },
  trackProgress: { fontSize: 12, fontWeight: '800' },
  trackProgBg: { height: 4, backgroundColor: colors.border },
  trackProgFill: { height: 4 },
  lessonList: { borderTopWidth: 1, borderTopColor: colors.border },
  lessonRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  lessonLocked: { opacity: 0.45 },
  lessonNum: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  lessonDone: { backgroundColor: colors.mintSoft },
  lessonNumText: { fontSize: 11, fontWeight: '900' },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 13, fontWeight: '700', color: colors.ink },
  lessonSub: { fontSize: 11, fontWeight: '500', color: colors.ink3, marginTop: 1 },
  lessonStatus: { fontSize: 12 },
  navbar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: 20, paddingTop: 8 },
  navItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6, borderRadius: 14 },
  navItemActive: { backgroundColor: colors.primarySoft },
  navIco: { fontSize: 22 },
  navLabel: { fontSize: 10, fontWeight: '700', color: colors.ink3 },
  navLabelActive: { color: colors.primary },
});