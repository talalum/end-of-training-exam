/**
 * הגדרות Firebase - קובץ לדוגמה, נשמר ב-git.
 *
 * להרצה מקומית: להעתיק את הקובץ הזה ל-`firebase-config.ts` (באותה תיקייה) ולהחליף את הערכים למטה
 * באובייקט ה-config האמיתי מתוך Project settings > General > Your apps בקונסולת Firebase.
 * `firebase-config.ts` נמצא ב-.gitignore ולא יישמר ב-git - כך שהערכים האמיתיים לא מגיעים להיסטוריית
 * הריפו (שהיא ציבורית).
 *
 * לפריסה (deploy) דרך GitHub Actions: אין צורך ליצור את הקובץ ידנית - ה-workflow
 * (`.github/workflows/deploy.yml`) יוצר אותו אוטומטית בזמן הבנייה מתוך GitHub Actions secrets.
 * יש להגדיר את ה-secrets האלה תחת Settings > Secrets and variables > Actions בריפו:
 * FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET,
 * FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID.
 */
export const FIREBASE_CONFIG = {
  apiKey: 'placeholder-api-key',
  authDomain: 'placeholder-project.firebaseapp.com',
  projectId: 'placeholder-project',
  storageBucket: 'placeholder-project.appspot.com',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:0000000000000000000000',
};
