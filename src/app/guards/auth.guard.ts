import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-app';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user ? true : router.createUrlTree(['/login']));
    });
  });
};
