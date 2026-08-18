import { Injectable } from '@angular/core';
import { ExamForm } from '../models/exam-form.model';
import { DRAFTS_VISIBILITY_WINDOW_MS } from '../config/exam-config';

const STORAGE_KEY = 'eote.exam-forms.v1';

@Injectable({ providedIn: 'root' })
export class StorageService {
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

  getById(id: string): ExamForm | null {
    return this.readAll().find((f) => f.id === id) ?? null;
  }

  save(form: ExamForm): void {
    const forms = this.readAll();
    const index = forms.findIndex((f) => f.id === form.id);
    if (index >= 0) {
      forms[index] = form;
    } else {
      forms.push(form);
    }
    this.writeAll(forms);
  }

  remove(id: string): void {
    this.writeAll(this.readAll().filter((f) => f.id !== id));
  }

  /** טפסים/טיוטות שעודכנו ב-24 השעות האחרונות, מהחדש לישן. */
  getRecent(now: number = Date.now()): ExamForm[] {
    return this.readAll()
      .filter((f) => now - f.updatedAt <= DRAFTS_VISIBILITY_WINDOW_MS)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  createBlank(): ExamForm {
    const now = Date.now();
    return {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'draft',
      examineeName: '',
      examinerName: '',
      examDate: new Date().toISOString().slice(0, 10),
      part1: { checklist: {}, notes: '', result: null },
      part2: {
        skills: [
          { skillId: null, evaluation: {}, notes: '' },
          { skillId: null, evaluation: {}, notes: '' },
        ],
        notes: '',
        result: null,
      },
      part3: { scenarioId: null, checklist: {}, notes: '' },
    };
  }
}
