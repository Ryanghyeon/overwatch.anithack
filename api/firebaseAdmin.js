
let admin;

export async function getAdmin() {
  if (!admin) {
    const firebaseAdmin = await import("firebase-admin");

    // ✅ 각각 분리
    const app = firebaseAdmin.default || firebaseAdmin;

    admin = app;

    if (!admin.apps || admin.apps.length === 0) {
      admin.initializeApp({
        credential: app.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    }
  }

  return admin;
}
