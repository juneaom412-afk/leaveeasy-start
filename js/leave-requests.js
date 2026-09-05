// ─────────────────────────────────────────────────────────────
// js/leave-requests.js — หน้าที่ 1 รายการใบลา
// สัปดาห์ที่ 6: อ่านสดจาก Firestore (collection "leaveRequests")
// ─────────────────────────────────────────────────────────────

(async function () {
  var กล่อง = document.getElementById("ผลลัพธ์");

  var ใบลาทั้งหมด;
  try {
    var สแนปช็อต = await db.collection("leaveRequests").get();
    ใบลาทั้งหมด = สแนปช็อต.docs.map(function (d) {
      return Object.assign({ id: d.id }, d.data());
    });

    // เรียงจากใบที่ยื่นล่าสุดไปเก่าสุด
    ใบลาทั้งหมด.sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); });
  } catch (err) {
    กล่อง.innerHTML = "<p>โหลดข้อมูลจาก Firestore ไม่สำเร็จ</p>";
    if (typeof showConfigWarning === "function") {
      showConfigWarning("ตรวจสอบว่าเปิดใช้งาน Firestore Database ในคอนโซลแล้ว และค่าใน js/firebase-config.js ถูกต้อง (" + err.message + ")");
    }
    return;
  }

  // ถ้ามีสถานะติดมาท้าย URL ให้กรองเฉพาะสถานะนั้น
  var สถานะที่กรอง = ค่าจากURL("status");
  if (สถานะที่กรอง) {
    ใบลาทั้งหมด = ใบลาทั้งหมด.filter(function (ใบ) { return ใบ.status === สถานะที่กรอง; });
    document.querySelector(".subtitle").textContent =
      "กำลังแสดงเฉพาะใบลาที่สถานะ " + สถานะที่กรอง + " · กดเมนู รายการใบลา เพื่อดูทั้งหมด";
  }

  แสดงตาราง(ใบลาทั้งหมด);

  function แสดงตาราง(รายการ) {
    if (รายการ.length === 0) {
      กล่อง.innerHTML = "<p>ยังไม่มีใบขอลาในระบบ</p>";
      return;
    }

    var html =
      "<table><thead><tr>" +
      "<th>หัวข้อ</th>" +
      "<th>ประเภทการลา</th>" +
      "<th>สถานะ</th>" +
      '<th class="hide-mobile">ผู้ขอลา</th>' +
      '<th class="hide-mobile">วันที่ลา</th>' +
      "</tr></thead><tbody>";

    รายการ.forEach(function (ใบ) {
      html +=
        '<tr class="clickable" data-id="' + esc(ใบ.id) + '">' +
        "<td>" + esc(ใบ.title) + "</td>" +
        "<td>" + esc(ใบ.leaveTypeName) + "</td>" +
        "<td>" + ป้ายสถานะ(ใบ.status) + "</td>" +
        '<td class="hide-mobile">' + esc(ใบ.requesterName) + "</td>" +
        '<td class="hide-mobile">' + esc(ใบ.startDate) + " ถึง " + esc(ใบ.endDate) + "</td>" +
        "</tr>";
    });

    html += "</tbody></table>";
    กล่อง.innerHTML = html;

    // กดที่แถวไหน ไปหน้ารายละเอียดของใบนั้น
    กล่อง.querySelectorAll("tr.clickable").forEach(function (แถว) {
      แถว.addEventListener("click", function () {
        location.href = "leave-request-detail.html?id=" + แถว.dataset.id;
      });
    });
  }
})();
