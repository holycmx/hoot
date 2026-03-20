import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <HomeScreen />;
}