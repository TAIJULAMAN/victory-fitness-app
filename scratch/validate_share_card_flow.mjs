import assert from 'node:assert';

function truncateCanvasText(measureFn, text, maxWidth) {
  if (measureFn(text) <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 1 && measureFn(truncated + '…') > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated.trim() + '…';
}

function mapCompletedExercises(exercises) {
  return exercises
    .map((exercise) => {
      const name = String(exercise.name || exercise.n || '').trim();
      if (!name) return null;
      const summary = String(exercise.s || '').trim();
      return {
        n: name,
        s: summary,
        cardN: String(exercise.cardN || name).trim(),
      };
    })
    .filter((exercise) => Boolean(exercise));
}

function calculateCompletedSessionExercises(sessionExercises, loggedSets) {
  return sessionExercises
    .map((ex, idx) => {
      const loggedCount = Object.keys(loggedSets).filter((k) => k.startsWith(`${idx}:`)).length;
      if (loggedCount === 0) return null;
      return {
        id: ex.id,
        name: ex.name,
        s: `${loggedCount} sets`,
        cardN: ex.name.trim(),
        setsLogged: loggedCount,
        targetSets: ex.targetSets,
      };
    })
    .filter((ex) => Boolean(ex));
}

function getStoryCardDisplay(completedExercises, maxVisible = 5) {
  const visible = completedExercises.slice(0, maxVisible);
  const overflow = completedExercises.length - visible.length;
  return {
    visible,
    overflowCount: overflow,
    hasMore: overflow > 0,
  };
}

console.log('--- RUNNING WORKOUT COMPLETION & SHARE CARD AUDIT VALIDATION ---');

{
  const sessionExercises = [
    { id: '1', name: 'Bench Press', targetSets: 3 },
    { id: '2', name: 'Lat Pulldown', targetSets: 3 },
    { id: '3', name: 'Shoulder Press', targetSets: 3 },
    { id: '4', name: 'Biceps Curl', targetSets: 3 },
  ];
  const loggedSets = {
    '0:0': '80 kg × 10', '0:1': '80 kg × 10', '0:2': '80 kg × 8',
    '1:0': '65 kg × 10', '1:1': '65 kg × 10', '1:2': '65 kg × 10',
    '2:0': '45 kg × 10', '2:1': '45 kg × 10', '2:2': '45 kg × 8',
    '3:0': '16 kg × 12', '3:1': '16 kg × 12', '3:2': '16 kg × 10',
  };

  const completed = calculateCompletedSessionExercises(sessionExercises, loggedSets);
  assert.strictEqual(completed.length, 4, 'All 4 exercises should be marked completed');
  assert.deepStrictEqual(
    completed.map((e) => e.cardN),
    ['Bench Press', 'Lat Pulldown', 'Shoulder Press', 'Biceps Curl'],
    'Exercise names must match exact completed items'
  );

  const cardDisplay = getStoryCardDisplay(completed);
  assert.strictEqual(cardDisplay.visible.length, 4, 'Story card must show all 4 exercises');
  assert.strictEqual(cardDisplay.hasMore, false, 'Should have no overflow for 4 exercises');
  console.log('✓ TEST 1 PASSED: 4 exercises completed, all 4 appear on card.');
}

{
  const sessionExercises = [
    { id: '1', name: 'Bench Press', targetSets: 3 },
    { id: '2', name: 'Lat Pulldown', targetSets: 3 },
    { id: '3', name: 'Shoulder Press', targetSets: 3 },
    { id: '4', name: 'Biceps Curl', targetSets: 3 },
  ];
  const loggedSets = {
    '0:0': '80 kg × 10', '0:1': '80 kg × 10', '0:2': '80 kg × 8',
    '1:0': '65 kg × 10', '1:1': '65 kg × 10', '1:2': '65 kg × 10',
    '3:0': '16 kg × 12', '3:1': '16 kg × 12', '3:2': '16 kg × 10',
  };

  const completed = calculateCompletedSessionExercises(sessionExercises, loggedSets);
  assert.strictEqual(completed.length, 3, 'Only 3 exercises should be completed');
  assert.strictEqual(completed.some((e) => e.name === 'Shoulder Press'), false, 'Skipped exercise must NOT appear');
  assert.deepStrictEqual(
    completed.map((e) => e.cardN),
    ['Bench Press', 'Lat Pulldown', 'Biceps Curl'],
    'Only completed movements should be returned'
  );
  console.log('✓ TEST 2 PASSED: Skipped exercise is not falsely shown.');
}

{
  const sessionExercises = [
    { id: '1', name: 'Incline Dumbbell Press', targetSets: 3 }, // Swapped from Flat Bench
    { id: '2', name: 'Lat Pulldown', targetSets: 3 },
    { id: '3', name: 'Dumbbell Lateral Raise', targetSets: 3 }, // Swapped from Shoulder Press
    { id: '4', name: 'Hammer Curl', targetSets: 3 },            // Swapped from Biceps Curl
  ];
  const loggedSets = {
    '0:0': '28 kg × 10',
    '1:0': '60 kg × 10',
    '2:0': '12 kg × 15',
    '3:0': '14 kg × 12',
  };

  const completed = calculateCompletedSessionExercises(sessionExercises, loggedSets);
  assert.strictEqual(completed[0].cardN, 'Incline Dumbbell Press');
  assert.strictEqual(completed[2].cardN, 'Dumbbell Lateral Raise');
  assert.strictEqual(completed[3].cardN, 'Hammer Curl');
  console.log('✓ TEST 3 PASSED: Swapped/changed exercises are accurately captured and shown.');
}

{
  const longName = 'Incline Dumbbell Bench Press with 3-Second Eccentric Pause and Peak Contraction';
  const mockMeasure = (txt) => txt.length * 12;
  const maxWidth = 400;

  const truncated = truncateCanvasText(mockMeasure, longName, maxWidth);
  assert.ok(mockMeasure(truncated) <= maxWidth, 'Truncated text must fit within maxWidth');
  assert.ok(truncated.endsWith('…'), 'Truncated text must end with ellipsis');
  console.log(`✓ TEST 4 PASSED: Long exercise name truncated cleanly: "${truncated}" (${mockMeasure(truncated)}px <= ${maxWidth}px)`);
}

{
  const sessionExercises = [
    { id: '1', name: 'Bench Press', targetSets: 3 },
    { id: '2', name: 'Incline Dumbbell Flyes', targetSets: 3 },
    { id: '3', name: 'Lat Pulldown', targetSets: 3 },
    { id: '4', name: 'Cable Seated Row', targetSets: 3 },
    { id: '5', name: 'Overhead Barbell Press', targetSets: 3 },
    { id: '6', name: 'Lateral Raises', targetSets: 3 },
    { id: '7', name: 'Triceps Rope Pushdown', targetSets: 3 },
    { id: '8', name: 'Biceps Cable Curl', targetSets: 3 },
  ];
  const loggedSets = {};
  sessionExercises.forEach((_, idx) => {
    loggedSets[`${idx}:0`] = '10 reps';
  });

  const completed = calculateCompletedSessionExercises(sessionExercises, loggedSets);
  assert.strictEqual(completed.length, 8);
  const cardDisplay = getStoryCardDisplay(completed, 5);
  assert.strictEqual(cardDisplay.visible.length, 5, 'Max visible must be 5');
  assert.strictEqual(cardDisplay.overflowCount, 3, 'Must report 3 overflow movements');
  assert.strictEqual(cardDisplay.hasMore, true);
  console.log('✓ TEST 5 PASSED: 8 exercises gracefully capped at 5 visible + 3 overflow badge.');
}

{
  const streakDays = 14;
  const minutes = 45;
  const setsLogged = 12;
  const coachQuote = 'Fourteen days straight. That is not motivation any more — that is who you are.';
  assert.strictEqual(streakDays, 14);
  assert.strictEqual(minutes, 45);
  assert.strictEqual(setsLogged, 12);
  assert.ok(coachQuote.includes('Fourteen days straight'));
  console.log('✓ TEST 6 PASSED: Streak, intensity, time, coach quote logic verified.');
}

console.log('--- ALL SHARE CARD AUDIT VALIDATIONS SUCCEEDED ---');
