const connection = require('./src/config/database');

const initDB = async () => {
    try {
        console.log("Đang khởi tạo các bảng trong Database...");

        // Bảng Resources
        await connection.pool.query(`
            CREATE TABLE IF NOT EXISTS Resources (
                ResourceID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(100) NOT NULL,
                Description TEXT,
                Type VARCHAR(50),
                Price DECIMAL(10, 2) DEFAULT 0.00,
                Status ENUM('available', 'maintenance', 'out_of_service') DEFAULT 'available',
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Đã kiểm tra/tạo bảng Resources");

        // Bảng Bookings
        await connection.pool.query(`
            CREATE TABLE IF NOT EXISTS Bookings (
                BookingID VARCHAR(50) PRIMARY KEY,
                UserID INT,
                ResourceID INT,
                StartTime DATETIME NOT NULL,
                EndTime DATETIME NOT NULL,
                Status ENUM('Pending', 'Confirmed', 'Cancelled', 'Done') DEFAULT 'Pending',
                TotalAmount DECIMAL(10, 2) DEFAULT 0.00,
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
                FOREIGN KEY (ResourceID) REFERENCES Resources(ResourceID) ON DELETE CASCADE
            )
        `);
        console.log("✅ Đã kiểm tra/tạo bảng Bookings");

        console.log("🎉 Hoàn tất khởi tạo Database!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Lỗi khi khởi tạo Database:", error);
        process.exit(1);
    }
};

initDB();
