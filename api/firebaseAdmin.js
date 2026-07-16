/* api/firebaseAdmin.js */

// ESLint 에러 방지용: 서버 환경(Node.js) 변수인 process를 쓰기 위해 강제 선언
/* global process */

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let app;

export function getAdminAuth() {
  if (!app) {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }

  return getAuth(app);
}
