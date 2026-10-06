const crypto = require('crypto');
const qs = require('qs');
const moment = require('moment');
const connection = require('../config/database');

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const createPaymentUrl = (req, bookingId, amount, returnUrl) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null) || '127.0.0.1';

    let tmnCode = process.env.VNP_TMN_CODE;
    let secretKey = process.env.VNP_HASH_SECRET;
    let vnpUrl = process.env.VNP_URL;

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = bookingId + '_' + createDate;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma dat cho ' + bookingId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    vnp_Params = sortObject(vnp_Params);

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    return vnpUrl;
};

const createPaymentRecord = async (bookingId, userId, amount) => {
    const paymentId = `PAY-${Date.now()}`;
    const query = `
        INSERT INTO Payments (PaymentID, BookingID, UserID, Amount, Status, CreatedAt)
        VALUES (?, ?, ?, ?, 'Pending', NOW())
    `;
    await connection.pool.query(query, [paymentId, bookingId, userId, amount]);
    return paymentId;
};

const verifyIpnAndProcess = async (vnp_Params) => {
    let secureHash = vnp_Params['vnp_SecureHash'];
    
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    
    let secretKey = process.env.VNP_HASH_SECRET;
    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        let orderId = vnp_Params['vnp_TxnRef'].split('_')[0];
        let rspCode = vnp_Params['vnp_ResponseCode'];
        
        let status = (rspCode === '00') ? 'Paid' : 'Failed';
        
        try {
            await connection.pool.query(
                `UPDATE Payments SET Status = ? WHERE BookingID = ? AND Status = 'Pending'`, 
                [status, orderId]
            );
            
            if (rspCode === '00') {
                await connection.pool.query(`UPDATE Bookings SET PaymentStatus = 'Paid' WHERE BookingID = ?`, [orderId]);
            } else {
                await connection.pool.query(`UPDATE Bookings SET Status = 'Cancelled' WHERE BookingID = ?`, [orderId]);
            }
            
            return {RspCode: '00', Message: 'Confirm Success'};
        } catch (e) {
            console.error("DB error in IPN:", e);
            return {RspCode: '99', Message: 'Unknown error'};
        }
    } else {
        return {RspCode: '97', Message: 'Invalid Checksum'};
    }
};

module.exports = {
    sortObject,
    createPaymentUrl,
    createPaymentRecord,
    verifyIpnAndProcess
};
