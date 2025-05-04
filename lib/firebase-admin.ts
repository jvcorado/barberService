// lib/firebase-admin.ts
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import json from "../lib/reserva.json";

if (!getApps().length) {
  initializeApp({
    credential: cert(json as any),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = getStorage().bucket();

export { bucket };
