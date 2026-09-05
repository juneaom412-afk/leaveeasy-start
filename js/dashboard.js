// ─────────────────────────────────────────────────────────────
// js/dashboard.js — หน้าที่ 5 แดชบอร์ดสรุป
// สัปดาห์ที่ 6: ยังเป็นหน้าโครงจาก prototype — นับจาก js/data.js
// (นับจากฐานข้อมูลจริงเป็นของสัปดาห์ที่ 7)
// ─────────────────────────────────────────────────────────────

(function () {
  var ใบลาทั้งหมด = window.LEAVE_DATA.leaveRequests;
  var สถานะทั้งหมด = ["รอพิจารณา", "อนุมัติ", "ไม่อนุมัติ"];

  var กล่องสรุป = document.getElementById("สรุปสถานะ");
  กล่องสรุป.innerHTML = สถานะทั้งหมด.map(function (สถานะ) {
    var จำนวน = ใบลาทั้งหมด.filter(function (ใบ) { return ใบ.status === สถานะ; }).length;
    return (
      '<a class="stat" href="leave-requests.html?status=' + encodeURIComponent(สถานะ) + '">' +
      '<div class="number">' + จำนวน + "</div>" +
      "<div>" + esc(สถานะ) + "</div>" +
      "</a>"
    );
  }).join("");

  var ล่าสุด5ใบ = ใบลาทั้งหมด
    .slice()
    .sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); })
    .slice(0, 5);

  var กล่องรายการ = document.getElementById("รายการล่าสุด");
  if (ล่าสุด5ใบ.length === 0) {
    กล่องรายการ.innerHTML = "<p>ยังไม่มีใบขอลาในระบบ</p>";
    return;
  }

  var html =
    "<table><thead><tr>" +
    "<th>หัวข้อ</th>" +
    "<th>สถานะ</th>" +
    "<th>วันที่ยื่น</th>" +
    "</tr></thead><tbody>";

  ล่าสุด5ใบ.forEach(function (ใบ) {
    html +=
      "<tr>" +
      "<td>" + esc(ใบ.title) + "</td>" +
      "<td>" + ป้ายสถานะ(ใบ.status) + "</td>" +
      "<td>" + esc(ใบ.createdAt) + "</td>" +
      "</tr>";
  });

  html += "</tbody></table>";
  กล่องรายการ.innerHTML = html;
})();
