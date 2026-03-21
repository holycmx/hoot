import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { getNextQuestion, calculateLevel } from '../constants/levelTest';
import { colors } from '../constants/colors';

const TOTAL_TEST_QUESTIONS = 6;

export default function OnboardingScreen({ onFinish }) {
  const [step, setStep] = useState(1); // 1=name, 2=age, 3=test, 4=goal
  const [enName, setEnName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [goal, setGoal] = useState('');

  // Level test state
  const [testHistory, setTestHistory] = useState([]);
  const [usedIds, setUsedIds] = useState([]);
  const [currentQ, setCurrentQ] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [testAnswered, setTestAnswered] = useState(false);

  function startTest() {
    const first = getNextQuestion([], []);
    setCurrentQ(first);
    setUsedIds([first.id]);
    setStep(3);
  }

  function handleTestAnswer(i) {
    if (testAnswered) return;
    setChosen(i);
    setTestAnswered(true);
  }

  function handleTestNext() {
    const correct = chosen === currentQ.a;
    const newHistory = [...testHistory, {
      id: currentQ.id,
      difficulty: currentQ.difficulty,
      correct,
    }];
    setTestHistory(newHistory);

    if (newHistory.length >= TOTAL_TEST_QUESTIONS) {
      setStep(4);
      return;
    }

    const next = getNextQuestion(newHistory, usedIds);
    if (!next) { setStep(4); return; }
    setCurrentQ(next);
    setUsedIds(ids => [...ids, next.id]);
    setChosen(null);
    setTestAnswered(false);
  }

  function handleFinish() {
    const level = calculateLevel(testHistory);
    onFinish({ enName, ageGroup, goal, level });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Progress dots */}
      <View style={styles.progress}>
        {[1,2,3,4].map(s => (
          <View key={s} style={[styles.dot, s === step && styles.dotActive, s < step && styles.dotDone]} />
        ))}
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* STEP 1 — Name */}
        {step === 1 && (
          <View style={styles.stepWrap}>
            <Text style={styles.fox}>🦊</Text>
            <Text style={styles.title}>Hi! I'm Hoot,{'\n'}your English fox!</Text>
            <Text style={styles.sub}>I'll help you learn English every day. Let's start by getting to know you!</Text>
            <Text style={styles.lbl}>YOUR ENGLISH NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Lily, Minho, Yuna…"
              placeholderTextColor={colors.ink3}
              value={enName}
              onChangeText={setEnName}
              maxLength={20}
            />
            <TouchableOpacity
              style={[styles.btn, !enName.trim() && styles.btnDisabled]}
              disabled={!enName.trim()}
              onPress={() => setStep(2)}
            >
              <Text style={styles.btnTxt}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2 — Age */}
        {step === 2 && (
          <View style={styles.stepWrap}>
            <Text style={styles.fox}>🎒</Text>
            <Text style={styles.title}>How old are you?</Text>
            <Text style={styles.sub}>I'll pick the right words and exercises for your age.</Text>
            {[
              { val: '5-8',   ico: '🌱', label: '5 – 8 years old',   desc: 'Young learner · simple words & pictures' },
              { val: '9-13',  ico: '📚', label: '9 – 13 years old',  desc: 'Elementary · sentences & grammar' },
              { val: '14-18', ico: '🎓', label: '14 – 18 years old', desc: 'Teen · advanced vocabulary & conversation' },
            ].map(opt => (
              <TouchableOpacity
                key={opt.val}
                style={[styles.optCard, ageGroup === opt.val && styles.optCardSelected]}
                onPress={() => setAgeGroup(opt.val)}
              >
                <Text style={styles.optIco}>{opt.ico}</Text>
                <View style={styles.optInfo}>
                  <Text style={[styles.optLabel, ageGroup === opt.val && styles.optLabelSelected]}>{opt.label}</Text>
                  <Text style={styles.optDesc}>{opt.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.btn, !ageGroup && styles.btnDisabled, { marginTop: 20 }]}
              disabled={!ageGroup}
              onPress={startTest}
            >
              <Text style={styles.btnTxt}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3 — Adaptive Level Test */}
        {step === 3 && currentQ && (
          <View style={styles.stepWrap}>
            <Text style={styles.testMeta}>
              Question {testHistory.length + 1} of {TOTAL_TEST_QUESTIONS}
            </Text>
            <View style={styles.testProgBg}>
              <View style={[styles.testProgFill, { width: `${(testHistory.length / TOTAL_TEST_QUESTIONS) * 100}%` }]} />
            </View>
            <Text style={styles.title}>{currentQ.q}</Text>
            <View style={styles.testOpts}>
              {currentQ.opts.map((opt, i) => {
                let optStyle = styles.testOpt;
                if (testAnswered && i === currentQ.a) optStyle = styles.testOptCorrect;
                else if (testAnswered && i === chosen) optStyle = styles.testOptWrong;
                return (
                  <TouchableOpacity key={i} style={optStyle} onPress={() => handleTestAnswer(i)}>
                    <View style={[
                      styles.testOptLetter,
                      testAnswered && i === currentQ.a && styles.testOptLetterCorrect,
                      testAnswered && i === chosen && i !== currentQ.a && styles.testOptLetterWrong,
                    ]}>
                      <Text style={styles.testOptLetterTxt}>{'ABCD'[i]}</Text>
                    </View>
                    <Text style={styles.testOptTxt}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {testAnswered && (
              <TouchableOpacity style={styles.btn} onPress={handleTestNext}>
                <Text style={styles.btnTxt}>
                  {testHistory.length + 1 >= TOTAL_TEST_QUESTIONS ? 'See my results →' : 'Next →'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* STEP 4 — Goal */}
        {step === 4 && (
          <View style={styles.stepWrap}>
            <Text style={styles.fox}>🎯</Text>
            <Text style={styles.title}>Why are you learning English?</Text>
            <Text style={styles.sub}>I'll focus your lessons on what matters most to you.</Text>
            {[
              { val: 'school',       ico: '🏫', label: 'Do better at school',      desc: 'Grades, tests & homework' },
              { val: 'conversation', ico: '💬', label: 'Talk to people',            desc: 'Friends, travel & conversation' },
              { val: 'fun',          ico: '🎮', label: 'Watch shows & play games',  desc: 'Entertainment & hobbies' },
              { val: 'exam',         ico: '📝', label: 'Pass an exam',              desc: 'TOEFL, IELTS, school tests' },
            ].map(opt => (
              <TouchableOpacity
                key={opt.val}
                style={[styles.optCard, goal === opt.val && styles.optCardSelected]}
                onPress={() => setGoal(opt.val)}
              >
                <Text style={styles.optIco}>{opt.ico}</Text>
                <View style={styles.optInfo}>
                  <Text style={[styles.optLabel, goal === opt.val && styles.optLabelSelected]}>{opt.label}</Text>
                  <Text style={styles.optDesc}>{opt.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.btn, !goal && styles.btnDisabled, { marginTop: 20 }]}
              disabled={!goal}
              onPress={handleFinish}
            >
              <Text style={styles.btnTxt}>Start learning! 🦊</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  progress: { paddingTop: 56, paddingHorizontal: 24, flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primaryMid },
  dotDone: { backgroundColor: colors.primary },
  body: { flex: 1 },
  stepWrap: { padding: 24, paddingTop: 28 },
  fox: { fontSize: 68, marginBottom: 16 },
  title: { fontSize: 27, fontWeight: '900', color: colors.ink, letterSpacing: -0.6, lineHeight: 34, marginBottom: 8 },
  sub: { fontSize: 15, fontWeight: '500', color: colors.ink2, marginBottom: 28, lineHeight: 22 },
  lbl: { fontSize: 11, fontWeight: '800', color: colors.ink3, letterSpacing: 0.8, marginBottom: 8 },
  input: { backgroundColor: colors.bg2, borderWidth: 2, borderColor: colors.border, borderRadius: 14, padding: 14, fontSize: 16, fontWeight: '600', color: colors.ink, marginBottom: 12 },
  btn: { backgroundColor: colors.primary, borderRadius: 16, padding: 17, alignItems: 'center', marginTop: 8, shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  btnDisabled: { opacity: 0.4, shadowOpacity: 0 },
  btnTxt: { fontSize: 16, fontWeight: '800', color: '#fff' },
  optCard: { backgroundColor: colors.bg2, borderWidth: 2, borderColor: colors.border, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  optCardSelected: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  optIco: { fontSize: 28, width: 44, height: 44, textAlign: 'center', lineHeight: 44 },
  optInfo: { flex: 1 },
  optLabel: { fontSize: 15, fontWeight: '800', color: colors.ink },
  optLabelSelected: { color: colors.primary },
  optDesc: { fontSize: 12, fontWeight: '500', color: colors.ink2, marginTop: 2 },
  testMeta: { fontSize: 11, fontWeight: '800', color: colors.ink3, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  testProgBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: 24, overflow: 'hidden' },
  testProgFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  testOpts: { gap: 10, marginBottom: 16 },
  testOpt: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.bg, borderRadius: 16, padding: 14, borderWidth: 2, borderColor: colors.border },
  testOptCorrect: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.mintSoft, borderRadius: 16, padding: 14, borderWidth: 2, borderColor: colors.mint },
  testOptWrong: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.coralSoft, borderRadius: 16, padding: 14, borderWidth: 2, borderColor: colors.coral },
  testOptLetter: { width: 30, height: 30, borderRadius: 9, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  testOptLetterCorrect: { backgroundColor: colors.mint },
  testOptLetterWrong: { backgroundColor: colors.coral },
  testOptLetterTxt: { fontSize: 12, fontWeight: '800', color: colors.ink2 },
  testOptTxt: { fontSize: 14, fontWeight: '700', color: colors.ink, flex: 1 },
});