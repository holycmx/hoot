import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import TracksScreen from './screens/TracksScreen';

export default function App() {
  const [screen, setScreen] = useState('splash');

  if (screen === 'splash') {
    return <SplashScreen onFinish={() => setScreen('home')} />;
  }

  if (screen === 'tracks') {
    return <TracksScreen onSelectLesson={(track, lesson) => console.log(track, lesson)} />;
  }

  return <HomeScreen onNavigate={setScreen} />;
}