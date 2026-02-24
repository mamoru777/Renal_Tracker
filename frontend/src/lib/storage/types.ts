export interface Storage {
  add(key: string, value: string): void;
  get(key: string): string | null;
  remove(key: string): void;
  has(key: string): boolean;
  clear(): void;
  getAllKeys(): string[];
}
