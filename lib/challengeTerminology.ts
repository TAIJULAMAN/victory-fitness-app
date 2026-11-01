
const dynamicChallengeTitles = new Set<string>();
const canonicalTitleByLower = new Map<string, string>();

export const EXCLUDED_CHALLENGE_UI_KEYS = new Set([
  'challenge',
  'challenges',
  'challenges:',
  'challenges...',
  'challenges hub',
  'challenges library',
  'challenge chat',
  'challenge chats',
  'challenge library',
  'challenge members',
  'challenge overview',
  'challenge details',
  'challenge progress',
  'challenge completed',
  'challenge finished',
  'challenge available',
  'challenge invite',
  'challenge guest invite',
  'active challenge',
  'active challenges',
  'completed challenge',
  'completed challenges',
  'ready to start challenge',
  'ready to start challenges',
  'your challenge',
  'your challenges',
  'community challenge',
  'community challenges',
  'limited challenges',
  'join challenge',
  'join this challenge',
  'leave challenge',
  'start challenge',
  'finish challenge',
  'failed to start challenge',
  'failed to start challenge.',
  'failed to load challenges',
  'failed to load challenges.',
  'failed to load challenge chat.',
  'failed to load challenge details.',
  'back to challenges',
  'fellow challengers',
  'what to do',
  'why it matters',
  'who is in it',
  'points',
  'pts',
  'joined',
  'days left',
  'day tracker',
  'challenge days',
]);

export const INITIAL_KNOWN_CHALLENGES: readonly string[] = [
  '21-Day Gold Beta',
  '21 Day Gold Beta',
  '21-Day Beta',
  'Morning Mobility Challenge',
  'Core Crusher',
  '30-Day Shred',
  '7-Day Reset',
  'Strength Foundation',
];

for (const title of INITIAL_KNOWN_CHALLENGES) {
  const trimmed = title.trim();
  dynamicChallengeTitles.add(trimmed);
  canonicalTitleByLower.set(trimmed.toLowerCase(), trimmed);
}

export function registerCanonicalChallengeTitle(title?: string | null): void {
  if (!title) return;
  const trimmed = String(title).trim();
  if (trimmed.length < 2 || trimmed.length > 200) return;

  const lower = trimmed.toLowerCase();
  if (EXCLUDED_CHALLENGE_UI_KEYS.has(lower)) {
    return;
  }

  dynamicChallengeTitles.add(trimmed);
  canonicalTitleByLower.set(lower, trimmed);
}

export function registerCanonicalChallengeTitles(titles?: Array<string | null | undefined>): void {
  if (!Array.isArray(titles)) return;
  for (const title of titles) {
    registerCanonicalChallengeTitle(title);
  }
}

const CHALLENGE_TITLE_PATTERNS = [
  /^\d+[- ](?:day|week|month)\b/i,
  /\bgold beta\b/i,
];

export function isCanonicalChallengeTitle(text?: string | null): boolean {
  if (!text) return false;
  const trimmed = String(text).trim();
  if (!trimmed || trimmed.length < 2) return false;

  const lower = trimmed.toLowerCase();

  if (EXCLUDED_CHALLENGE_UI_KEYS.has(lower)) {
    return false;
  }

  if (canonicalTitleByLower.has(lower) || dynamicChallengeTitles.has(trimmed)) {
    return true;
  }

  if (CHALLENGE_TITLE_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    registerCanonicalChallengeTitle(trimmed);
    return true;
  }

  return false;
}

export function canonicalizeChallengeTitle(title?: string | null): string {
  if (!title) return '';
  const trimmed = String(title).trim();
  const lower = trimmed.toLowerCase();
  return canonicalTitleByLower.get(lower) || trimmed;
}
