const mysql = require('mysql2/promise');

const setup = async () => {
    try {
        const pool = mysql.createPool({
            host: 'smartbooking-smartbooking.j.aivencloud.com',
            port: 17314,
            user: 'avnadmin',
            password: 'AVNS_he1x4PR0pHQU1qzzl8r',
            database: 'defaultdb',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log("Connecting to Aiven Cloud MySQL...");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS Users (
                UserID VARCHAR(50) PRIMARY KEY,
                FullName VARCHAR(100) NOT NULL,
                Email VARCHAR(100) NOT NULL UNIQUE,
                PasswordHash VARCHAR(255) NOT NULL,
                Phone VARCHAR(20),
                Role ENUM('admin', 'user') DEFAULT 'user',
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Table Users created.");

        await pool.query(`
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
        console.log("✅ Table Resources created.");

        // Insert some default resources if empty
        const [resRows] = await pool.query('SELECT COUNT(*) as count FROM Resources');
        if (resRows[0].count === 0) {
            await pool.query(`INSERT INTO Resources (Name, Description, Type, Price, Status) VALUES 
                ('Phòng họp lớn', 'Sức chứa 20 người, có máy chiếu', 'Phòng họp', 500000, 'available'),
                ('Dịch vụ vệ sinh', 'Dọn dẹp văn phòng theo giờ', 'Dịch vụ', 200000, 'available')
            `);
            console.log("✅ Inserted default resources.");
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS Bookings (
                BookingID VARCHAR(50) PRIMARY KEY,
                UserID VARCHAR(50),
                ResourceID INT,
                StartTime DATETIME NOT NULL,
                EndTime DATETIME NOT NULL,
                Status ENUM('Pending', 'Confirmed', 'Cancelled', 'Done') DEFAULT 'Pending',
                PaymentStatus ENUM('Unpaid', 'Paid', 'Refunded') DEFAULT 'Unpaid',
                TotalAmount DECIMAL(10, 2) DEFAULT 0.00,
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
                FOREIGN KEY (ResourceID) REFERENCES Resources(ResourceID) ON DELETE CASCADE
            )
        `);
        console.log("✅ Table Bookings created.");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS Payments (
                PaymentID VARCHAR(50) PRIMARY KEY, 
                BookingID VARCHAR(50) NOT NULL, 
                UserID VARCHAR(50) NOT NULL, 
                Amount DECIMAL(15,2) NOT NULL DEFAULT 0.00, 
                PaymentMethod VARCHAR(50) DEFAULT 'VNPay', 
                TransactionNo VARCHAR(100), 
                BankCode VARCHAR(50), 
                Status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending', 
                PaymentDate DATETIME, 
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                ExpiredAt DATETIME, 
                ResponseData TEXT, 
                FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID), 
                FOREIGN KEY (UserID) REFERENCES Users(UserID)
            )
        `);
        console.log("✅ Table Payments created.");

        // Insert admin
        const bcrypt = require('bcryptjs');
        const hash = await bcrypt.hash('123456', 10);
        try {
            await pool.query(`INSERT INTO Users (UserID, FullName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?, ?)`, 
                ['U-ADMIN1', 'Admin', 'admin@example.com', hash, 'admin']);
            console.log("✅ Inserted default admin: admin@example.com / 123456");
        } catch(e) {
            if (e.code !== 'ER_DUP_ENTRY') throw e;
        }

        console.log("🎉 Cloud DB setup complete!");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
};

setup();
