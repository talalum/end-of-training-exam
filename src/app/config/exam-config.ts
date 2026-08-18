import { ChecklistItem } from '../models/exam-form.model';

export const PART1_TITLE = 'חלק 1 – החייאה';

export const PART1_CHECKLIST: ChecklistItem[] = [
  { id: 'safety', label: 'בטיחות והתרשמות מהזירה' },
  { id: 'consciousness', label: 'בדיקת הכרה' },
  { id: 'call-for-help', label: 'הזעקת עזרה / חלוקת משימות' },
  { id: 'breathing-pulse', label: 'הערכת נשימה ודופק בהתאם לסכמה' },
  { id: 'compressions', label: 'התחלת עיסויים איכותיים' },
  { id: 'airway', label: 'פתיחה וניהול נתיב אוויר' },
  { id: 'ventilation', label: 'הנשמה נכונה' },
  { id: 'aed', label: 'חיבור ושימוש נכון בדפיברילטור / AED' },
  { id: 'algorithm', label: 'עבודה לפי סכמה מסודרת' },
  { id: 'reassessment', label: 'ביצוע הערכה חוזרת' },
  { id: 'teamwork', label: 'עבודת צוות וחלוקת תפקידים' },
  { id: 'continuity', label: 'שמירה על רצף טיפולי ומזעור הפסקות בעיסויים' },
];

export const PART2_TITLE = 'חלק 2 – מיומנויות טראומה';

export const TRAUMA_SKILLS: ChecklistItem[] = [
  { id: 'cat', label: 'CAT – הנחת חוסם עורקים' },
  { id: 'israeli-bandage', label: 'תחבושת ישראלית' },
  { id: 'packing', label: 'Packing – אריזת פצע' },
  { id: 'personal-dressing', label: 'תחבושת אישית ומשולש לחץ' },
  { id: 'collar', label: 'הנחת צווארון' },
  { id: 'bystanders', label: 'מתן הוראות לעוברי אורח בהצמדת מטופל לקרש גב' },
  { id: 'sam-splint', label: 'קיבוע באמצעות SAM Splint ותחבושת אלסטית' },
  { id: 'triangle-bandage', label: 'קיבוע באמצעות משולש בד' },
  { id: 'tactical-stretcher', label: 'אלונקה טקטית – אינדיקציות ודרך השימוש' },
];

export const SKILL_EVALUATION_CRITERIA: ChecklistItem[] = [
  { id: 'indication', label: 'זיהה נכון את האינדיקציה לביצוע המיומנות' },
  { id: 'equipment', label: 'בחר ציוד מתאים' },
  { id: 'order', label: 'ביצע את הפעולה בסדר הנכון' },
  { id: 'safe', label: 'ביצע את הפעולה בצורה בטוחה' },
  { id: 'effectiveness', label: 'בדק את יעילות הפעולה לאחר הביצוע' },
  { id: 'explain', label: 'ידע להסביר את הפעולה והאינדיקציות' },
];

export const PART3_TITLE = 'חלק 3 – מצבי חירום רפואיים';

export const EMERGENCY_SCENARIOS: ChecklistItem[] = [
  { id: 'chest-pain', label: 'כאבים בחזה' },
  { id: 'hypoglycemia', label: 'היפוגליקמיה' },
  { id: 'low-bp', label: 'לחץ דם נמוך' },
  { id: 'stroke', label: 'אירוע מוחי' },
  { id: 'dyspnea-adult', label: 'קוצר נשימה – מבוגר' },
  { id: 'dyspnea-child', label: 'קוצר נשימה – ילד' },
];

export const EMERGENCY_EVALUATION_CRITERIA: ChecklistItem[] = [
  { id: 'approach', label: 'גישה מסודרת למטופל' },
  { id: 'initial-assessment', label: 'ביצוע הערכה ראשונית' },
  { id: 'main-problem', label: 'זיהוי הבעיה המרכזית' },
  { id: 'history', label: 'לקיחת אנמנזה רלוונטית' },
  { id: 'vitals', label: 'מדדים חיוניים' },
  { id: 'physical-exam', label: 'ביצוע בדיקה גופנית רלוונטית' },
  { id: 'red-flags', label: 'זיהוי סימנים מחשידים / דגלים אדומים' },
  { id: 'decision', label: 'קבלת החלטה טיפולית נכונה' },
  { id: 'treatment', label: 'מתן טיפול בהתאם לסמכויות ולפרוטוקול' },
  { id: 'reassessment', label: 'ביצוע הערכה חוזרת לאחר הטיפול' },
  { id: 'evacuation-decision', label: 'החלטה נכונה לגבי המשך טיפול / צורך בפינוי' },
  { id: 'reporting', label: 'דיווח והעברת מידע בצורה מסודרת' },
  { id: 'confidence', label: 'הפגנת ביטחון ושליטה באירוע' },
];

/**
 * רשימת תפוצה סטטית לשליחת טפסים במייל.
 * ערך placeholder - יש להחליף בכתובות המייל האמיתיות לפני השימוש בפועל.
 */
export const EMAIL_RECIPIENTS: string[] = ['placeholder@example.com'];

/** מספר טלפון קבוע (אופציונלי, בפורמט בינלאומי ללא +) לשיתוף בוואטסאפ. ריק = הנמען נבחר ידנית בתוך וואטסאפ. */
export const WHATSAPP_SHARE_PHONE = '';

export const DRAFTS_VISIBILITY_WINDOW_MS = 24 * 60 * 60 * 1000;
