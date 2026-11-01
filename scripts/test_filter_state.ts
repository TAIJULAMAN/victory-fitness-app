
console.log('=== AUDITING & VALIDATING FILTER STATE ===\n');

interface WorkoutItem {
  id: string;
  name: string;
  purposes: string[];
  difficulty: string;
  durationMinutes: number;
  equipment: string;
}

const mockWorkouts: WorkoutItem[] = [
  { id: 'w1', name: 'Upper Body Hypertrophy', purposes: ['Upper Body', 'Strength'], difficulty: 'Intermediate', durationMinutes: 30, equipment: 'Dumbbells' },
  { id: 'w2', name: 'Lower Body Power', purposes: ['Lower Body', 'Strength'], difficulty: 'Advanced', durationMinutes: 45, equipment: 'Barbell' },
  { id: 'w3', name: 'Quick Morning Core', purposes: ['Core'], difficulty: 'Beginner', durationMinutes: 15, equipment: 'Bodyweight' },
  { id: 'w4', name: 'Full Body HIIT', purposes: ['Full Body', 'Cardio', 'HIIT'], difficulty: 'Intermediate', durationMinutes: 20, equipment: 'Bodyweight' },
];

class WorkoutScreenModel {
  selectedPurposes: string[] = ['All'];
  selectedDifficulty = 'Any';
  selectedDuration = 'Any';
  selectedKit = 'Any';
  searchQuery = '';

  isExpanded: boolean = false;

  onFreshNavigation() {
    this.isExpanded = false;
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  getActiveFiltersCount(): number {
    const activePurposes = this.selectedPurposes.filter((p) => p !== 'All');
    return (
      activePurposes.length +
      (this.selectedDifficulty !== 'Any' ? 1 : 0) +
      (this.selectedDuration !== 'Any' ? 1 : 0) +
      (this.selectedKit !== 'Any' ? 1 : 0)
    );
  }

  getFilteredWorkouts(): WorkoutItem[] {
    return mockWorkouts.filter((w) => {
      if (this.selectedPurposes.length > 0 && !this.selectedPurposes.includes('All')) {
        const matches = this.selectedPurposes.some((p) => w.purposes.includes(p));
        if (!matches) return false;
      }
      if (this.selectedDifficulty !== 'Any' && w.difficulty.toLowerCase() !== this.selectedDifficulty.toLowerCase()) {
        return false;
      }
      if (this.selectedDuration !== 'Any') {
        const dur = Number(this.selectedDuration);
        if (dur === 15 && w.durationMinutes > 15) return false;
        if (dur === 30 && (w.durationMinutes <= 15 || w.durationMinutes > 30)) return false;
      }
      if (this.selectedKit !== 'Any' && !w.equipment.toLowerCase().includes(this.selectedKit.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  resetFilters() {
    this.selectedPurposes = ['All'];
    this.selectedDifficulty = 'Any';
    this.selectedDuration = 'Any';
    this.selectedKit = 'Any';
    this.searchQuery = '';
  }
}

interface ChallengeItem {
  id: string;
  name: string;
  durationDays: number;
  category: string;
}

const mockChallenges: ChallengeItem[] = [
  { id: 'c1', name: '21-Day Gold Beta', durationDays: 21, category: 'PHYSICAL' },
  { id: 'c2', name: '7-Day Reset', durationDays: 7, category: 'MENTAL' },
  { id: 'c3', name: '14-Day Mobility', durationDays: 14, category: 'PHYSICAL' },
  { id: 'c4', name: '3-Day Jumpstart', durationDays: 3, category: 'NUTRITION' },
];

class ChallengeScreenModel {
  selectedDay = 'All';
  selectedCat = 'All';
  isFiltersExpanded: boolean = false;

  onFreshNavigation() {
    this.isFiltersExpanded = false;
  }

  toggleExpand() {
    this.isFiltersExpanded = !this.isFiltersExpanded;
  }

  getActiveFiltersCount(): number {
    return (this.selectedDay !== 'All' ? 1 : 0) + (this.selectedCat !== 'All' ? 1 : 0);
  }

  getFilteredChallenges(): ChallengeItem[] {
    return mockChallenges.filter((ch) => {
      if (this.selectedDay !== 'All' && String(ch.durationDays) !== this.selectedDay) {
        return false;
      }
      if (this.selectedCat !== 'All' && ch.category.toLowerCase() !== this.selectedCat.toLowerCase()) {
        return false;
      }
      return true;
    });
  }

  resetFilters() {
    this.selectedDay = 'All';
    this.selectedCat = 'All';
  }
}

console.log('--- Testing Workout Screen Filter Flow ---');
const workoutScreen = new WorkoutScreenModel();

console.log('1. Initial navigation into Workout:');
console.log('   isExpanded:', workoutScreen.isExpanded, '(Expected: false)');
console.log('   Button text:', workoutScreen.isExpanded ? 'Collapse ▲' : 'Expand ▼');
if (workoutScreen.isExpanded !== false) {
  throw new Error('Workout filter should be collapsed on initial navigation');
}

console.log('2. User taps Expand button:');
workoutScreen.toggleExpand();
console.log('   isExpanded:', workoutScreen.isExpanded, '(Expected: true)');
console.log('   Button text:', workoutScreen.isExpanded ? 'Collapse ▲' : 'Expand ▼');
if (!workoutScreen.isExpanded) {
  throw new Error('Workout filter should be expanded after toggle');
}

console.log('3. User selects filters (Upper Body, Intermediate):');
workoutScreen.selectedPurposes = ['Upper Body'];
workoutScreen.selectedDifficulty = 'Intermediate';
const filteredW = workoutScreen.getFilteredWorkouts();
console.log('   Active filter count:', workoutScreen.getActiveFiltersCount(), '(Expected: 2)');
console.log('   Filtered workouts count:', filteredW.length, '(Expected: 1,', filteredW[0]?.name, ')');
if (workoutScreen.getActiveFiltersCount() !== 2 || filteredW.length !== 1 || filteredW[0]?.id !== 'w1') {
  throw new Error('Workout filtering did not match expected results');
}

console.log('4. User navigates away to another screen, then navigates back to Workout:');
workoutScreen.onFreshNavigation();
console.log('   isExpanded:', workoutScreen.isExpanded, '(Expected: false - collapsed on return)');
console.log('   Button text:', workoutScreen.isExpanded ? 'Collapse ▲' : 'Expand ▼');
console.log('   Preserved Active filter count:', workoutScreen.getActiveFiltersCount(), '(Expected: 2)');
console.log('   Preserved Filtered workouts count:', workoutScreen.getFilteredWorkouts().length, '(Expected: 1)');
if (workoutScreen.isExpanded !== false) {
  throw new Error('Workout filter must collapse on fresh navigation return');
}
if (workoutScreen.getActiveFiltersCount() !== 2 || workoutScreen.getFilteredWorkouts().length !== 1) {
  throw new Error('Workout filter selections and results must be preserved on navigation');
}

console.log('5. User taps Expand and resets:');
workoutScreen.toggleExpand();
workoutScreen.resetFilters();
console.log('   Active filter count after reset:', workoutScreen.getActiveFiltersCount(), '(Expected: 0)');
console.log('   Workouts after reset:', workoutScreen.getFilteredWorkouts().length, '(Expected: 4)');
if (workoutScreen.getActiveFiltersCount() !== 0 || workoutScreen.getFilteredWorkouts().length !== 4) {
  throw new Error('Reset failed');
}

console.log('Workout filter tests PASSED!\n');

console.log('--- Testing Challenge Screen Filter Flow ---');
const challengeScreen = new ChallengeScreenModel();

console.log('1. Initial navigation into Challenge:');
console.log('   isFiltersExpanded:', challengeScreen.isFiltersExpanded, '(Expected: false)');
console.log('   Button text:', challengeScreen.isFiltersExpanded ? 'Collapse ▲' : 'Expand ▼');
if (challengeScreen.isFiltersExpanded !== false) {
  throw new Error('Challenge filter should be collapsed on initial navigation');
}

console.log('2. User taps Expand button:');
challengeScreen.toggleExpand();
console.log('   isFiltersExpanded:', challengeScreen.isFiltersExpanded, '(Expected: true)');
console.log('   Button text:', challengeScreen.isFiltersExpanded ? 'Collapse ▲' : 'Expand ▼');
if (!challengeScreen.isFiltersExpanded) {
  throw new Error('Challenge filter should be expanded after toggle');
}

console.log('3. User selects filters (7 days, Mental):');
challengeScreen.selectedDay = '7';
challengeScreen.selectedCat = 'Mental';
const filteredC = challengeScreen.getFilteredChallenges();
console.log('   Active filter count:', challengeScreen.getActiveFiltersCount(), '(Expected: 2)');
console.log('   Filtered challenges count:', filteredC.length, '(Expected: 1,', filteredC[0]?.name, ')');
if (challengeScreen.getActiveFiltersCount() !== 2 || filteredC.length !== 1 || filteredC[0]?.id !== 'c2') {
  throw new Error('Challenge filtering did not match expected results');
}

console.log('4. User navigates away to another screen, then navigates back to Challenge:');
challengeScreen.onFreshNavigation();
console.log('   isFiltersExpanded:', challengeScreen.isFiltersExpanded, '(Expected: false - collapsed on return)');
console.log('   Button text:', challengeScreen.isFiltersExpanded ? 'Collapse ▲' : 'Expand ▼');
console.log('   Preserved Active filter count:', challengeScreen.getActiveFiltersCount(), '(Expected: 2)');
console.log('   Preserved Filtered challenges count:', challengeScreen.getFilteredChallenges().length, '(Expected: 1)');
if (challengeScreen.isFiltersExpanded !== false) {
  throw new Error('Challenge filter must collapse on fresh navigation return');
}
if (challengeScreen.getActiveFiltersCount() !== 2 || challengeScreen.getFilteredChallenges().length !== 1) {
  throw new Error('Challenge filter selections and results must be preserved on navigation');
}

console.log('5. User taps Expand and resets:');
challengeScreen.toggleExpand();
challengeScreen.resetFilters();
console.log('   Active filter count after reset:', challengeScreen.getActiveFiltersCount(), '(Expected: 0)');
console.log('   Challenges after reset:', challengeScreen.getFilteredChallenges().length, '(Expected: 4)');
if (challengeScreen.getActiveFiltersCount() !== 0 || challengeScreen.getFilteredChallenges().length !== 4) {
  throw new Error('Challenge reset failed');
}

console.log('Challenge filter tests PASSED!\n');
console.log('=== ALL FILTER STATE AUDITS & VALIDATIONS PASSED! ===');
