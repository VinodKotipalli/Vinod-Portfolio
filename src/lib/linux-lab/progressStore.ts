import { CHALLENGES, ChallengeCategory, CATEGORIES } from './challenges';

export interface LabProgress {
  completedChallengeIds: number[];
  currentChallengeId: number;
  unlockedAll: boolean;
  totalXp: number;
  hintsUsed: Record<number, number>; // challengeId -> hint level unlocked (1, 2, 3)
  solutionRevealed: Record<number, boolean>;
  mode: 'challenge' | 'practice';
}

const STORAGE_KEY = 'linux_lab_progress_v1';

export const LEVEL_TIERS = [
  { level: 1, title: 'Linux Novice', minXp: 0, badge: '🟢' },
  { level: 2, title: 'Terminal Explorer', minXp: 250, badge: '🟢' },
  { level: 3, title: 'Filesystem Navigator', minXp: 600, badge: '🔵' },
  { level: 4, title: 'Permission Sentry', minXp: 1100, badge: '🔵' },
  { level: 5, title: 'Process Controller', minXp: 1700, badge: '🟣' },
  { level: 6, title: 'Network Diagnostician', minXp: 2400, badge: '🟣' },
  { level: 7, title: 'Stream & Pipe Artisan', minXp: 3200, badge: '🟡' },
  { level: 8, title: 'Automation Engineer', minXp: 4000, badge: '🟡' },
  { level: 9, title: 'Cloud Operations Specialist', minXp: 4800, badge: '🟠' },
  { level: 10, title: 'Linux Infrastructure Architect', minXp: 5500, badge: '🏆' },
];

export function loadLabProgress(): LabProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        completedChallengeIds: Array.isArray(parsed.completedChallengeIds) ? parsed.completedChallengeIds : [],
        currentChallengeId: typeof parsed.currentChallengeId === 'number' ? parsed.currentChallengeId : 1,
        unlockedAll: Boolean(parsed.unlockedAll),
        totalXp: typeof parsed.totalXp === 'number' ? parsed.totalXp : 0,
        hintsUsed: parsed.hintsUsed || {},
        solutionRevealed: parsed.solutionRevealed || {},
        mode: parsed.mode === 'practice' ? 'practice' : 'challenge',
      };
    }
  } catch (err) {
    console.warn('Failed to load lab progress from localStorage', err);
  }

  return {
    completedChallengeIds: [],
    currentChallengeId: 1,
    unlockedAll: false,
    totalXp: 0,
    hintsUsed: {},
    solutionRevealed: {},
    mode: 'challenge',
  };
}

export function saveLabProgress(progress: LabProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Failed to save lab progress to localStorage', err);
  }
}

export function getLevelInfo(xp: number) {
  let currentTier = LEVEL_TIERS[0];
  let nextTier = LEVEL_TIERS[1];

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      currentTier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || null;
    }
  }

  const currentLevelMin = currentTier.minXp;
  const nextLevelMin = nextTier ? nextTier.minXp : currentLevelMin + 1000;
  const xpInCurrentLevel = xp - currentLevelMin;
  const xpNeeded = nextLevelMin - currentLevelMin;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeeded) * 100));

  return {
    level: currentTier.level,
    title: currentTier.title,
    badge: currentTier.badge,
    totalXp: xp,
    xpToNext: nextTier ? nextTier.minXp - xp : 0,
    progressPercent,
    isMaxLevel: !nextTier,
  };
}

export function calculateCategoryStats(completedIds: number[]) {
  const set = new Set(completedIds);

  return CATEGORIES.map((cat) => {
    const totalInCat = CHALLENGES.filter((c) => c.category === cat.id);
    const completedInCat = totalInCat.filter((c) => set.has(c.id));
    const percentage = totalInCat.length > 0 ? Math.round((completedInCat.length / totalInCat.length) * 100) : 0;

    return {
      category: cat.id,
      title: cat.title,
      total: totalInCat.length,
      completed: completedInCat.length,
      percentage,
    };
  });
}
