import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.fox}>🦊</Text>
      <Text style={styles.title}>Hoot</Text>
      <Text style={styles.sub}>Learn English · 영어 배우기</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fox: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#14121F',
    letterSpacing: -2,
  },
  sub: {
    fontSize: 14,
    color: '#6B6880',
    marginTop: 8,
  },
});