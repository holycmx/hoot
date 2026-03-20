import { CONTENT } from '../constants/content';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

export default function LessonScreen({ track = 'vocab', onBack }) {
  const data = CONTENT.units[0].tracks[track] || CONTENT.units[0].tracks.vocab;
  const totalSteps = data.words.length + data.exercises.length;
  const [step, setStep] = useState(0);
  const [xp, setXp] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [complete, setComplete] = useState(false);

  const isWordStep = step < data.words.length;
  const exIndex = step - data.words.length;
  const progress = step / totalSteps;

  function handleAnswer(i) {
    if (answered) return;
    setChosen(i);
    setAnswered(true);
    if (i === data.exercises[exIndex].answer) {
      setXp(x => x + 10);
    }
  }

  function handleNext() {
    if (step + 1 >= totalSteps) {
      setComplete(true);
    } else {
      setStep(s => s + 1);
      setAnswered(false);
      setChosen(null);
    }
  }

  if (complete) {
    return (
      <View style={styles.completeScreen}>
        <Text style={styles.completeFox}>🦊</Text>
        <Text style={styles.completeTitle}>Lesson Complete!</Text>
        <Text style={styles.completeSub}>You earned {xp} XP! Great work 🎉</Text>
        <TouchableOpacity style={styles.completeBtn} onPress={onBack}>
          <Text style={styles.completeBtnTxt}>Back to Tracks →</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          <Text style={styles.xpTxt}>{xp} XP</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progBg}>
        <View style={[styles.progFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {isWordStep ? (
          // Word card
          <View>
            <Text style={styles.stepLbl}>📖 Word {step + 1} of {data.words.length}</Text>
            <View style={styles.wordCard}>
              <Text style={styles.wordText}>{data.words[step].word}</Text>
              <Text style={styles.wordPhonetic}>{data.words[step].phonetic}</Text>
              <Text style={styles.wordKorean}>{data.words[step].korean}</Text>
              <Text style={styles.wordExample}>{data.words[step].example}</Text>
            </View>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnTxt}>Next →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Exercise
          <View>
            <Text style={styles.stepLbl}>🧩 Exercise {exIndex + 1} of {data.exercises.length}</Text>
            <Text style={styles.exPrompt}>{data.exercises[exIndex].prompt}</Text>
            <View style={styles.exOpts}>
              {data.exercises[exIndex].options.map((opt, i) => {
                const isCorrect = i === data.exercises[exIndex].answer;
                const isChosen = i === chosen;
                let optStyle = styles.exOpt;
                if (answered && isCorrect) optStyle = styles.exOptCorrect;
                else if (answered && isChosen) optStyle = styles.exOptWrong;
                return (
                  <TouchableOpacity key={i} style={optStyle} onPress={() => handleAnswer(i)}>
                    <View style={[styles.exOptLetter, answered && isCorrect && styles.exOptLetterCorrect, answered && isChosen && !isCorrect && styles.exOptLetterWrong]}>
                      <Text style={styles.exOptLetterTxt}>{'ABCD'[i]}</Text>
                    </View>
                    <Text style={styles.exOptTxt}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {answered && (
              <View style={chosen === data.exercises[exIndex].answer ? styles.fbOk : styles.fbBad}>
                <Text style={styles.fbTxt}>
                  {chosen === data.exercises[exIndex].answer ? '✓ ' : '✗ '}
                  {data.exercises[exIndex].tip}
                </Text>
              </View>
            )}

            {answered && (
              <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                <Text style={styles.nextBtnTxt}>
                  {exIndex + 1 >= data.exercises.length ? 'Finish! 🎉' : 'Next →'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  progFill: { height: 6, backgroundColor: colors.vocab, borderRadius: 3 },
  body: { flex: 1, padding: 20 },
  stepLbl: { fontSize: 11, fontWeight: '800', color: colors.ink3, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 12 },
  wordCard: { backgroundColor: colors.vocabSoft, borderRadius: 22, padding: 28, marginBottom: 20, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(124,77,255,0.14)' },
  wordText: { fontSize: 44, fontWeight: '900', color: colors.vocab, letterSpacing: -0.5, marginBottom: 4 },
  wordPhonetic: { fontSize: 14, fontWeight: '500', color: colors.ink3, marginBottom: 10 },
  wordKorean: { fontSize: 22, fontWeight: '800', color: colors.ink, marginBottom: 6 },
  wordExample: { fontSize: 13, fontWeight: '500', color: colors.ink2, fontStyle: 'italic' },
  exPrompt: { fontSize: 20, fontWeight: '800', color: colors.ink, marginBottom: 20, letterSpacing: -0.3, lineHeight: 28 },
  exOpts: { gap: 10, marginBottom: 14 },
  exOpt: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.bg, borderRadius: 16, padding: 14, borderWidth: 2, borderColor: colors.border },
  exOptCorrect: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.mintSoft, borderRadius: 16, padding: 14, borderWidth: 2, borderColor: colors.mint },
  exOptWrong: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.coralSoft, borderRadius: 16, padding: 14, borderWidth: 2, borderColor: colors.coral },
  exOptLetter: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  exOptLetterCorrect: { backgroundColor: colors.mint },
  exOptLetterWrong: { backgroundColor: colors.coral },
  exOptLetterTxt: { fontSize: 11, fontWeight: '800', color: colors.ink2 },
  exOptTxt: { fontSize: 14, fontWeight: '700', color: colors.ink },
  fbOk: { backgroundColor: colors.mintSoft, borderRadius: 14, padding: 14, marginBottom: 14 },
  fbBad: { backgroundColor: colors.coralSoft, borderRadius: 14, padding: 14, marginBottom: 14 },
  fbTxt: { fontSize: 13, fontWeight: '700', color: colors.ink },
  nextBtn: { backgroundColor: colors.vocab, borderRadius: 16, padding: 16, alignItems: 'center' },
  nextBtnTxt: { fontSize: 15, fontWeight: '800', color: '#fff' },
  completeScreen: { flex: 1, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center', padding: 32 },
  completeFox: { fontSize: 80, marginBottom: 20 },
  completeTitle: { fontSize: 28, fontWeight: '900', color: colors.ink, letterSpacing: -0.5, marginBottom: 8 },
  completeSub: { fontSize: 16, fontWeight: '500', color: colors.ink2, marginBottom: 32, textAlign: 'center' },
  completeBtn: { backgroundColor: colors.primary, borderRadius: 16, padding: 16, paddingHorizontal: 32 },
  completeBtnTxt: { fontSize: 16, fontWeight: '800', color: '#fff' },
});