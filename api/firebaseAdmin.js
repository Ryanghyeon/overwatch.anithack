
let admin;

export async function getAdmin() {
  if (!admin) {
    const firebaseAdmin = await import("firebase-admin");

    admin = firebaseAdmin.default;

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    }
  }

  return admin;
}
