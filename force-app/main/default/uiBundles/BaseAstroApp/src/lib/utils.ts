import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// The UI Bundle runtime mounts the app under a dynamic path and exposes it on
// `globalThis.SFDC_ENV.basePath`. Use this anywhere you need to build in-app
// links that should survive being served under that mount.
export function getBasePath(): string {
  const raw = globalThis.SFDC_ENV?.basePath;
  return typeof raw === 'string' ? raw.replace(/\/+$/, '') : '';
}

export function withBase(path: string): string {
  const base = getBasePath();
  if (!path.startsWith('/')) path = '/' + path;
  return base + path;
}
