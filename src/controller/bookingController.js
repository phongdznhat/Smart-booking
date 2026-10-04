const {
    getAvailableResources,
    createBooking,
    checkTimeConflict,
    getBookingsByUserId,
    updateBookingStatus,
    getAllBookings,
    getDashboardStats
} = require('../service/ResourceService');
const { getallUsers } = require('../service/CRUDservice');

const getUserBookingPage = async (req, res) => {
    try {
        const userName = req.query.name || req.query.username || 'Người dùng';
        const userId = req.query.userId || '';
        const resources = await getAvailableResources();
        return res.render('userHome.ejs', { userName, userId, resources });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Lỗi server');
    }
};

const postCreateBooking = async (req, res) => {
    try {
        const { userId, resourceId, startTime, endTime, totalAmount } = req.body;

        // CRITICAL: Kiểm tra trùng lịch trước khi tạo booking
        const isConflict = await checkTimeConflict(resourceId, startTime, endTime);
        if (isConflict) {
            return res.status(409).json({ error: 'Khung giờ này đã được đặt. Vui lòng chọn khung giờ khác.' });
        }

        const BookingID = `B-${Date.now()}`;
        await createBooking({
            BookingID,
            UserID: userId,
            ResourceID: resourceId,
            StartTime: startTime,
            EndTime: endTime,
            TotalAmount: totalAmount || 0
        });

        return res.status(201).json({ message: 'Đặt lịch thành công!', bookingId: BookingID });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
    }
};

const getMyBookingsPage = async (req, res) => {
    try {
        const userId = req.query.userId || '';
        const userName = req.query.name || 'Người dùng';
        const bookings = await getBookingsByUserId(userId);
        return res.render('myBookings.ejs', { bookings, userName, userId });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Lỗi server');
    }
};

const postCancelBooking = async (req, res) => {
    try {
        const { bookingId, userId, userName } = req.body;
        await updateBookingStatus(bookingId, 'Cancelled');
        return res.redirect(`/my-bookings?userId=${userId}&name=${encodeURIComponent(userName || 'Người dùng')}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Lỗi server');
    }
};

const getAdminBookingsPage = async (req, res) => {
    try {
        const bookings = await getAllBookings();
        return res.render('adminBookings.ejs', { bookings });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Lỗi server');
    }
};

const postConfirmBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        await updateBookingStatus(bookingId, 'Confirmed');
        return res.redirect('/admin/bookings');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Lỗi server');
    }
};

const getAdminDashboardPage = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        const dataUser = await getallUsers();
        return res.render('adminDashboard.ejs', { stats, dataUser });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Lỗi server');
    }
};

module.exports = {
    getUserBookingPage,
    postCreateBooking,
    getMyBookingsPage,
    postCancelBooking,
    getAdminBookingsPage,
    postConfirmBooking,
    getAdminDashboardPage
};
