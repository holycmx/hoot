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
    <TracksScreen onSelectLesson={(track) => {
      setLessonTrack(track);
      setScreen('lesson');
    }} />
  );

  return <HomeScreen onNavigate={setScreen} />;
}