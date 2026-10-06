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

        // Insert user
        const bcrypt = require('bcrypt');
        const hash = await bcrypt.hash('123456', 10);
        try {
            await pool.query(`INSERT INTO Users (UserID, FullName, Email, PasswordHash, Phone, Role) VALUES (?, ?, ?, ?, ?, ?)`, 
                ['U-USER1', 'Khách Hàng', 'user@example.com', hash, '0901234567', 'user']);
            console.log("Inserted default user: user@example.com / 123456");
        } catch(e) {
            if (e.code !== 'ER_DUP_ENTRY') throw e;
        }

        console.log("Cloud DB setup complete!");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
};

setup();
