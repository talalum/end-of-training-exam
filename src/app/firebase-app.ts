import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from './config/firebase-config';

const firebaseApp = initializeApp(FIREBASE_CONFIG);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
