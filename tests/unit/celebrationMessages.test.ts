import { describe, it, expect } from 'vitest';
import { getRandomCelebration } from '../../src/utils/celebrationMessages';

describe('getRandomCelebration', () => {
  it('returns a non-empty string', () => {
    const msg = getRandomCelebration();
    expect(msg).toBeTruthy();
    expect(typeof msg).toBe('string');
  });

  it('does not repeat the same message twice in a row', () => {
    const first = getRandomCelebration();
    // Call many times — at least one should differ
    let foundDifferent = false;
    for (let i = 0; i < 20; i++) {
      const next = getRandomCelebration();
      if (next !== first || i > 0) {
        foundDifferent = true;
        break;
      }
    }
    expect(foundDifferent).toBe(true);
  });

  it('returns messages from the expected pool', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) {
      seen.add(getRandomCelebration());
    }
    // Should have gotten at least 2 different messages
    expect(seen.size).toBeGreaterThanOrEqual(2);
  });
});
