// ─────────────────────────────────────────────────────────────
// js/leave-types.js — หน้าที่ 4 จัดการประเภทการลา
// สัปดาห์ที่ 8: ทุกคนดูตารางได้ · เพิ่ม/แก้ไข/ลบ เฉพาะฝ่ายบุคคล (hr) · ยังอยู่ในหน่วยความจำเท่านั้น
// ─────────────────────────────────────────────────────────────

(async function () {
  var ผู้ใช้ = await รอสถานะล็อกอิน;
  if (!ผู้ใช้) return;   // ยังไม่ล็อกอิน — nav.js จะเด้งไปหน้า login ให้เอง
  var role = await รอบทบาทผู้ใช้;
  var แก้ไขได้ = role === "hr";

  var กล่องเพิ่ม = document.getElementById("กล่องเพิ่มประเภท");
  if (!แก้ไขได้ && กล่องเพิ่ม) กล่องเพิ่ม.classList.add("hidden");

  var รายการ = window.LEAVE_DATA.leaveTypes.slice();   // ทำสำเนาไว้แก้
  var ที่วางตาราง = document.getElementById("ตารางประเภท");
  var ช่องชื่อใหม่ = document.getElementById("ชื่อประเภทใหม่");
  var กล่องเตือน = document.getElementById("เตือนประเภท");

  วาดตาราง();
  if (แก้ไขได้) document.getElementById("ปุ่มเพิ่ม").addEventListener("click", เพิ่มประเภท);

  function วาดตาราง() {
    if (รายการ.length === 0) {
      ที่วางตาราง.innerHTML = "<p>ยังไม่มีประเภทการลาในระบบ</p>";
      return;
    }

    var html = "<table><thead><tr><th>ชื่อประเภทการลา</th>" + (แก้ไขได้ ? "<th>จัดการ</th>" : "") + "</tr></thead><tbody>";
    รายการ.forEach(function (ประเภท) {
      html += "<tr><td>" + esc(ประเภท.name) + "</td>";
      if (แก้ไขได้) {
        html +=
          "<td>" +
          '<button type="button" class="btn-ghost" data-edit="' + esc(ประเภท.id) + '">แก้ไข</button> ' +
          '<button type="button" class="btn-danger" data-del="' + esc(ประเภท.id) + '">ลบ</button>' +
          "</td>";
      }
      html += "</tr>";
    });
    html += "</tbody></table>";
    ที่วางตาราง.innerHTML = html;

    if (!แก้ไขได้) return;

    ที่วางตาราง.querySelectorAll("[data-edit]").forEach(function (ปุ่ม) {
      ปุ่ม.addEventListener("click", function () { แก้ประเภท(ปุ่ม.dataset.edit); });
    });
    ที่วางตาราง.querySelectorAll("[data-del]").forEach(function (ปุ่ม) {
      ปุ่ม.addEventListener("click", function () { ลบประเภท(ปุ่ม.dataset.del); });
    });
  }

  function เพิ่มประเภท() {
    var ชื่อ = ช่องชื่อใหม่.value.trim();
    if (!ชื่อ) {
      กล่องเตือน.textContent = "⚠️ พิมพ์ชื่อประเภทการลาก่อน จึงจะเพิ่มได้";
      กล่องเตือน.classList.remove("hidden");
      return;
    }
    กล่องเตือน.classList.add("hidden");
    รายการ.push({ id: "lt-ใหม่-" + Date.now(), name: ชื่อ });
    ช่องชื่อใหม่.value = "";
    วาดตาราง();
  }

  function แก้ประเภท(id) {
    var ประเภท = รายการ.find(function (t) { return t.id === id; });
    var ชื่อใหม่ = prompt("แก้ชื่อประเภทการลา", ประเภท.name);
    if (ชื่อใหม่ === null) return;              // กดยกเลิก
    if (!ชื่อใหม่.trim()) { alert("ชื่อประเภทการลาว่างเปล่าไม่ได้"); return; }
    ประเภท.name = ชื่อใหม่.trim();
    วาดตาราง();
  }

  function ลบประเภท(id) {
    var ประเภท = รายการ.find(function (t) { return t.id === id; });
    if (!confirm('ยืนยันการลบประเภท "' + ประเภท.name + '" หรือไม่')) return;
    รายการ = รายการ.filter(function (t) { return t.id !== id; });
    วาดตาราง();
  }
})();
