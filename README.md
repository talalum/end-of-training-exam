# צ'ק ליסט לבוחן – מבחן מסכם בסיום השתלמות

אפליקציית Angular 19 סטטית (ללא שרת) למילוי טופס הערכה לבוחן במבחן מסכם לחובשים. רשימת הטפסים נשמרת
במסד נתונים משותף (Firestore, ענן Firebase) וזמינה מכל מכשיר מחובר. הגישה מוגנת בהתחברות (Firebase
Authentication). ניתן לשלוח את הטופס במייל (מייל אמיתי דרך לקוח המייל של המכשיר, `mailto:`) או לשתף
בוואטסאפ.

## הרצה מקומית

```bash
npm install
npm start
```
פותח בכתובת `http://localhost:4200/`.

## הגדרה חשובה לפני שימוש בפועל

### 1. הגדרת פרויקט Firebase

> תפריט קונסולת Firebase משתנה מדי פעם, כך שהשמות המדויקים למטה עשויים לזוז מעט. אם תפריט מסוים לא
> נמצא במיקום המתואר, אפשר להשתמש בשורת החיפוש שבראש הקונסולה (מקש `/`) ולחפש את שם המסך (למשל
> "Firestore" או "Authentication").

1. יש להיכנס ל-[קונסולת Firebase](https://console.firebase.google.com/) ולפתוח את הפרויקט (או ליצור
   פרויקט חדש וחינמי בתוכנית Spark דרך **Add project**, אם עוד אין פרויקט).
2. בתפריט הצד, תחת **Databases & Storage**, ללחוץ על **Firestore** → **Create database** → לבחור מיקום
   (location) → לבחור מצב אבטחה התחלתי (**Production mode** מומלץ; ניתן גם **Test mode** ולעדכן כללים
   מיד לאחר מכן, כמו בשלב הבא) → **Create**.
3. באותו מסך של Firestore, בטאב **Rules**, להעתיק את התוכן של הקובץ [`firestore.rules`](firestore.rules)
   מהריפו הזה ולפרסם (**Publish**).
4. בתפריט הצד, תחת **Security**, ללחוץ על **Authentication** → (בפעם הראשונה) **Get started** → טאב
   **Sign-in method** → להפעיל את ה-provider **Email/Password** → **Save**.
5. עדיין ב-Authentication, בטאב **Users**, ללחוץ על **Add user** ולהוסיף ידנית אימייל+סיסמה לכל בוחנת/בוחן
   שצריך גישה (אין הרשמה עצמית באפליקציה). **חשוב:** להעתיק את ה-**User UID** שמופיע לצד כל משתמש שנוצר.
6. חזרה במסך **Firestore → Data**, ליצור ידנית קולקציה בשם `authorizedUsers`, ובתוכה מסמך (document) אחד
   לכל משתמש/ת שנוצר/ה בשלב הקודם — כאשר ה-**Document ID** של כל מסמך הוא ה-UID שהועתק (תוכן המסמך יכול
   להישאר ריק, למשל שדה בודד כמו `name: "..."`). ה-`firestore.rules` שהודבקו קודם דורשים ש-UID של המשתמש
   המחובר יופיע בקולקציה הזו כתנאי לגישה לנתונים — כך גם אם מישהו ירשם עצמאית מול ה-API הציבורי של
   Firebase (אפשרי טכנית כל עוד ה-apiKey חשוף, למשל בריפו ציבורי), הוא עדיין לא יוכל לקרוא/לכתוב נתוני
   מבחנים בלי שה-UID שלו הוזן ידנית כאן.
7. מעמוד הסקירה הכללית של הפרויקט (Project Overview), ללחוץ על סמל ה-Web (`</>`) כדי לרשום אפליקציית web
   חדשה (או **Add app** אם כבר יש אפליקציות רשומות) → לתת שם (Nickname) → **Register app**. הקונסולה
   תציג את אובייקט ה-config (`apiKey`, `authDomain` וכו') — זה מה שצריך להעתיק לשלב הבא.
   ניתן למצוא את אותו אובייקט גם מאוחר יותר דרך **Project settings** (סמל גלגל השיניים) → **General** →
   **Your apps**.
8. אם האפליקציה תפורסם ב-GitHub Pages: באותו מסך Authentication, תחת טאב **Settings** →
   **Authorized domains**, יש להוסיף את הדומיין של ה-Pages (למשל `<username>.github.io`) — אחרת
   ההתחברות תיכשל משם.

### 2. חיבור הקונפיגורציה לאפליקציה

הקובץ `src/app/config/firebase-config.ts` מכיל את הערכים האמיתיים ונמצא ב-`.gitignore` (לא נשמר ב-git),
כדי שמפתח ה-`apiKey` לא יהיה חלק מהיסטוריית הריפו הציבורי. הריפו כולל במקום זאת קובץ לדוגמה,
`firebase-config.example.ts`, שכן נשמר ב-git.

**להרצה מקומית:**

1. להעתיק את `src/app/config/firebase-config.example.ts` לקובץ חדש `src/app/config/firebase-config.ts`
   (באותה תיקייה).
2. לערוך את הקובץ החדש ולהחליף את ה-placeholder באובייקט ה-config האמיתי שהועתק בשלב הקודם.

**לפריסה (deploy) דרך GitHub Actions:**

ה-workflow (`.github/workflows/deploy.yml`) יוצר את הקובץ אוטומטית בזמן הבנייה, מתוך secrets של הריפו.
יש להגדיר אותם פעם אחת תחת **Settings → Secrets and variables → Actions → New repository secret**,
בשמות הבאים (התואמים לשדות ב-config):

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

> **הערה:** כפי שצוין למעלה, ה-`apiKey` של Firebase מיועד מלכתחילה להיות גלוי בצד הלקוח — הוא תמיד
> ייחשף בתוך קובצי ה-JS הבנויים של האתר החי, בלי קשר לאיפה הוא נשמר לפני הבנייה. השמירה שלו כ-secret
> ולא כקובץ ב-git היא בעיקר לניקיון (למשל, כדי לא להפעיל התראות סריקת-סודות של GitHub) ולא הגנה
> אמיתית נוספת על הנתונים — ההגנה האמיתית היא כללי ה-Firestore וקולקציית ה-`authorizedUsers`.

### 3. הגדרות תוכן (לא קשור ל-Firebase)

יש לערוך את `src/app/config/exam-config.ts` ולעדכן:

- `EMAIL_RECIPIENTS` — כרגע ערך placeholder (`placeholder@example.com`). יש להחליף ברשימת כתובות המייל
  האמיתית לשליחת הטפסים.
- `WHATSAPP_SHARE_PHONE` — אופציונלי. ריק כברירת מחדל, כך שהנמען בוואטסאפ נבחר ידנית בתוך האפליקציה.

## בנייה לפרודקשן

```bash
npm run build
```
תוצרי הבנייה יופיעו בתיקייה `dist/end-of-training-exam/browser`.

## פריסה (Deploy) ל-GitHub Pages

הריפו כולל workflow מוכן ב-`.github/workflows/deploy.yml` שבונה ומפרסם אוטומטית בכל push ל-`main`/`master`.

כדי להפעיל את זה בפעם הראשונה:

1. **Settings → Pages** בריפו ב-GitHub.
2. תחת **Source**, לבחור **GitHub Actions**.
3. לבצע push לענף `main`/`master` — ה-workflow ירוץ אוטומטית ויפרסם את האתר.

כתובת האתר תהיה בפורמט `https://<username>.github.io/<repo-name>/`.

### הערה על ניתובים (routing)

מכיוון ש-GitHub Pages הוא אחסון סטטי בלבד, ה-workflow מעתיק את `index.html` גם ל-`404.html` כדי שרענון דף
בתוך נתיב כמו `/form/<id>` לא יחזיר שגיאת 404.

## מגבלות ידועות

- **שליחה במייל** פותחת את תוכנת המייל המוגדרת במכשיר עם תוכן מוכן — יש לוודא בפועל שהמייל נשלח. בטפסים
  ארוכים חלק מתוכנות המייל עלולות לקצר את גוף ההודעה; לשם כך קיים כפתור "העתקת טקסט מלא" כגיבוי.
- **שיתוף בוואטסאפ** תומך בטקסט בלבד (ללא קבצים מצורפים), והנמען נבחר בתוך וואטסאפ.
