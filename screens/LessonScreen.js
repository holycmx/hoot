import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

const UNIT1 = {
  vocab: {
    words: [
      { word: 'Girl', phonetic: '/ɡɜːrl/', korean: '여자아이', example: '"She is a girl."' },
      { word: 'Boy', phonetic: '/bɔɪ/', korean: '남자아이', example: '"He is a boy."' },
      { word: 'Teacher', phonetic: '/ˈtiːtʃər/', korean: '선생님', example: '"She is a teacher."' },
      { word: 'Apple', phonetic: '/ˈæpəl/', korean: '사과', example: '"I eat an apple."' },
      { word: 'Dog', phonetic: '/dɒɡ/', korean: '개', example: '"It is a dog."' },
    ],
    exercises: [
      { type: 'mc', prompt: 'Which word means 선생님?', options: ['Artist', 'Teacher', 'Student', 'Girl'], answer: 1, tip: 'Teacher = 선생님' },
      { type: 'mc', prompt: 'Which is correct?', options: ['a apple', 'an apple', 'a owl', 'an dog'], answer: 1, tip: 'Vowel sounds use "an"' },
    ],
  },
};

export default function LessonScreen({ track = 'vocab', onBack }) {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Lesson 1: Nouns</Text>
          <Text style={styles.headerSub}>Vocabulary · Level 1 — Cub</Text>
        </View>
        <View style={styles.xpTag}>
          <Text style={styles.xpTxt}>0 XP</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progBg}>
        <View style={[styles.progFill, { width: '20%', backgroundColor: colors.vocab }]} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* Vocab intro */}
        <View style={styles.introCard}>
          <Text style={styles.introLbl}>📖 Vocabulary</Text>
          <Text style={styles.introTitle}>Nouns — People, Places & Things</Text>
          <Text style={styles.introSub}>Learn 5 key words. Tap each card to study it.</Text>
        </View>

        {/* Word cards */}
        {UNIT1.vocab.words.map((w, i) => (
          <View key={i} style={styles.wordCard}>
            <Text style={styles.wordText}>{w.word}</Text>
            <Text style={styles.wordPhonetic}>{w.phonetic}</Text>
            <Text style={styles.wordKorean}>{w.korean}</Text>
            <Text style={styles.wordExample}>{w.example}</Text>
          </View>
        ))}

        {/* Exercises */}
        <Text style={styles.exTitle}>Exercises</Text>
        {UNIT1.vocab.exercises.map((ex, i) => (
          <ExerciseCard key={i} ex={ex} index={i} />
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function ExerciseCard({ ex, index }) {
  return (
    <View style={styles.exCard}>
      <Text style={styles.exNum}>Exercise {index + 1}</Text>
      <Text style={styles.exPrompt}>{ex.prompt}</Text>
      <View style={styles.exOpts}>
        {ex.options.map((opt, i) => (
          <TouchableOpacity key={i} style={styles.exOpt}>
            <View style={styles.exOptLetter}>
              <Text style={styles.exOptLetterTxt}>{'ABCD'[i]}</Text>
            </View>
            <Text style={styles.exOptTxt}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 18, color: colors.ink2 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.ink, letterSpacing: -0.3 },
  headerSub: { fontSize: 12, fontWeight: '500', color: colors.ink2, marginTop: 2 },
  xpTag: { backgroundColor: colors.goldSoft, borderRadius: 20, paddingHorizontal: 13, paddingVertical: 5 },
  xpTxt: { fontSize: 12, fontWeight: '800', color: colors.goldDark },
  progBg: { height: 6, backgroundColor: colors.border },
  progFill: { height: 6, borderRadius: 3 },
  body: { flex: 1, padding: 20 },
  introCard: { backgroundColor: colors.vocabSoft, borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(124,77,255,0.12)' },
  introLbl: { fontSize: 11, fontWeight: '800', color: colors.vocab, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 4 },
  introTitle: { fontSize: 17, fontWeight: '900', color: colors.ink, letterSpacing: -0.3 },
  introSub: { fontSize: 13, fontWeight: '500', color: colors.ink2, marginTop: 4 },
  wordCard: { backgroundColor: colors.bg, borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },
  wordText: { fontSize: 40, fontWeight: '900', color: colors.vocab, letterSpacing: -0.5, marginBottom: 4 },
  wordPhonetic: { fontSize: 14, fontWeight: '500', color: colors.ink3, marginBottom: 8 },
  wordKorean: { fontSize: 20, fontWeight: '800', color: colors.ink, marginBottom: 6 },
  wordExample: { fontSize: 13, fontWeight: '500', color: colors.ink2, fontStyle: 'italic' },
  exTitle: { fontSize: 17, fontWeight: '800', color: colors.ink, marginBottom: 12, marginTop: 8 },
  exCard: { backgroundColor: colors.bg, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: colors.border },
  exNum: { fontSize: 11, fontWeight: '800', color: colors.ink3, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 8 },
  exPrompt: { fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 16, letterSpacing: -0.3 },
  exOpts: { gap: 10 },
  exOpt: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.bg2, borderRadius: 14, padding: 14, borderWidth: 2, borderColor: colors.border },
  exOptLetter: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  exOptLetterTxt: { fontSize: 11, fontWeight: '800', color: colors.ink2 },
  exOptTxt: { fontSize: 14, fontWeight: '700', color: colors.ink },
});