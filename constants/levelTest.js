// Adaptive Level Test Engine
// Each question has a difficulty: 'easy' | 'medium' | 'hard'
// The test starts on medium, adapts based on answers

export const QUESTION_POOL = [

  // ── EASY ──
  {
    id: 'e1', difficulty: 'easy',
    q: 'What colour is the sky?',
    opts: ['Red', 'Green', 'Blue', 'Yellow'],
    a: 2,
  },
  {
    id: 'e2', difficulty: 'easy',
    q: 'How do you say 안녕하세요 in English?',
    opts: ['Goodbye', 'Hello', 'Thank you', 'Sorry'],
    a: 1,
  },
  {
    id: 'e3', difficulty: 'easy',
    q: 'Which animal says "woof"?',
    opts: ['Cat', 'Bird', 'Dog', 'Fish'],
    a: 2,
  },
  {
    id: 'e4', difficulty: 'easy',
    q: 'How do you say 감사합니다 in English?',
    opts: ['Sorry', 'Please', 'Thank you', 'Hello'],
    a: 2,
  },
  {
    id: 'e5', difficulty: 'easy',
    q: 'What number comes after 4?',
    opts: ['3', '6', '5', '7'],
    a: 2,
  },
  {
    id: 'e6', difficulty: 'easy',
    q: 'Which is a fruit?',
    opts: ['Dog', 'Apple', 'Chair', 'Book'],
    a: 1,
  },

  // ── MEDIUM ──
  {
    id: 'm1', difficulty: 'medium',
    q: 'Choose the correct sentence:',
    opts: ['I am happy', 'I is happy', 'I are happy', 'I be happy'],
    a: 0,
  },
  {
    id: 'm2', difficulty: 'medium',
    q: 'She ___ to school every day.',
    opts: ['go', 'going', 'goes', 'gone'],
    a: 2,
  },
  {
    id: 'm3', difficulty: 'medium',
    q: 'Which is correct?',
    opts: ['a apple', 'an apple', 'a owl', 'an dog'],
    a: 1,
  },
  {
    id: 'm4', difficulty: 'medium',
    q: 'What is the plural of "cat"?',
    opts: ['cat', 'cates', 'cats', 'catz'],
    a: 2,
  },
  {
    id: 'm5', difficulty: 'medium',
    q: 'How do you say 어머니 in English?',
    opts: ['Sister', 'Father', 'Mother', 'Aunt'],
    a: 2,
  },
  {
    id: 'm6', difficulty: 'medium',
    q: '"I ___ a student." Which word fits?',
    opts: ['is', 'are', 'am', 'be'],
    a: 2,
  },
  {
    id: 'm7', difficulty: 'medium',
    q: 'Which sentence is correct?',
    opts: ['He don\'t like cats', 'He doesn\'t likes cats', 'He doesn\'t like cats', 'He not like cats'],
    a: 2,
  },

  // ── HARD ──
  {
    id: 'h1', difficulty: 'hard',
    q: 'Which sentence uses the present perfect correctly?',
    opts: ['I have went to school', 'I have been to school', 'I has been to school', 'I was been to school'],
    a: 1,
  },
  {
    id: 'h2', difficulty: 'hard',
    q: 'Choose the correct passive voice:',
    opts: ['The cake was eat by him', 'The cake is eaten by him', 'The cake was eaten by him', 'The cake eaten by him'],
    a: 2,
  },
  {
    id: 'h3', difficulty: 'hard',
    q: '"If I ___ rich, I would travel the world."',
    opts: ['am', 'was', 'were', 'be'],
    a: 2,
  },
  {
    id: 'h4', difficulty: 'hard',
    q: 'Which word is an adverb?',
    opts: ['quick', 'quickly', 'quickness', 'quicker'],
    a: 1,
  },
  {
    id: 'h5', difficulty: 'hard',
    q: 'Choose the correct relative pronoun:',
    opts: [
      'The girl which won the prize is my friend',
      'The girl who won the prize is my friend',
      'The girl whom won the prize is my friend',
      'The girl whose won the prize is my friend',
    ],
    a: 1,
  },
  {
    id: 'h6', difficulty: 'hard',
    q: '"She suggested ___ early." Which is correct?',
    opts: ['to leave', 'leaving', 'left', 'leave'],
    a: 1,
  },
];

// ── ADAPTIVE ENGINE ──
// Returns the next question ID based on history
export function getNextQuestion(history, usedIds, ageGroup = '9-13') {
  const lastEntry = history[history.length - 1];

  // Cap difficulty based on age
  const ageCap = {
    '5-8':   ['easy'],
    '9-13':  ['easy', 'medium'],
    '14-18': ['easy', 'medium', 'hard'],
  };
  const allowed = ageCap[ageGroup] || ['easy', 'medium'];

  let targetDifficulty;

  if (!lastEntry) {
    // Start: young kids on easy, older on medium
    targetDifficulty = ageGroup === '5-8' ? 'easy' : 'medium';
  } else if (lastEntry.correct) {
    const up = { easy: 'medium', medium: 'hard', hard: 'hard' };
    targetDifficulty = up[lastEntry.difficulty];
  } else {
    const down = { hard: 'medium', medium: 'easy', easy: 'easy' };
    targetDifficulty = down[lastEntry.difficulty];
  }

  // Clamp to age cap
  if (!allowed.includes(targetDifficulty)) {
    targetDifficulty = allowed[allowed.length - 1];
  }

  const candidates = QUESTION_POOL.filter(
    q => q.difficulty === targetDifficulty && !usedIds.includes(q.id)
  );

  if (candidates.length === 0) {
    const any = QUESTION_POOL.filter(
      q => allowed.includes(q.difficulty) && !usedIds.includes(q.id)
    );
    return any[0] || null;
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

// ── PLACEMENT ──
// Returns 'beginner' | 'elementary' | 'intermediate'
export function calculateLevel(history) {
  const hardCorrect = history.filter(h => h.difficulty === 'hard' && h.correct).length;
  const medCorrect = history.filter(h => h.difficulty === 'medium' && h.correct).length;
  const total = history.length;
  const correct = history.filter(h => h.correct).length;
  const pct = total > 0 ? correct / total : 0;

  if (hardCorrect >= 2) return 'intermediate';
  if (medCorrect >= 3 || pct >= 0.7) return 'elementary';
  return 'beginner';
}