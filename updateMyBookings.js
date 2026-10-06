const fs = require('fs');
let c = fs.readFileSync('src/view/myBookings.ejs', 'utf-8');
c = c.replace(
    /<div><strong>S[\s\S]*?ti[\s\S]*?n:<\/strong> <%= b.TotalAmount \? Number\(b.TotalAmount\).toLocaleString\('vi-VN'\) : '0' %> [\s\S]*?<\/div>/,
    `<div><strong>Số tiền:</strong> <%= b.TotalAmount ? Number(b.TotalAmount).toLocaleString('vi-VN') : '0' %> đ 
        <% if (b.PaymentStatus === 'Paid') { %>
            <span style="margin-left:8px; padding:2px 8px; background:#dcfce7; color:#166534; border-radius:12px; font-size:12px; font-weight:600">Đã thanh toán VNPay</span>
        <% } else if (b.PaymentStatus === 'Unpaid') { %>
            <span style="margin-left:8px; padding:2px 8px; background:#f1f5f9; color:#475569; border-radius:12px; font-size:12px">Chưa thanh toán</span>
        <% } %>
    </div>`
);
fs.writeFileSync('src/view/myBookings.ejs', c);
