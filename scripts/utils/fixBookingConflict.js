const fs = require('fs');

let c = fs.readFileSync('src/service/PaymentService.js', 'utf8');
c = c.replace(
    /if \(rspCode === '00'\) {\s*await connection\.pool\.query\(\s*`UPDATE Bookings SET PaymentStatus = 'Paid' WHERE BookingID = \?`,\s*\[orderId\]\s*\);\s*}/g,
    `if (rspCode === '00') {
                await connection.pool.query(\`UPDATE Bookings SET PaymentStatus = 'Paid' WHERE BookingID = ?\`, [orderId]);
            } else {
                await connection.pool.query(\`UPDATE Bookings SET Status = 'Cancelled' WHERE BookingID = ?\`, [orderId]);
            }`
);
fs.writeFileSync('src/service/PaymentService.js', c);

let c2 = fs.readFileSync('src/controller/paymentController.js', 'utf8');
c2 = c2.replace(
    /if\(secureHash === signed\){\s*res\.render\('paymentResult\.ejs'/g,
    `if(secureHash === signed){
        // Also cancel booking immediately if not 00
        if (vnp_Params['vnp_ResponseCode'] !== '00') {
            const orderId = vnp_Params['vnp_TxnRef'].split('_')[0];
            const connection = require('../config/database');
            connection.pool.query(\`UPDATE Bookings SET Status = 'Cancelled' WHERE BookingID = ?\`, [orderId]).catch(e => console.error(e));
        }
        res.render('paymentResult.ejs'`
);
fs.writeFileSync('src/controller/paymentController.js', c2);
