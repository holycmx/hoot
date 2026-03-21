import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { CONTENT } from '../constants/content';

// General question pool
const GENERAL_POOL = [
  { q: 'What do you say when you meet someone?', opts: ['Goodbye', 'Hello', 'Good night', 'Sorry'], a: 1, tip: '"Hello" is how we greet people!' },
  { q: 'How do you say 감사합니다 in English?', opts: ['Sorry', 'Please', 'Thank you', 'Hello'], a: 2, tip: '"Thank you" = 감사합니다' },
  { q: 'Fill in: "I ___ a student."', opts: ['is', 'are', 'am', 'be'], a: 2, tip: 'I + am → "I am a student"' },
  { q: 'What colour is the sky?', opts: ['Red', 'Green', 'Yellow', 'Blue'], a: 3, tip: 'The sky is blue!' },
  { q: 'How do you say 어머니 in English?', opts: ['Sister', 'Father', 'Mother', 'Aunt'], a: 2, tip: '"Mother" = 어머니' },
  { q: 'Which number comes after seven?', opts: ['Six', 'Nine', 'Eight', 'Ten'], a: 2, tip: '7 → 8 → 9 → 10' },
  { q: 'How do you say 물 in English?', opts: ['Milk', 'Juice', 'Water', 'Rice'], a: 2, tip: '"Water" = 물' },
  { q: 'Which animal says "meow"?', opts: ['Dog', 'Bird', 'Cat', 'Fish'], a: 2, tip: 'Cats say "meow"!' },
  { q: 'What is the English word for 먹다?', opts: ['Sleep', 'Drink', 'Eat', 'Run'], a: 2, tip: '"Eat" = 먹다' },
  { q: 'How do you say 행복한 in English?', opts: ['Sad', 'Angry', 'Scared', 'Happy'], a: 3, tip: '"Happy" = 행복한' },
  { q: 'Choose the correct sentence:', opts: ['She go to school', 'She goes to school', 'She going to school', 'She goed to school'], a: 1, tip: '"She goes" — add -es for he/she/it' },
  { q: '"I ___ happy today!" Which word fits?', opts: ['is', 'are', 'am', 'be'], a: 2, tip: 'I + am → "I am happy"' },
  { q: 'Which is correct?', opts: ['a apple', 'an apple', 'a owl', 'an dog'], a: 1, tip: '"Apple" starts with a vowel → "an apple"' },
  { q: 'How do you say 봄 in English?', opts: ['Winter', 'Summer', 'Spring', 'Autumn'], a: 2, tip: '"Spring" = 봄' },
  { q: 'Which word means 선생님?', opts: ['Student', 'Teacher', 'Doctor', 'Friend'], a: 1, tip: '"Teacher" = 선생님' },
];

function buildQuizPool(lessonsCompleted) {
  const lessonQuestions = [];

  // Pull from completed lesson content
  CONTENT.units.forEach(unit => {
    Object.values(unit.tracks).forEach(track => {
      if (track.exercises) {
        track.exercises.forEach(ex => {
          lessonQuestions.push({
            q: ex.prompt,
            opts: ex.options,
            a: ex.answer,
            tip: ex.tip,
          });
        });
      }
    });
  });

  // Shuffle lesson questions
  const shuffledLesson = lessonQuestions.sort(() => Math.random() - 0.5);
  const shuffledGeneral = GENERAL_POOL.sort(() => Math.random() - 0.5);

  // Take up to 5 from lessons, fill rest from general
  const pool = [
    ...shuffledLesson.slice(0, 5),
    ...shuffledGeneral,
  ];

  // Deduplicate and take 10
  const seen = new Set();
  const final = [];
  for (const q of pool) {
    if (!seen.has(q.q) && final.length < 10) {
      seen.add(q.q);
      final.push(q);
    }
  }
  return final;
}

const TIMER_SECONDS = 15;
const SPEED_BONUS_THRESHOLD = 5;

export default function QuizScreen({ onNavigate, lessonsCompleted = [] }) {
  const [questions] = useState(() => buildQuizPool(lessonsCompleted));
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [xp, setXp] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [speedBonus, setSpeedBonus] = useState(false);
  const [showXpPop, setShowXpPop] = useState(null);
  const [complete, setComplete] = useState(false);
  const timerRef = useRef(null);
  const xpPopAnim = useRef(new Animated.Value(0)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;

  const q = questions[qIdx];

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [qIdx]);

  function startTimer() {
    setTimeLeft(TIMER_SECONDS);
    timerAnim.setValue(1);
    Animated.timing(timerAnim, {
      toValue: 0,
      duration: TIMER_SECONDS * 1000,
      useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function handleTimeout() {
    if (answered) return;
    setAnswered(true);
    setChosen(-1);
    popXp('⏱ Too slow!', false);
  }

  function handleAnswer(i) {
    if (answered) return;
    clearInterval(timerRef.current);
    timerAnim.stopAnimation();
    setChosen(i);
    setAnswered(true);

    const isCorrect = i === q.a;
    const isSpeed = timeLeft > (TIMER_SECONDS - SPEED_BONUS_THRESHOLD);

    if (isCorrect) {
      setCorrect(c => c + 1);
      const earned = 20 + (isSpeed ? 5 : 0);
      setXp(x => x + earned);
      setSpeedBonus(isSpeed);
      popXp(isSpeed ? '+25 XP ⚡ Speed bonus!' : '+20 XP', true);
    } else {
      popXp('Wrong! Keep going 💪', false);
    }
  }

  function popXp(msg, good) {
    setShowXpPop({ msg, good });
    xpPopAnim.setValue(0);
    Animated.spring(xpPopAnim, {
      toValue: 1,
      tension: 60,
      friction: 6,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => setShowXpPop(null), 1400);
    });
  }

  function handleNext() {
    if (qIdx + 1 >= questions.length) {
      setComplete(true);
    } else {
      setQIdx(i => i + 1);
      setChosen(null);
      setAnswered(false);
      setSpeedBonus(false);
    }
  }

  if (complete) {
    const pct = Math.round((correct / questions.length) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <View style={styles.container}>
        <View style={styles.resultScreen}>
          <Text style={styles.resultIco}>🧩</Text>
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <View style={styles.resultStars}>
            {[1,2,3].map(s => (
              <Text key={s} style={[styles.resultStar, s > stars && styles.resultStarOff]}>⭐</Text>
            ))}
          </View>
          <Text style={styles.resultScore}>{correct}/{questions.length}</Text>
          <Text style={styles.resultAccuracy}>{pct}% accuracy</Text>
          <View style={styles.resultXpBadge}>
            <Text style={styles.resultXpBadgeTxt}>🔥 Double XP Quiz — {xp} XP earned!</Text>
          </View>
          <TouchableOpacity style={styles.resultBtn} onPress={() => {
            setQIdx(0);
            setChosen(null);
            setAnswered(false);
            setXp(0);
            setCorrect(0);
            setComplete(false);
          }}>
            <Text style={styles.resultBtnTxt}>Play again 🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resultBtnSecondary} onPress={() => onNavigate('home')}>
            <Text style={styles.resultBtnSecondaryTxt}>Back to home 🏠</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const timerColor = timeLeft <= 5 ? colors.coral : colors.gold;

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('home')}>
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Quiz 🧩</Text>
        <View style={styles.xpTag}>
          <Text style={styles.xpTxt}>{xp} XP</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progBg}>
        <View style={[styles.progFill, { width: `${((qIdx) / questions.length) * 100}%` }]} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* Question number */}
        <Text style={styles.qNum}>Question {qIdx + 1} of {questions.length}</Text>

        {/* Timer */}
        <View style={styles.timerWrap}>
          <View style={styles.timerBarBg}>
            <Animated.View style={[styles.timerBarFill, {
              width: timerAnim.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] }),
              backgroundColor: timerColor,
            }]} />
          </View>
          <Text style={[styles.timerNum, { color: timerColor }]}>{timeLeft}s</Text>
        </View>

        {/* Speed bonus hint */}
        {!answered && timeLeft > SPEED_BONUS_THRESHOLD && (
          <Text style={styles.speedHint}>⚡ Answer in {timeLeft > TIMER_SECONDS - SPEED_BONUS_THRESHOLD ? `${SPEED_BONUS_THRESHOLD}s` : `${timeLeft}s`} for +5 bonus XP!</Text>
        )}
        {!answered && timeLeft <= SPEED_BONUS_THRESHOLD && timeLeft > 0 && (
          <Text style={[styles.speedHint, { color: colors.coral }]}>🔴 Hurry! {timeLeft} seconds left!</Text>
        )}

        {/* Question */}
        <Text style={styles.qText}>{q.q}</Text>

        {/* Options */}
        <View style={styles.opts}>
          {q.opts.map((opt, i) => {
            let style = styles.opt;
            let letterStyle = styles.optLetter;
            if (answered && i === q.a) { style = styles.optCorrect; letterStyle = styles.optLetterCorrect; }
            else if (answered && i === chosen) { style = styles.optWrong; letterStyle = styles.optLetterWrong; }
            return (
              <TouchableOpacity key={i} style={style} onPress={() => handleAnswer(i)} disabled={answered}>
                <View style={letterStyle}>
                  <Text style={styles.optLetterTxt}>{'ABCD'[i]}</Text>
                </View>
                <Text style={styles.optTxt}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback */}
        {answered && (
          <View style={chosen === q.a ? styles.fbOk : styles.fbBad}>
            <Text style={styles.fbTxt}>
              {chosen === q.a ? '✓ ' : chosen === -1 ? '⏱ Time\'s up! ' : '✗ '}
              {q.tip}
            </Text>
          </View>
        )}

        {/* XP pop */}
        {showXpPop && (
          <Animated.View style={[
            showXpPop.good ? styles.xpPop : styles.xpPopBad,
            { transform: [{ scale: xpPopAnim }] }
          ]}>
            <Text style={styles.xpPopTxt}>{showXpPop.msg}</Text>
          </Animated.View>
        )}

        {/* Next button */}
        {answered && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnTxt}>
              {qIdx + 1 >= questions.length ? 'See results 🎉' : 'Next →'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
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
            style={[styles.navItem, item.screen === 'quiz' && styles.navItemActive]}
            onPress={() => onNavigate && onNavigate(item.screen)}
          >
            <Text style={styles.navIco}>{item.ico}</Text>
            <Text style={[styles.navLabel, item.screen === 'quiz' && styles.navLabelActive]}>
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
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 18, color: colors.ink2 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '900', color: colors.ink, letterSpacing: -0.3 },
  xpTag: { backgroundColor: colors.goldSoft, borderRadius: 20, paddingHorizontal: 13, paddingVertical: 5, borderWidth: 1.5, borderColor: colors.gold },
  xpTxt: { fontSize: 12, fontWeight: '800', color: colors.goldDark },
  progBg: { height: 6, backgroundColor: colors.border },
  progFill: { height: 6, backgroundColor: colors.primary },
  body: { flex: 1, padding: 20 },
  qNum: { fontSize: 11, fontWeight: '800', color: colors.ink3, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 12 },
  timerWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  timerBarBg: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  timerBarFill: { height: 8, borderRadius: 4 },
  timerNum: { fontSize: 14, fontWeight: '900', width: 32, textAlign: 'right' },
  speedHint: { fontSize: 12, fontWeight: '700', color: colors.goldDark, marginBottom: 12 },
  qText: { fontSize: 22, fontWeight: '900', color: colors.ink, marginBottom: 24, letterSpacing: -0.4, lineHeight: 30 },
  opts: { gap: 10, marginBottom: 14 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.bg, borderRadius: 16, padding: 15, borderWidth: 2, borderColor: colors.border },
  optCorrect: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.mintSoft, borderRadius: 16, padding: 15, borderWidth: 2, borderColor: colors.mint },
  optWrong: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.coralSoft, borderRadius: 16, padding: 15, borderWidth: 2, borderColor: colors.coral },
  optLetter: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  optLetterCorrect: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  optLetterWrong: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  optLetterTxt: { fontSize: 12, fontWeight: '900', color: '#fff' },
  optTxt: { fontSize: 15, fontWeight: '700', color: colors.ink, flex: 1 },
  fbOk: { backgroundColor: colors.mintSoft, borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1.5, borderColor: colors.mint },
  fbBad: { backgroundColor: colors.coralSoft, borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1.5, borderColor: colors.coral },
  fbTxt: { fontSize: 13, fontWeight: '700', color: colors.ink },
  xpPop: { backgroundColor: colors.goldSoft, borderRadius: 16, padding: 14, alignItems: 'center', marginBottom: 14, borderWidth: 1.5, borderColor: colors.gold },
  xpPopBad: { backgroundColor: colors.coralSoft, borderRadius: 16, padding: 14, alignItems: 'center', marginBottom: 14, borderWidth: 1.5, borderColor: colors.coral },
  xpPopTxt: { fontSize: 15, fontWeight: '900', color: colors.goldDark },
  nextBtn: { backgroundColor: colors.primary, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 },
  nextBtnTxt: { fontSize: 16, fontWeight: '800', color: '#fff' },
  resultScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  resultIco: { fontSize: 72, marginBottom: 16 },
  resultTitle: { fontSize: 28, fontWeight: '900', color: colors.ink, letterSpacing: -0.5, marginBottom: 12 },
  resultStars: { flexDirection: 'row', gap: 4, marginBottom: 16 },
  resultStar: { fontSize: 36 },
  resultStarOff: { opacity: 0.2 },
  resultScore: { fontSize: 64, fontWeight: '900', color: colors.ink, letterSpacing: -2, lineHeight: 72 },
  resultAccuracy: { fontSize: 16, fontWeight: '600', color: colors.ink2, marginBottom: 20 },
  resultXpBadge: { backgroundColor: colors.goldSoft, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, marginBottom: 28, borderWidth: 1.5, borderColor: colors.gold },
  resultXpBadgeTxt: { fontSize: 15, fontWeight: '800', color: colors.goldDark },
  resultBtn: { width: '100%', backgroundColor: colors.primary, borderRadius: 16, padding: 17, alignItems: 'center', marginBottom: 10 },
  resultBtnTxt: { fontSize: 16, fontWeight: '800', color: '#fff' },
  resultBtnSecondary: { width: '100%', backgroundColor: colors.bg2, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: colors.border },
  resultBtnSecondaryTxt: { fontSize: 15, fontWeight: '700', color: colors.ink2 },
  navbar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: 20, paddingTop: 8 },
  navItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6, borderRadius: 14 },
  navItemActive: { backgroundColor: colors.primarySoft },
  navIco: { fontSize: 22 },
  navLabel: { fontSize: 10, fontWeight: '700', color: colors.ink3 },
  navLabelActive: { color: colors.primary },
});