const fs = require('fs');
let c = fs.readFileSync('src/view/userHome.ejs', 'utf-8');
c = c.replace(
    /<button class="btn btn-primary btn-block" type="button" id="confirm-booking-btn">[\s\S]*?Xác nhận đặt lịch\s*<\/button>/,
    `<button class="btn btn-primary btn-block" type="button" id="confirm-booking-btn">
        <svg class="ico ico--sm"><use href="#i-check" /></svg>
        Xác nhận đặt lịch (Thanh toán sau)
     </button>
     <button class="btn btn-block" style="background:#0d9488; color:white; margin-top:10px; display:flex; align-items:center; justify-content:center; gap:8px" type="button" id="vnpay-booking-btn">
        <svg class="ico ico--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        Thanh toán VNPay
     </button>`
);
fs.writeFileSync('src/view/userHome.ejs', c);
