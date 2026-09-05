import { InjectionToken } from '@angular/core';

/** true באזור הדמו (localStorage, ללא התחברות) - משמש להצגת אזהרה מתאימה בעמודים. */
export const DEMO_MODE = new InjectionToken<boolean>('DEMO_MODE', {
  providedIn: 'root',
  factory: () => false,
});

/** קידומת הנתיב לניווט - '' באזור האמיתי, '/demo' באזור הדמו. */
export const ROUTE_BASE = new InjectionToken<string>('ROUTE_BASE', {
  providedIn: 'root',
  factory: () => '',
});
