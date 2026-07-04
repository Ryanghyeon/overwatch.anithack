import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.firebase_discord);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
