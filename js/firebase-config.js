// ─────────────────────────────────────────────────────────────
// js/firebase-config.js — ตั้งค่าการเชื่อมต่อ Firebase (โปรเจกต์ leaveeasy-songchai)
// ใช้ Firebase compat SDK (script ธรรมดา ไม่ใช่ module) เพื่อให้ดับเบิลคลิกเปิดไฟล์ได้ตรงๆ
// ต้องโหลดหลัง firebase-app-compat.js, firebase-firestore-compat.js, firebase-auth-compat.js
// ตัวแปร db, auth ที่ประกาศที่นี่เป็น global ให้ไฟล์อื่นเรียกใช้ได้เลย
// ─────────────────────────────────────────────────────────────

var firebaseConfig = {
  apiKey: "AIzaSyD76Eh461zxjZPHshAoJdtUn5Af7joqfjw",
  authDomain: "leaveeasy-songchai.firebaseapp.com",
  projectId: "leaveeasy-songchai",
  storageBucket: "leaveeasy-songchai.firebasestorage.app",
  messagingSenderId: "878170972232",
  appId: "1:878170972232:web:c49a9b8749bd60fdee387d",
  measurementId: "G-G9TEJ2SZ34"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var auth = firebase.auth();
