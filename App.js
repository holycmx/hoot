import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import LessonScreen from './screens/LessonScreen';
import SplashScreen from './screens/SplashScreen';
import TracksScreen from './screens/TracksScreen';

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [lessonTrack, setLessonTrack] = useState('vocab');

  if (screen === 'splash') return <SplashScreen onFinish={() => setScreen('home')} />;
  if (screen === 'lesson') return <LessonScreen track={lessonTrack} onBack={() => setScreen('tracks')} />;
  if (screen === 'tracks') return (
    <TracksScreen onSelectLesson={(track) => {
      setLessonTrack(track);
      setScreen('lesson');
    }} />
  );
  return <HomeScreen onNavigate={setScreen} />;
}