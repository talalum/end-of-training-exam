import { Injectable } from '@angular/core';
import { createBlankExamForm, ExamForm } from '../models/exam-form.model';
import { ExamsRepository } from './exams-repository';

const STORAGE_KEY = 'eote.demo-exam-forms.v1';
const DEMO_VISIBILITY_WINDOW_MS = 60 * 60 * 1000;

/** מימוש דמו: נשמר רק בדפדפן הזה (localStorage), ונעלם אוטומטית שעה לאחר העדכון האחרון. */
@Injectable()
export class DemoStorageService extends ExamsRepository {
  private readAll(): ExamForm[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeAll(forms: ExamForm[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  }

  private isExpired(form: ExamForm, now: number): boolean {
    return now - form.updatedAt > DEMO_VISIBILITY_WINDOW_MS;
  }

  async getById(id: string): Promise<ExamForm | null> {
    const now = Date.now();
    const form = this.readAll().find((f) => f.id === id) ?? null;
    return form && !this.isExpired(form, now) ? form : null;
  }

  async save(form: ExamForm): Promise<void> {
    const forms = this.readAll();
    const index = forms.findIndex((f) => f.id === form.id);
    if (index >= 0) {
      forms[index] = form;
    } else {
      forms.push(form);
    }
    this.writeAll(forms);
  }

  async remove(id: string): Promise<void> {
    this.writeAll(this.readAll().filter((f) => f.id !== id));
  }

  /** טפסי דמו מהשעה האחרונה, מהחדש לישן; טפסים ישנים יותר נמחקים בפועל. */
  async getAll(): Promise<ExamForm[]> {
    const now = Date.now();
    const forms = this.readAll().filter((f) => !this.isExpired(f, now));
    this.writeAll(forms);
    return forms.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  createBlank(): ExamForm {
    return createBlankExamForm();
  }
}
