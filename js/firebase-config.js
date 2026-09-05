// ─────────────────────────────────────────────────────────────
// js/firebase-config.js — ตั้งค่าการเชื่อมต่อ Firebase (โปรเจกต์ leaveeasy-songchai)
// ใช้ Firebase compat SDK (script ธรรมดา ไม่ใช่ module) เพื่อให้ดับเบิลคลิกเปิดไฟล์ได้ตรงๆ
// ต้องโหลดหลัง firebase-app-compat.js, firebase-firestore-compat.js, firebase-auth-compat.js
// ตัวแปร db, auth, รอสถานะล็อกอิน ที่ประกาศที่นี่เป็น global ให้ไฟล์อื่นเรียกใช้ได้เลย
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

// สัญญาที่คืนค่า (resolve) ครั้งเดียว ทันทีที่ Firebase เช็คสถานะล็อกอินเสร็จ
// (user object ถ้าล็อกอินอยู่ หรือ null ถ้าไม่ได้ล็อกอิน) — ทุกหน้าที่จะอ่าน/เขียน Firestore
// ต้อง await ตัวนี้ก่อนเสมอ กันไม่ให้ยิง request ไปก่อนที่ auth จะพร้อม
var รอสถานะล็อกอิน = new Promise(function (resolve) {
  var เลิกฟัง = auth.onAuthStateChanged(function (ผู้ใช้) {
    เลิกฟัง();
    resolve(ผู้ใช้);
  });
});

// สัญญาที่คืนค่า role ("employee"/"manager"/"hr") ของคนที่ล็อกอินอยู่ (หรือ null ถ้าไม่ได้ล็อกอิน)
// อ่านจากเอกสาร users/<uid> — รอต่อจาก รอสถานะล็อกอิน โดยอัตโนมัติ
var รอบทบาทผู้ใช้ = รอสถานะล็อกอิน.then(function (ผู้ใช้) {
  if (!ผู้ใช้) return null;
  return db.collection("users").doc(ผู้ใช้.uid).get().then(function (เอกสาร) {
    return เอกสาร.exists ? เอกสาร.data().role : null;
  });
});
