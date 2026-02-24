export interface AppLogger {
  info(s: string): void;
  info(...s: string[]): void;
  debug(s: string): void;
  debug(...s: string[]): void;
  warn(s: string): void;
  warn(...s: string[]): void;
  error(s: string): void;
  error(...s: string[]): void;
}
