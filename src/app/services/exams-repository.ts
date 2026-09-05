import { ExamForm } from '../models/exam-form.model';

/**
 * טוקן ה-DI המשותף לגישה לרשימת המבחנים. יש שתי מימושים: StorageService (Firestore, לשימוש האמיתי)
 * ו-DemoStorageService (localStorage, לאזור הדמו) - כל route-tree מזריק את המימוש המתאים לו.
 */
export abstract class ExamsRepository {
  abstract getById(id: string): Promise<ExamForm | null>;
  abstract save(form: ExamForm): Promise<void>;
  abstract remove(id: string): Promise<void>;
  abstract getAll(): Promise<ExamForm[]>;
  abstract createBlank(): ExamForm;
}
