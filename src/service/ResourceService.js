const connection = require('../config/database');

// ===================== Resources CRUD =====================

const getAllResources = async () => {
    const [rows] = await connection.pool.query('SELECT * FROM Resources ORDER BY CreatedAt DESC');
    return rows;
};

const getResourceById = async (id) => {
    const [rows] = await connection.pool.query('SELECT * FROM Resources WHERE ResourceID = ?', [id]);
    return rows && rows.length > 0 ? rows[0] : {};
};

const getAvailableResources = async () => {
    const [rows] = await connection.pool.query("SELECT * FROM Resources WHERE Status = 'available' ORDER BY Name");
    return rows;
};

const createResource = async ({ Name, Description, Type, Price, Status, ImageUrl }) => {
    const [result] = await connection.pool.query(
        'INSERT INTO Resources (Name, Description, Type, Price, Status, ImageUrl) VALUES (?, ?, ?, ?, ?, ?)',
        [Name, Description, Type, Price, Status || 'available', ImageUrl]
    );
    return result;
};

const updateResource = async (id, { Name, Description, Type, Price, Status, ImageUrl }) => {
    let query = 'UPDATE Resources SET Name = ?, Description = ?, Type = ?, Price = ?, Status = ?';
    let params = [Name, Description, Type, Price, Status];
    
    if (ImageUrl !== undefined) {
        query += ', ImageUrl = ?';
        params.push(ImageUrl);
    }
    
    query += ' WHERE ResourceID = ?';
    params.push(id);
    
    const [result] = await connection.pool.query(query, params);
    return result;
};

const deleteResource = async (id) => {
    const [result] = await connection.pool.query('DELETE FROM Resources WHERE ResourceID = ?', [id]);
    return result;
};

// ===================== Bookings CRUD =====================

const getAllBookings = async () => {
    const [rows] = await connection.pool.query(`
        SELECT b.*, u.FullName, u.Email, r.Name as ResourceName 
        FROM Bookings b 
        JOIN Users u ON b.UserID = u.UserID 
        JOIN Resources r ON b.ResourceID = r.ResourceID 
        ORDER BY b.CreatedAt DESC
    `);
    return rows;
};

const getBookingsByUserId = async (userId) => {
    const [rows] = await connection.pool.query(`
        SELECT b.*, u.FullName, u.Email, r.Name as ResourceName 
        FROM Bookings b 
        JOIN Users u ON b.UserID = u.UserID 
        JOIN Resources r ON b.ResourceID = r.ResourceID 
        WHERE b.UserID = ?
        ORDER BY b.CreatedAt DESC
    `, [userId]);
    return rows;
};

const getBookingsByResourceId = async (resourceId) => {
    const [rows] = await connection.pool.query(`
        SELECT b.*, u.FullName, u.Email, r.Name as ResourceName 
        FROM Bookings b 
        JOIN Users u ON b.UserID = u.UserID 
        JOIN Resources r ON b.ResourceID = r.ResourceID 
        WHERE b.ResourceID = ?
        ORDER BY b.CreatedAt DESC
    `, [resourceId]);
    return rows;
};

const createBooking = async ({ BookingID, UserID, ResourceID, StartTime, EndTime, TotalAmount }) => {
    const [result] = await connection.pool.query(
        "INSERT INTO Bookings (BookingID, UserID, ResourceID, StartTime, EndTime, Status, TotalAmount) VALUES (?, ?, ?, ?, ?, 'Pending', ?)",
        [BookingID, UserID, ResourceID, StartTime, EndTime, TotalAmount]
    );
    return result;
};

const updateBookingStatus = async (bookingId, status) => {
    const [result] = await connection.pool.query(
        'UPDATE Bookings SET Status = ? WHERE BookingID = ?',
        [status, bookingId]
    );
    return result;
};

const deleteBooking = async (bookingId) => {
    const [result] = await connection.pool.query('DELETE FROM Bookings WHERE BookingID = ?', [bookingId]);
    return result;
};

// ===================== Concurrency Control =====================

const checkTimeConflict = async (resourceId, startTime, endTime, excludeBookingId = null) => {
    let query = `
        SELECT COUNT(*) as cnt FROM Bookings 
        WHERE ResourceID = ? 
        AND Status IN ('Pending', 'Confirmed') 
        AND StartTime < ? 
        AND EndTime > ?
    `;
    const params = [resourceId, endTime, startTime];

    if (excludeBookingId) {
        query += ' AND BookingID != ?';
        params.push(excludeBookingId);
    }

    const [[{ cnt }]] = await connection.pool.query(query, params);
    return cnt > 0;
};

// ===================== Dashboard Stats =====================

const getDashboardStats = async () => {
    const [[{ todayBookings }]] = await connection.pool.query(
        'SELECT COUNT(*) as todayBookings FROM Bookings WHERE DATE(CreatedAt) = CURDATE()'
    );
    const [[{ totalRevenue }]] = await connection.pool.query(
        "SELECT COALESCE(SUM(TotalAmount), 0) as totalRevenue FROM Bookings WHERE Status IN ('Confirmed', 'Done')"
    );
    const [[{ totalUsers }]] = await connection.pool.query(
        'SELECT COUNT(*) as totalUsers FROM Users'
    );
    const [[{ totalResources }]] = await connection.pool.query(
        'SELECT COUNT(*) as totalResources FROM Resources'
    );
    const [recentBookings] = await connection.pool.query(`
        SELECT b.*, u.FullName, u.Email, r.Name as ResourceName 
        FROM Bookings b 
        JOIN Users u ON b.UserID = u.UserID 
        JOIN Resources r ON b.ResourceID = r.ResourceID 
        ORDER BY b.CreatedAt DESC 
        LIMIT 10
    `);

    return {
        todayBookings: todayBookings || 0,
        totalRevenue: totalRevenue || 0,
        totalUsers: totalUsers || 0,
        totalResources: totalResources || 0,
        recentBookings
    };
};

module.exports = {
    getAllResources,
    getResourceById,
    getAvailableResources,
    createResource,
    updateResource,
    deleteResource,
    getAllBookings,
    getBookingsByUserId,
    getBookingsByResourceId,
    createBooking,
    updateBookingStatus,
    deleteBooking,
    checkTimeConflict,
    getDashboardStats
};
