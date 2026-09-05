import { Injectable } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../firebase-app';
import { createBlankExamForm, ExamForm } from '../models/exam-form.model';
import { ExamsRepository } from './exams-repository';

const COLLECTION = 'exams';

@Injectable({ providedIn: 'root' })
export class StorageService extends ExamsRepository {
  async getById(id: string): Promise<ExamForm | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    return snap.exists() ? (snap.data() as ExamForm) : null;
  }

  async save(form: ExamForm): Promise<void> {
    await setDoc(doc(db, COLLECTION, form.id), form);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }

  /** כל הטפסים, מהעודכן לאחרונה לישן ביותר. */
  async getAll(): Promise<ExamForm[]> {
    const q = query(collection(db, COLLECTION), orderBy('updatedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as ExamForm);
  }

  createBlank(): ExamForm {
    return createBlankExamForm();
  }
}
