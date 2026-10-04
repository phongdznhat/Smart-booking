const connection = require('../config/database');

const getallUsers = async () => {
    const [rows] = await connection.pool.query('SELECT * FROM Users ORDER BY FullName');
    return rows;
};

const getUserById = async (userId) => {
    const [rows] = await connection.pool.query('SELECT * FROM Users WHERE UserID = ?', [userId]);
    return rows && rows.length > 0 ? rows[0] : {};
};

const getUserByEmail = async (email) => {
    const [rows] = await connection.pool.query('SELECT * FROM Users WHERE Email = ?', [email]);
    return rows && rows.length > 0 ? rows[0] : null;
};

const createUser = async (userData) => {
    const { UserID, FullName, Email, Phone, PasswordHash, Role, Status } = userData;
    const [result] = await connection.pool.query(
        'INSERT INTO Users (UserID, FullName, Email, Phone, PasswordHash, Role, Status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [UserID, FullName, Email, Phone, PasswordHash, Role, Status]
    );
    return result;
};

const updatebyId = async (userId, fullName, email, phone, passwordHash) => {
    const [result] = await connection.pool.query(
        'UPDATE Users SET FullName = ?, Email = ?, Phone = ?, PasswordHash = ? WHERE UserID = ?',
        [fullName, email, phone, passwordHash, userId]
    );
    return result;
};

const deletebyId = async (userId) => {
    const [result] = await connection.pool.query('DELETE FROM Users WHERE UserID = ?', [userId]);
    return result;
};

module.exports = {
    getallUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updatebyId,
    deletebyId,
};