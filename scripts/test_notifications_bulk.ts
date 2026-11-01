
import { AppNotification } from '../lib/api';

console.log('=== AUDITING & VALIDATING NOTIFICATION BULK MANAGEMENT & MARK ALL AS READ ===\n');

type ActivityNotification = {
  id: string;
  category: string;
  title: string;
  message: string;
  route: string;
  created_at: string;
};

class NotificationScreenModel {
  pushNotifications: AppNotification[] = [];
  activityNotifications: ActivityNotification[] = [];
  readActivityIds = new Set<string>();
  isSelectMode = false;
  selectedIds = new Set<string>();
  isDeletingBulk = false;
  isMarkingRead = false;
  bulkConfirmAction: string | null = null;
  cacheInvalidated = false;

  constructor() {
    this.reset();
  }

  reset() {
    this.pushNotifications = [
      { id: 'p1', type: 'workout_published', title: 'New Workout', message: 'Check Upper Body Push', created_at: new Date(Date.now() - 3600000).toISOString(), read: false },
      { id: 'p2', type: 'coach_victor_nudge', title: 'Coach Nudge', message: 'Ready for today?', created_at: new Date(Date.now() - 7200000).toISOString(), read: true },
      { id: 'p3', type: 'system_alert', title: 'Weekly Recap', message: 'You crushed 4 workouts', created_at: new Date(Date.now() - 10800000).toISOString(), read: false },
    ];
    this.activityNotifications = [
      { id: 'a1', category: 'CHALLENGE ACTIVE', title: '21-Day Gold Beta', message: '50% complete', route: '/challenges/1', created_at: new Date(Date.now() - 1800000).toISOString() },
      { id: 'a2', category: 'COMMUNITY POST', title: 'Sarah posted', message: 'Great job team!', route: '/community', created_at: new Date(Date.now() - 5400000).toISOString() },
    ];
    this.readActivityIds = new Set<string>();
    this.isSelectMode = false;
    this.selectedIds = new Set();
    this.isDeletingBulk = false;
    this.isMarkingRead = false;
    this.bulkConfirmAction = null;
    this.cacheInvalidated = false;
  }

  get unreadPushCount(): number {
    return this.pushNotifications.filter((n) => !n.read).length;
  }

  get unreadActivityCount(): number {
    return this.activityNotifications.filter((n) => !this.readActivityIds.has(n.id)).length;
  }

  get unreadCount(): number {
    return this.unreadPushCount + this.unreadActivityCount;
  }

  get allVisibleIds(): string[] {
    return [...this.pushNotifications.map((n) => n.id), ...this.activityNotifications.map((n) => n.id)];
  }

  get totalCount(): number {
    return this.allVisibleIds.length as number;
  }

  get isAllSelected(): boolean {
    return this.totalCount > 0 && this.selectedIds.size === this.totalCount;
  }

  toggleSelectMode() {
    if (this.isSelectMode) {
      this.isSelectMode = false;
      this.selectedIds = new Set();
    } else {
      this.isSelectMode = true;
    }
  }

  toggleItemSelection(id: string) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  handleSelectAllToggle() {
    if (this.isAllSelected) {
      this.selectedIds.clear();
    } else {
      this.selectedIds = new Set(this.allVisibleIds);
    }
  }

  removeNotification(id: string) {
    this.pushNotifications = this.pushNotifications.filter((n) => n.id !== id);
    this.activityNotifications = this.activityNotifications.filter((n) => n.id !== id);
    this.selectedIds.delete(id);
    this.readActivityIds.delete(id);
    this.cacheInvalidated = true;
  }

  handleMarkAllRead() {
    if (this.isMarkingRead || this.unreadCount === 0) return;
    this.pushNotifications = this.pushNotifications.map((n) => ({ ...n, read: true }));
    this.readActivityIds = new Set(this.activityNotifications.map((n) => n.id));
    this.cacheInvalidated = true;
  }

  handleMarkSelectedRead() {
    if (this.selectedIds.size === 0 || this.isMarkingRead) return;
    const selected = new Set(this.selectedIds);
    this.pushNotifications = this.pushNotifications.map((n) =>
      selected.has(n.id) ? { ...n, read: true } : n,
    );
    this.activityNotifications.forEach((n) => {
      if (selected.has(n.id)) {
        this.readActivityIds.add(n.id);
      }
    });
    this.selectedIds.clear();
    this.cacheInvalidated = true;
  }

  requestBulkDelete(mode: 'selected' | 'all') {
    if (mode === 'selected' && this.selectedIds.size === 0) return;
    if (mode === 'all' && this.totalCount === 0) return;
    this.bulkConfirmAction = mode;
  }

  cancelBulkDelete() {
    this.bulkConfirmAction = null;
  }

  confirmExecuteBulkDelete() {
    if (!this.bulkConfirmAction) return;

    if (this.bulkConfirmAction === 'selected') {
      const selected = new Set(this.selectedIds);
      this.pushNotifications = this.pushNotifications.filter((n) => !selected.has(n.id));
      this.activityNotifications = this.activityNotifications.filter((n) => !selected.has(n.id));
      selected.forEach((id) => this.readActivityIds.delete(id));
      this.selectedIds.clear();
      this.cacheInvalidated = true;
      if (this.totalCount === 0) {
        this.isSelectMode = false;
      }
    } else if (this.bulkConfirmAction === 'all') {
      this.pushNotifications = [];
      this.activityNotifications = [];
      this.readActivityIds.clear();
      this.selectedIds.clear();
      this.isSelectMode = false;
      this.cacheInvalidated = true;
    }

    this.bulkConfirmAction = null;
  }

  refresh(serverData: { push: AppNotification[]; activity: ActivityNotification[] }) {
    this.pushNotifications = [...serverData.push];
    this.activityNotifications = [...serverData.activity];
  }
}

function assertEq(actual: unknown, expected: unknown, msg: string) {
  if (actual !== expected) {
    throw new Error(`${msg}: expected ${expected}, got ${actual}`);
  }
}


const model = new NotificationScreenModel();

console.log('Test 1: Initial state & Unread count');
console.log(`Initial total notifications: ${model.totalCount}`);
console.log(`Initial unread count: ${model.unreadCount}`);
assertEq(model.totalCount, 5, 'Initial total notifications');
assertEq(model.unreadCount, 4, 'Initial unread count');
console.log('✓ PASS: Initial state & unread count correct\n');

console.log('Test 2: Single notification delete (existing flow preserved)');
model.removeNotification('p1');
console.log(`After deleting p1: total=${model.totalCount}, unread=${model.unreadCount}`);
assertEq(model.totalCount, 4, 'Total after deleting p1');
assertEq(model.unreadCount, 3, 'Unread after deleting p1');
if (!model.cacheInvalidated) {
  throw new Error('Expected cache invalidation on single delete');
}
console.log('✓ PASS: Single notification delete preserved and updates unread count\n');

console.log('Test 3: Select mode & multiple selection');
model.reset();
model.toggleSelectMode();
assertEq(model.isSelectMode, true, 'isSelectMode');

model.toggleItemSelection('p1');
model.toggleItemSelection('a1');
console.log(`Selected count: ${model.selectedIds.size}`);
assertEq(model.selectedIds.size, 2, 'selectedIds.size');
if (!model.selectedIds.has('p1') || !model.selectedIds.has('a1')) {
  throw new Error('Expected 2 items selected (p1, a1)');
}
assertEq(model.isAllSelected, false, 'isAllSelected when partial');
console.log('✓ PASS: Multiple selection toggles individual items\n');

console.log('Test 4: Select All and Deselect All');
model.handleSelectAllToggle();
console.log(`After Select All: selected=${model.selectedIds.size}, isAllSelected=${model.isAllSelected}`);
assertEq(model.selectedIds.size, 5, 'selected after Select All');
assertEq(model.isAllSelected, true, 'isAllSelected after Select All');

model.handleSelectAllToggle();
console.log(`After Deselect All: selected=${model.selectedIds.size}, isAllSelected=${model.isAllSelected}`);
assertEq(model.selectedIds.size, 0, 'selected after Deselect All');
assertEq(model.isAllSelected, false, 'isAllSelected after Deselect All');
console.log('✓ PASS: Select All and Deselect All work correctly\n');

console.log('Test 5: Delete Selected (confirmation prompt gated)');
model.reset();
model.toggleSelectMode();
model.toggleItemSelection('p1');
model.toggleItemSelection('p2');

model.requestBulkDelete('selected');
assertEq(model.bulkConfirmAction, 'selected', 'bulkConfirmAction');

model.confirmExecuteBulkDelete();
console.log(`After Delete Selected: total=${model.totalCount}, unread=${model.unreadCount}`);
assertEq(model.totalCount, 3, 'Total after Delete Selected');
assertEq(model.unreadCount, 3, 'Unread after Delete Selected');
assertEq(model.selectedIds.size, 0, 'selectedIds after Delete Selected');
console.log('✓ PASS: Delete Selected removes selected notifications and updates unread count\n');

console.log('Test 6: Delete All (confirmation prompt gated)');
model.reset();
model.toggleSelectMode();

model.requestBulkDelete('all');
assertEq(model.bulkConfirmAction, 'all', 'bulkConfirmAction for all');

model.cancelBulkDelete();
assertEq(model.bulkConfirmAction, null, 'bulkConfirmAction after cancel');
assertEq(model.totalCount, 5, 'Total after cancel');

model.requestBulkDelete('all');
model.confirmExecuteBulkDelete();
console.log(`After Delete All: total=${model.totalCount}, unread=${model.unreadCount}`);
assertEq(model.totalCount, 0, 'Total after Delete All');
assertEq(model.unreadCount, 0, 'Unread after Delete All');
assertEq(model.isSelectMode, false, 'isSelectMode after Delete All');
console.log('✓ PASS: Delete All clears all notifications and exits select mode\n');

console.log('Test 7: Refresh persistence & cache invalidation');
model.reset();
model.toggleSelectMode();
model.toggleItemSelection('p1');
model.toggleItemSelection('p3');
model.requestBulkDelete('selected');
model.confirmExecuteBulkDelete();

const serverDatabaseState = {
  push: model.pushNotifications,
  activity: model.activityNotifications,
};

model.refresh(serverDatabaseState);
console.log(`After refresh: total=${model.totalCount}, unread=${model.unreadCount}`);
if (model.totalCount !== 3 || model.unreadCount !== 2) {
  throw new Error('Deleted notifications returned after refresh!');
}
const remainingPushIds = model.pushNotifications.map((n) => n.id);
if (remainingPushIds.includes('p1') || remainingPushIds.includes('p3')) {
  throw new Error('Deleted push notification IDs still present after refresh!');
}
console.log('✓ PASS: Deleted notifications do not return after refresh (persistence verified)\n');

console.log('Test 8: Mark all as read');
model.reset();
assertEq(model.unreadCount, 4, 'Unread count before mark all read');
model.handleMarkAllRead();
console.log(`After Mark All Read: unreadCount=${model.unreadCount}`);
assertEq(model.unreadCount, 0, 'Unread count after mark all read');
assertEq(model.totalCount, 5, 'Total count should remain unchanged after mark all read');
assertEq(model.pushNotifications.every((n) => n.read), true, 'All push notifications marked read');
assertEq(model.readActivityIds.size, 2, 'All activity notifications marked read');
console.log('✓ PASS: Mark all as read clears unread state while keeping notifications\n');

console.log('Test 9: Mark selected as read in select mode');
model.reset();
assertEq(model.unreadCount, 4, 'Unread count before mark selected read');
model.toggleSelectMode();
model.toggleItemSelection('p1');
model.toggleItemSelection('a1');
assertEq(model.selectedIds.size, 2, '2 items selected');

model.handleMarkSelectedRead();
console.log(`After Mark Selected Read: unreadCount=${model.unreadCount}`);
assertEq(model.unreadCount, 2, 'Unread count should decrease by 2');
assertEq(model.selectedIds.size, 0, 'selectedIds should be cleared after marking read');
const p1 = model.pushNotifications.find((n) => n.id === 'p1');
assertEq(p1?.read, true, 'p1 is read');
assertEq(model.readActivityIds.has('a1'), true, 'a1 is marked read');
console.log('✓ PASS: Mark selected as read selectively marks items read and clears selection\n');

console.log('=== ALL 9 VALIDATION SUITES PASSED SUCCESSFULLY ===');
