// ─────────────────────────────────────────────────────────────
// js/signup.js — หน้าสมัครสมาชิก
// สัปดาห์ที่ 7: สมัครด้วย Firebase Authentication แล้วสร้างไฟล์ใน users/<uid>
// ─────────────────────────────────────────────────────────────

(function () {
  var ฟอร์ม = document.getElementById("ฟอร์มสมัคร");
  var กล่องเตือน = document.getElementById("ข้อความเตือน");
  var ปุ่มสมัคร = document.getElementById("ปุ่มสมัคร");

  ฟอร์ม.addEventListener("submit", function (e) {
    e.preventDefault();

    var ชื่อ = document.getElementById("name").value.trim();
    var อีเมล = document.getElementById("email").value.trim();
    var รหัสผ่าน = document.getElementById("password").value;

    if (!ชื่อ || !อีเมล || !รหัสผ่าน) {
      เตือน("กรอกไม่ครบ — ต้องกรอกทุกช่องก่อนกดสมัครสมาชิก");
      return;
    }

    ปุ่มสมัคร.disabled = true;
    auth.createUserWithEmailAndPassword(อีเมล, รหัสผ่าน)
      .then(function (ผลลัพธ์) {
        return db.collection("users").doc(ผลลัพธ์.user.uid).set({
          name: ชื่อ,
          email: อีเมล,
          role: "employee"
        });
      })
      .then(function () {
        location.href = "leave-requests.html";
      })
      .catch(function (err) {
        เตือน("สมัครไม่สำเร็จ (" + err.message + ")");
        ปุ่มสมัคร.disabled = false;
      });
  });

  function เตือน(ข้อความ) {
    กล่องเตือน.textContent = "⚠️ " + ข้อความ;
    กล่องเตือน.classList.remove("hidden");
  }
})();
