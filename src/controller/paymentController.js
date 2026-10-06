const paymentService = require('../service/PaymentService');
const connection = require('../config/database');
const qs = require('qs');
const crypto = require('crypto');

const postCreatePayment = async (req, res) => {
    try {
        const bookingId = req.body.bookingId || req.query.bookingId;
        
        if (!bookingId) {
            return res.status(400).send("Booking ID is required");
        }

        const [rows] = await connection.pool.query(
            `SELECT * FROM Bookings WHERE BookingID = ?`,
            [bookingId]
        );

        if (rows.length === 0) {
            return res.status(404).send("Booking not found");
        }

        const booking = rows[0];
        const amount = booking.TotalAmount;
        const userId = booking.UserID;

        await paymentService.createPaymentRecord(bookingId, userId, amount);

        const returnUrl = `${req.protocol}://${req.get('host')}/payment/result`;

        const paymentUrl = paymentService.createPaymentUrl(req, bookingId, amount, returnUrl);

        res.redirect(paymentUrl);
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).send("Internal Server Error");
    }
};

const getVnPayReturn = (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = paymentService.sortObject(vnp_Params);

    let secretKey = process.env.VNP_HASH_SECRET;

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        // Also cancel booking immediately if not 00
        if (vnp_Params['vnp_ResponseCode'] !== '00') {
            const orderId = vnp_Params['vnp_TxnRef'].split('_')[0];
            const connection = require('../config/database');
            connection.pool.query(`UPDATE Bookings SET Status = 'Cancelled' WHERE BookingID = ?`, [orderId]).catch(e => console.error(e));
        }
        res.render('paymentResult.ejs', {
            code: vnp_Params['vnp_ResponseCode'],
            message: vnp_Params['vnp_ResponseCode'] === '00' ? 'Giao dịch thành công' : 'Giao dịch thất bại',
            data: vnp_Params
        });
    } else {
        res.render('paymentResult.ejs', {
            code: '97',
            message: 'Giao dịch thất bại: Checksum không hợp lệ',
            data: vnp_Params
        });
    }
};

const getVnPayIpn = async (req, res) => {
    try {
        const result = await paymentService.verifyIpnAndProcess(req.query);
        res.status(200).json(result);
    } catch (error) {
        console.error("IPN error:", error);
        res.status(500).json({ RspCode: '99', Message: 'Unknown error' });
    }
};

module.exports = {
    postCreatePayment,
    getVnPayReturn,
    getVnPayIpn
};
