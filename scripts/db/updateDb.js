const c = require('./src/config/database');
const init = async () => {
    try {
        await c.pool.query(`ALTER TABLE Bookings ADD COLUMN PaymentStatus ENUM('Unpaid', 'Paid', 'Refunded') DEFAULT 'Unpaid' AFTER Status`);
        console.log('Altered Bookings table');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') console.log('PaymentStatus already exists');
        else throw e;
    }
    
    try {
        await c.pool.query(`
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
        console.log('Created Payments table');
    } catch (e) {
        throw e;
    }
    console.log('Database updated');
};
init().catch(console.error).finally(()=>process.exit(0));
