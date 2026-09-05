// ─────────────────────────────────────────────────────────────
// js/login.js — หน้าเข้าสู่ระบบ
// สัปดาห์ที่ 7: ล็อกอินด้วย Firebase Authentication (อีเมล/รหัสผ่าน)
// ─────────────────────────────────────────────────────────────

(function () {
  var ฟอร์ม = document.getElementById("ฟอร์มล็อกอิน");
  var กล่องเตือน = document.getElementById("ข้อความเตือน");
  var ปุ่มล็อกอิน = document.getElementById("ปุ่มล็อกอิน");

  ฟอร์ม.addEventListener("submit", function (e) {
    e.preventDefault();

    var อีเมล = document.getElementById("email").value.trim();
    var รหัสผ่าน = document.getElementById("password").value;

    if (!อีเมล || !รหัสผ่าน) {
      เตือน("กรอกไม่ครบ — ต้องกรอกอีเมลและรหัสผ่านก่อนกดเข้าสู่ระบบ");
      return;
    }

    ปุ่มล็อกอิน.disabled = true;
    auth.signInWithEmailAndPassword(อีเมล, รหัสผ่าน)
      .then(function () {
        location.href = "leave-requests.html";
      })
      .catch(function (err) {
        เตือน("เข้าสู่ระบบไม่สำเร็จ (" + err.message + ")");
        ปุ่มล็อกอิน.disabled = false;
      });
  });

  function เตือน(ข้อความ) {
    กล่องเตือน.textContent = "⚠️ " + ข้อความ;
    กล่องเตือน.classList.remove("hidden");
  }
})();
