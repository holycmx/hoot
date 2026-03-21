import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'hoot_state';

export const DEFAULT_STATE = {
  user: { enName: '', ageGroup: '', level: 'beginner', goal: '' },
  xp: 0,
  streak: 0,
  lastPlayed: null,
  lessonsCompleted: [],
  wordsLearned: 0,
  onboardingDone: false,
};

export async function loadState() {
  try {
    const s = await AsyncStorage.getItem(KEY);
    return s ? { ...DEFAULT_STATE, ...JSON.parse(s) } : DEFAULT_STATE;
  } catch { return DEFAULT_STATE; }
}

export async function saveState(state) {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}