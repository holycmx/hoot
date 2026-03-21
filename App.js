import LeaderboardScreen from './screens/LeaderboardScreen';
import QuizScreen from './screens/QuizScreen';
import ProfileScreen from './screens/ProfileScreen';
import { useEffect, useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import LessonScreen from './screens/LessonScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import SplashScreen from './screens/SplashScreen';
import TracksScreen from './screens/TracksScreen';
import { loadState, saveState, DEFAULT_STATE } from './constants/state';

export default function App() {
  const [appState, setAppState] = useState(null);
  const [screen, setScreen] = useState('splash');
  const [lessonTrack, setLessonTrack] = useState('vocab');

  useEffect(() => {
    loadState().then(s => setAppState(s));
  }, []);

  async function handleOnboardingFinish(userData) {
    const newState = {
      ...DEFAULT_STATE,
      user: userData,
      onboardingDone: true,
    };
    setAppState(newState);
    await saveState(newState);
    setScreen('home');
  }

  if (!appState) return null;

  if (screen === 'splash') return <SplashScreen onFinish={() => {
    setScreen(appState.onboardingDone ? 'home' : 'onboarding');
  }} />;

  if (screen === 'onboarding') return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  if (screen === 'lesson') return <LessonScreen track={lessonTrack} onBack={() => setScreen('tracks')} />;
  if (screen === 'tracks') return (
<TracksScreen
  onNavigate={setScreen}
  onSelectLesson={(track) => {
    setLessonTrack(track);
      setScreen('lesson');
    }} />
  );
  if (screen === 'leaderboard') {
  console.log('navigating to leaderboard');
  return (
    <LeaderboardScreen
      onNavigate={setScreen}
      userName={appState.user?.enName}
    />
  );
}
if (screen === 'quiz') return (
    <QuizScreen
      onNavigate={setScreen}
      lessonsCompleted={appState.lessonsCompleted}
    />
  );
if (screen === 'profile') return (
    <ProfileScreen
      onNavigate={setScreen}
      userName={appState.user?.enName}
      userLevel={appState.user?.level}
      xp={appState.xp}
      streak={appState.streak}
      wordsLearned={appState.wordsLearned}
      lessonsCompleted={appState.lessonsCompleted?.length}
    />
  );

  return <HomeScreen onNavigate={setScreen} userName={appState.user?.enName} />;
}