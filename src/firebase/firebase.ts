/* src/firebase/firebase.ts */

// 글로벌 Window 객체에 커스텀 속성이 존재할 수 있다고 정식으로 타입(명세서) 확장
declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
  }
}
self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: 'AIzaSyCF8BQ6GWKxJRPWENeNR_vnelH3TaJJan4',
  authDomain: 'owanticheat.firebaseapp.com',
  projectId: 'owanticheat',
  storageBucket: 'owanticheat.firebasestorage.app',
  messagingSenderId: '100898239448',
  appId: '1:100898239448:web:9fab069ba0e816616ef8ad',
};

const app = initializeApp(firebaseConfig);

//initializeAppCheck(app, {
//provider: new ReCaptchaV3Provider("6LdNND4tAAAAAGd66UkZVfYcebdTz2JVBJYSkDto"),
//isTokenAutoRefreshEnabled: true,
//});

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
