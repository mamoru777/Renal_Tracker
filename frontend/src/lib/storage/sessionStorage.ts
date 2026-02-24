import { type Storage } from './types';

export class SessionStorage implements Storage {
  private storage = sessionStorage;

  public add(key: string, value: string) {
    this.storage.setItem(key, String(value));
  }

  public get(key: string): string | null {
    return this.storage.getItem(key);
  }

  public remove(key: string): void {
    this.storage.removeItem(key);
  }

  public has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  public clear(): void {
    this.storage.clear();
  }

  public getAllKeys(): string[] {
    return Object.keys(this.storage);
  }
}
