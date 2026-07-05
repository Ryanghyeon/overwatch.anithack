import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let app;

export function getAdminAuth() {
  if (!app) {
    const config = JSON.parse(process.env.firebase_discord);

    app = initializeApp({
      credential: cert({
        projectId: config.project_id,
        clientEmail: config.client_email,
        privateKey: config.private_key.replace(/\\n/g, "\n"),
      }),
    });
  }

  return getAuth(app);
}
