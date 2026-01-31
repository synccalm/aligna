/* File : storage.ts
 * Description : Helper for AsyncStorage operations
 * Author : SyncCalm
 * Version : v1.0
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CUSTOM_AFFIRMATIONS_KEY = 'CUSTOM_AFFIRMATIONS';
const WISHLIST_KEY = 'WISHLIST_ITEMS';
const EXPENSE_KEY = 'EXPENSE_ITEMS';
const INCOME_KEY = 'INCOME_ITEMS';
const DAILY_TASK_KEY = 'DAILY_TASK_ITEMS';
const SLEEP_SETTINGS_KEY = 'SLEEP_SETTINGS';
const JOURNAL_KEY = 'JOURNAL_ENTRIES';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdDate: string; // MM/DD/YYYY
  createdTime: string; // HH:MM AM/PM
  timestamp: number; // for sorting
}

export interface DailyTask {
  id: string;
  title: string;
  isCompleted: boolean;
  date: string; // "YYYY-MM-DD"
  createdAt: number;
}

export interface SleepSettings {
  reminderEnabled: boolean;
  reminderTime: string;
  nightModeEnabled: boolean;
}

export interface CustomAffirmation {
  id: string;
  title: string;
  lines: string[];
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  createdAt: number;
  deadline?: number;          // timestamp for date
  deadlineTime?: string;      // HH:mm for time
  reminderEnabled: boolean;
  reminderTime?: string;      // HH:mm
  alarmId?: string;
  status: 'in_progress' | 'completed';
}

export interface ChildTask {
  id: string;
  wishlistId: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount?: number; // Optional amount for tracker
  isCompleted: boolean;
  month: string; // e.g. "January 2024"
  createdAt: number;
}

export interface IncomeItem {
  month: string; // e.g. "January 2024"
  amount: number;
  createdAt: number;
}

export interface AuthSettings {
  hasAuthSetup: boolean;
  pinHash: string | null;
  biometricEnabled: boolean;
  authType: 'pin' | 'biometric' | 'none';
}

export const StorageHelper = {
  /**
   * Save a new custom affirmation to AsyncStorage
   * @param affirmation The new affirmation object to save
   */
  saveCustomAffirmation: async (affirmation: CustomAffirmation): Promise<CustomAffirmation[]> => {
    try {
      const existing = await StorageHelper.getCustomAffirmations();
      const updated = [...existing, affirmation];
      await AsyncStorage.setItem(CUSTOM_AFFIRMATIONS_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error saving custom affirmation:', error);
      return [];
    }
  },

  /**
   * Retrieve all custom affirmations from AsyncStorage
   */
  getCustomAffirmations: async (): Promise<CustomAffirmation[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(CUSTOM_AFFIRMATIONS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error reading custom affirmations:', error);
      return [];
    }
  },

  /*
   * Delete a custom affirmation by ID
   * @param id The ID of the affirmation to delete
   */
  deleteCustomAffirmation: async (id: string): Promise<CustomAffirmation[]> => {
    try {
      const existing = await StorageHelper.getCustomAffirmations();
      const updated = existing.filter(item => item.id !== id);
      await AsyncStorage.setItem(CUSTOM_AFFIRMATIONS_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error deleting custom affirmation:', error);
      return [];
    }
  },

  /**
   * Clear all custom affirmations (useful for testing/debugging)
   */
  clearCustomAffirmations: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(CUSTOM_AFFIRMATIONS_KEY);
    } catch (error) {
      console.error('Error clearing custom affirmations:', error);
    }
  },

  /**
   * Save a new wishlist item
   */
  saveWishlist: async (item: WishlistItem): Promise<WishlistItem[]> => {
    try {
      const existing = await StorageHelper.getWishlist();
      const updated = [...existing, item];
      await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error saving wishlist item:', error);
      return [];
    }
  },

  /**
   * Get all wishlist items
   */
  getWishlist: async (): Promise<WishlistItem[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(WISHLIST_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error reading wishlist:', error);
      return [];
    }
  },

  /**
   * Delete a wishlist item by ID
   */
  deleteWishlist: async (id: string): Promise<WishlistItem[]> => {
    try {
      const existing = await StorageHelper.getWishlist();
      const updated = existing.filter(item => item.id !== id);
      await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      return [];
    }
  },

  /**
   * Update the status of a wishlist item
   */
  updateWishlistStatus: async (id: string, status: 'in_progress' | 'completed'): Promise<WishlistItem[]> => {
    try {
      const existing = await StorageHelper.getWishlist();
      const updated = existing.map(item =>
        item.id === id ? { ...item, status } : item
      );
      await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error updating wishlist status:', error);
      return [];
    }
  },

  /**
   * Update an entire wishlist item
   */
  updateWishlist: async (item: WishlistItem): Promise<WishlistItem[]> => {
    try {
      const existing = await StorageHelper.getWishlist();
      const updated = existing.map(i =>
        i.id === item.id ? item : i
      );
      await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      return [];
    }
  },

  /**
   * Update the reminder status
   */
  updateWishlistReminder: async (id: string, enabled: boolean): Promise<WishlistItem[]> => {
    try {
      const existing = await StorageHelper.getWishlist();
      const updated = existing.map(item =>
        item.id === id ? { ...item, reminderEnabled: enabled, alarmId: enabled ? item.alarmId : undefined } : item
      );
      await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error updating wishlist reminder:', error);
      return [];
    }
  },

  /**
   * Save a new expense item
   */
  saveExpense: async (item: ExpenseItem): Promise<ExpenseItem[]> => {
    try {
      const existing = await StorageHelper.getExpenses();
      const updated = [...existing, item];
      await AsyncStorage.setItem(EXPENSE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error saving expense item:', error);
      return [];
    }
  },

  /**
   * Get all expense items
   */
  getExpenses: async (): Promise<ExpenseItem[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(EXPENSE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error reading expenses:', error);
      return [];
    }
  },

  /**
   * Update expense status
   */
  updateExpenseStatus: async (id: string, isCompleted: boolean): Promise<ExpenseItem[]> => {
    try {
      const existing = await StorageHelper.getExpenses();
      const updated = existing.map(item =>
        item.id === id ? { ...item, isCompleted } : item
      );
      await AsyncStorage.setItem(EXPENSE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error updating expense status:', error);
      return [];
    }
  },

  /**
   * Delete an expense item
   */
  deleteExpense: async (id: string): Promise<ExpenseItem[]> => {
    try {
      const existing = await StorageHelper.getExpenses();
      const updated = existing.filter(item => item.id !== id);
      await AsyncStorage.setItem(EXPENSE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error deleting expense item:', error);
      return [];
    }
  },

  /**
   * Save income for a specific month.
   * If income for that month exists, it updates it.
   */
  saveIncome: async (month: string, amount: number): Promise<IncomeItem[]> => {
    try {
      const existing = await StorageHelper.getIncomes();
      // Check if income for this month already exists
      const index = existing.findIndex(item => item.month === month);

      let updated: IncomeItem[];

      if (index !== -1) {
        // Update existing
        updated = [...existing];
        updated[index] = { ...updated[index], amount, createdAt: Date.now() };
      } else {
        // Add new
        const newItem: IncomeItem = {
          month,
          amount,
          createdAt: Date.now()
        };
        updated = [...existing, newItem];
      }

      await AsyncStorage.setItem(INCOME_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error saving income:', error);
      return [];
    }
  },

  /**
   * Get all income items
   */
  getIncomes: async (): Promise<IncomeItem[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(INCOME_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error reading incomes:', error);
      return [];
    }
  },

  /**
   * Get income for a specific month
   */
  getIncomeByMonth: async (month: string): Promise<number | null> => {
    try {
      const incomes = await StorageHelper.getIncomes();
      const item = incomes.find(i => i.month === month);
      return item ? item.amount : null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Save a new daily task
   */
  saveDailyTask: async (task: DailyTask): Promise<DailyTask[]> => {
    try {
      const existing = await StorageHelper.getDailyTasks();
      const updated = [...existing, task];
      await AsyncStorage.setItem(DAILY_TASK_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error saving daily task:', error);
      return [];
    }
  },

  /**
   * Get all daily tasks
   */
  getDailyTasks: async (): Promise<DailyTask[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(DAILY_TASK_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error reading daily tasks:', error);
      return [];
    }
  },

  /**
   * Update daily task status
   */
  updateDailyTaskStatus: async (id: string, isCompleted: boolean): Promise<DailyTask[]> => {
    try {
      const existing = await StorageHelper.getDailyTasks();
      const updated = existing.map(item =>
        item.id === id ? { ...item, isCompleted } : item
      );
      await AsyncStorage.setItem(DAILY_TASK_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error updating daily task status:', error);
      return [];
    }
  },

  /**
   * Delete a daily task
   */
  deleteDailyTask: async (id: string): Promise<DailyTask[]> => {
    try {
      const existing = await StorageHelper.getDailyTasks();
      const updated = existing.filter(item => item.id !== id);
      await AsyncStorage.setItem(DAILY_TASK_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error deleting daily task:', error);
      return [];
    }
  },

  /**
   * Save sleep settings
   */
  saveSleepSettings: async (settings: SleepSettings): Promise<SleepSettings | null> => {
    try {
      await AsyncStorage.setItem(SLEEP_SETTINGS_KEY, JSON.stringify(settings));
      return settings;
    } catch (error) {
      console.error('Error saving sleep settings:', error);
      return null;
    }
  },

  /**
   * Get sleep settings
   */
  getSleepSettings: async (): Promise<SleepSettings> => {
    try {
      const jsonValue = await AsyncStorage.getItem(SLEEP_SETTINGS_KEY);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      // Default settings
      return {
        reminderEnabled: false,
        reminderTime: '22:00',
        nightModeEnabled: false
      };
    } catch (error) {
      console.error('Error reading sleep settings:', error);
      return { reminderEnabled: false, reminderTime: '22:00', nightModeEnabled: false };
    }
  },

  /**
   * Auth Settings Persistence
   */
  saveAuthSettings: async (settings: AuthSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem('AUTH_SETTINGS', JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving auth settings", error);
    }
  },

  getAuthSettings: async (): Promise<AuthSettings> => {
    try {
      const jsonValue = await AsyncStorage.getItem('AUTH_SETTINGS');
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      return { hasAuthSetup: false, pinHash: null, biometricEnabled: false, authType: 'none' };
    } catch (error) {
      console.error("Error getting auth settings", error);
      return { hasAuthSetup: false, pinHash: null, biometricEnabled: false, authType: 'none' };
    }
  },

  /**
   * JOURNAL STORAGE METHODS
   */

  /**
   * Save a new journal entry
   */
  saveJournal: async (entry: JournalEntry): Promise<JournalEntry[]> => {
    try {
      const existing = await StorageHelper.getJournals();
      const updated = [entry, ...existing]; // Add new entry to the top
      await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error saving journal:', error);
      return [];
    }
  },

  /**
   * Get all journal entries
   */
  getJournals: async (): Promise<JournalEntry[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(JOURNAL_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error reading journals:', error);
      return [];
    }
  },

  /**
   * Delete a journal entry
   */
  deleteJournal: async (id: string): Promise<JournalEntry[]> => {
    try {
      const existing = await StorageHelper.getJournals();
      const updated = existing.filter(item => item.id !== id);
      await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error deleting journal:', error);
      return [];
    }
  },

  /**
   * CHILD TASKS STORAGE METHODS
   */

  saveChildTask: async (task: ChildTask): Promise<ChildTask[]> => {
    try {
      const existing = await StorageHelper.getChildTasks(task.wishlistId);
      const updated = [...existing, task];
      await AsyncStorage.setItem(`CHILD_TASKS_${task.wishlistId}`, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error saving child task:', error);
      return [];
    }
  },

  getChildTasks: async (wishlistId: string): Promise<ChildTask[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(`CHILD_TASKS_${wishlistId}`);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error getting child tasks:', error);
      return [];
    }
  },

  updateChildTask: async (task: ChildTask): Promise<ChildTask[]> => {
    try {
      const existing = await StorageHelper.getChildTasks(task.wishlistId);
      const updated = existing.map(t => t.id === task.id ? task : t);
      await AsyncStorage.setItem(`CHILD_TASKS_${task.wishlistId}`, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error updating child task:', error);
      return [];
    }
  },

  deleteChildTask: async (id: string, wishlistId: string): Promise<ChildTask[]> => {
    try {
      const existing = await StorageHelper.getChildTasks(wishlistId);
      const updated = existing.filter(t => t.id !== id);
      await AsyncStorage.setItem(`CHILD_TASKS_${wishlistId}`, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error deleting child task:', error);
      return [];
    }
  }

};
