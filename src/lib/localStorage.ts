// Local storage service for admin content management
// This replaces Supabase calls for local testing

export class LocalStorageService {
  private static prefix = 'admin_';

  static get<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return [];
    }
  }

  static set<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage:`, e);
    }
  }

  static add<T extends { id?: string }>(key: string, item: T): T {
    const items = this.get<T>(key);
    const newItem = {
      ...item,
      id: item.id || this.generateId(),
      created_at: item.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    items.push(newItem);
    this.set(key, items);
    return newItem;
  }

  static update<T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | null {
    const items = this.get<T>(key);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.set(key, items);
    return items[index];
  }

  static delete(key: string, id: string): boolean {
    const items = this.get<any>(key);
    const filtered = items.filter((item: any) => item.id !== id);
    this.set(key, filtered);
    return filtered.length < items.length;
  }

  static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

