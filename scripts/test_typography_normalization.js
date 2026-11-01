const fs = require('fs');
const path = require('path');

const APP_DIR = path.resolve(__dirname, '..');

const filesToInspect = [
  'constants/Typography.ts',
  'components/home/ClaudeHomeHeader.tsx',
  'components/home/ClaudeTodayWorkoutCard.tsx',
  'components/home/ClaudeChallengesCarousel.tsx',
  'components/workout/ClaudeTrainHeader.tsx',
  'components/workout/ClaudeWorkoutDetailModal.tsx',
  'components/workout/ClaudeActiveSessionModal.tsx',
  'components/workout/ClaudeSessionCompleteModal.tsx',
  'components/workout/ClaudePlanDetailModal.tsx',
  'components/workout/ClaudePlanBuildModal.tsx',
  'components/workout/ClaudePlanBuildBanner.tsx',
  'components/workout/ClaudeWorkoutFilters.tsx',
  'components/workout/ClaudeWorkoutRowCarousel.tsx',
  'components/workout/ClaudeResumeSessionCard.tsx',
  'components/workout/ClaudeVimeoPlayerModal.tsx',
  'app/(tabs)/challenge.tsx',
  'components/challenge/ClaudeChallengeDirectory.tsx',
  'components/challenge/ClaudeChallengeDetailModal.tsx',
  'components/challenge/ClaudeActiveChallengeBanner.tsx',
  'components/challenge/ClaudeCohortModal.tsx',
  'components/challenge/ClaudeInviteModal.tsx',
  'app/(tabs)/mealPlan.tsx',
  'components/nutrition/ClaudeMealAnalysisCard.tsx',
  'components/nutrition/ClaudeWeekPlanModal.tsx',
  'components/nutrition/ClaudeMealAnalysisModal.tsx',
  'components/nutrition/ClaudeShoppingListModal.tsx',
  'app/chat/index.tsx',
  'components/profile/ClaudeProfileHeader.tsx',
  'app/(tabs)/profile.tsx',
  'components/profile/ClaudeWearablesModal.tsx',
  'components/profile/ClaudeOneToOneBookingModal.tsx',
  'components/profile/ClaudeNotificationPreferencesModal.tsx',
  'components/profile/ClaudeInnerCircleApplyModal.tsx',
  'components/profile/ClaudeHabitsCard.tsx',
  'components/profile/ClaudeHabitDigestModal.tsx',
  'app/notifications.tsx',
  'app/plan.tsx',
  'app/profile/terms.tsx',
  'app/profile/privacy.tsx',
  'app/profile/about.tsx',
];

console.log('--- Victory Fitness Typography Normalization Audit ---');

let totalIssues = 0;

const typographyContent = fs.readFileSync(path.join(APP_DIR, 'constants/Typography.ts'), 'utf8');
if (!typographyContent.includes("heading: 'DMSans-SemiBold'") && !typographyContent.includes('Fonts.heading')) {
  console.error('[FAIL] Typography.ts must define DMSans-SemiBold for heading tokens');
  totalIssues++;
} else {
  console.log('[PASS] Typography.ts defines consistent DMSans-SemiBold hierarchy tokens');
}

for (const relPath of filesToInspect) {
  const fullPath = path.join(APP_DIR, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] File missing: ${relPath}`);
    totalIssues++;
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');

  if (relPath === 'constants/Typography.ts') continue;

  if (/default:\s*['"]ClashDisplay-Bold['"]/.test(content)) {
    console.error(`[FAIL] ${relPath} still defines default: 'ClashDisplay-Bold'`);
    totalIssues++;
  } else if (/fontFamily:\s*CLASH/.test(content) && !relPath.includes('ClaudeOnboardingFlow')) {
    console.error(`[FAIL] ${relPath} still uses fontFamily: CLASH`);
    totalIssues++;
  } else {
    console.log(`[PASS] ${relPath}: Typography is clean and normalized`);
  }
}

console.log('----------------------------------------------------');
if (totalIssues === 0) {
  console.log(`ALL CHECKS PASSED: 0 typography issues across ${filesToInspect.length} screens/components.`);
  process.exit(0);
} else {
  console.error(`FAILED with ${totalIssues} issue(s).`);
  process.exit(1);
}
