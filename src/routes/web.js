const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/image/');
    },
    filename: function (req, file, cb) {
        cb(null, 'resource-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const route = express.Router();

const {
    getLoginPage,
    postLogin,
    postRegister,
    getCreatePage,
    getUpdatePage,
    postCreateUser,
    postUpdateUser,
    postDeleteUser,
} = require('../controller/homeController');

const {
    getResourceListPage,
    getCreateResourcePage,
    postCreateResource,
    getEditResourcePage,
    postUpdateResource,
    postDeleteResource
} = require('../controller/resourceController');

const {
    getUserBookingPage,
    postCreateBooking,
    getMyBookingsPage,
    postCancelBooking,
    getAdminBookingsPage,
    postConfirmBooking, postConfirmPayment, postAdminCancelBooking,
    getAdminDashboardPage
} = require('../controller/bookingController');

// Authentication & Users Route
route.get('/', getLoginPage);
route.get('/login', getLoginPage);
route.get('/create', getCreatePage);
route.get('/update/:id', getUpdatePage);
route.post('/login', postLogin);
route.post('/register', postRegister);
route.post('/create-user', postCreateUser);
route.post('/update-user', postUpdateUser);
route.post('/delete-user', postDeleteUser);

// Admin - Dashboard
route.get('/dashboard', getAdminDashboardPage);
route.get('/admin/dashboard', getAdminDashboardPage);

// Admin - Resource Management
route.get('/admin/resources', getResourceListPage);
route.get('/admin/resources/create', getCreateResourcePage);
route.post('/admin/resources/create', upload.single('image'), postCreateResource);
route.get('/admin/resources/edit/:id', getEditResourcePage);
route.post('/admin/resources/update', upload.single('image'), postUpdateResource);
route.post('/admin/resources/delete', postDeleteResource);

// Admin - Booking Management
route.get('/admin/bookings', getAdminBookingsPage);
route.post('/admin/bookings/confirm', postConfirmBooking);
route.post('/admin/bookings/confirm-payment', postConfirmPayment);
route.post('/admin/bookings/cancel', postAdminCancelBooking);

// User - Booking Flow
route.get('/home', getUserBookingPage);
route.get('/user/home', getUserBookingPage);
route.post('/api/booking', postCreateBooking);
route.get('/my-bookings', getMyBookingsPage);
route.post('/cancel-booking', postCancelBooking);

const { postCreatePayment, getVnPayReturn, getVnPayIpn } = require('../controller/paymentController');

// Payment Flow
route.post('/payment/create', postCreatePayment);
route.get('/payment/result', getVnPayReturn);
route.get('/payment/vnpay_return', getVnPayReturn);
route.get('/payment/ipn', getVnPayIpn);

module.exports = route;
