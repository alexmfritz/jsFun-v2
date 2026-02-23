const MESSAGES = [
  'Nailed it! All tests passing!',
  'You got it! Great problem solving!',
  'All tests green — nice work!',
  'Crushed it! Moving right along!',
  'Excellent! That was solid coding!',
  'Boom! Another one in the books!',
  'Well done! Keep up the momentum!',
  'Perfect score! You should be proud!',
];

let lastIndex = -1;

export function getRandomCelebration(): string {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * MESSAGES.length);
  } while (idx === lastIndex && MESSAGES.length > 1);
  lastIndex = idx;
  return MESSAGES[idx];
}
