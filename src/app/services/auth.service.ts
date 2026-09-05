import { Injectable, signal } from '@angular/core';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase-app';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** null = לא מחובר, undefined = מצב ההתחברות עדיין נטען */
  readonly user = signal<User | null | undefined>(undefined);

  constructor() {
    onAuthStateChanged(auth, (user) => this.user.set(user));
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }
}
