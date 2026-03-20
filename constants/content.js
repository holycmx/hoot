export const CONTENT = {
  units: [
    {
      id: 'u1',
      title: 'Nouns — People, Places, Things & Animals',
      level: 1,
      tracks: {
        vocab: {
          words: [
            { word: 'Girl',    phonetic: '/ɡɜːrl/',    korean: '여자아이', example: '"She is a girl."' },
            { word: 'Boy',     phonetic: '/bɔɪ/',       korean: '남자아이', example: '"He is a boy."' },
            { word: 'Teacher', phonetic: '/ˈtiːtʃər/', korean: '선생님',   example: '"She is a teacher."' },
            { word: 'Apple',   phonetic: '/ˈæpəl/',    korean: '사과',     example: '"I eat an apple."' },
            { word: 'Dog',     phonetic: '/dɒɡ/',       korean: '개',       example: '"It is a dog."' },
            { word: 'Island',  phonetic: '/ˈaɪlənd/',  korean: '섬',       example: '"It is an island."' },
            { word: 'Orange',  phonetic: '/ˈɔːrɪndʒ/',korean: '오렌지',   example: '"She has an orange."' },
            { word: 'Owl',     phonetic: '/aʊl/',       korean: '올빼미',   example: '"An owl flies at night."' },
          ],
          exercises: [
            { type: 'mc', prompt: 'Which word means 선생님?', options: ['Artist','Teacher','Student','Girl'], answer: 1, tip: '"Teacher" = 선생님' },
            { type: 'mc', prompt: 'Which is correct?', options: ['a apple','an apple','a owl','an dog'], answer: 1, tip: 'Vowels use "an"' },
            { type: 'mc', prompt: 'What is the English word for 개?', options: ['Cat','Bird','Dog','Fox'], answer: 2, tip: '"Dog" = 개' },
          ],
        },
        phonics: {
          words: [],
          exercises: [
            { type: 'mc', prompt: 'Which word uses "an"?', options: ['a book','an apple','a orange','an dog'], answer: 1, tip: '"Apple" starts with a vowel sound' },
            { type: 'mc', prompt: '"___ owl" — which article?', options: ['a','an','the','some'], answer: 1, tip: '"Owl" starts with a vowel sound → "an"' },
          ],
        },
        grammar: {
          words: [],
          exercises: [
            { type: 'mc', prompt: '"___ artist" — which article?', options: ['a','an','the','—'], answer: 1, tip: '"Artist" starts with a vowel → "an"' },
            { type: 'mc', prompt: '"___ school" — which article?', options: ['an','a','the','—'], answer: 1, tip: '"School" starts with a consonant → "a"' },
            { type: 'mc', prompt: 'Which sentence is correct?', options: ['She is a artist.','She is an artist.','She is the artist.','She is artist.'], answer: 1, tip: '"Artist" starts with a vowel → "an artist"' },
          ],
        },
        listening: {
          words: [],
          exercises: [
            { type: 'mc', prompt: 'You hear: "She is a teacher." What is she?', options: ['A student','A teacher','An artist','A girl'], answer: 1, tip: '"She is a teacher" → teacher' },
            { type: 'mc', prompt: 'You hear: "I eat an apple." What does she eat?', options: ['An orange','A banana','An apple','A mango'], answer: 2, tip: '"I eat an apple" → apple' },
          ],
        },
      },
    },
  ],
};