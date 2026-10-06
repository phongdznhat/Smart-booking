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

        // Insert admin
        const bcrypt = require('bcrypt');
        const hash = await bcrypt.hash('123456', 10);
        try {
            await pool.query(`INSERT INTO Users (UserID, FullName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?, ?)`, 
                ['U-ADMIN1', 'Admin', 'admin@example.com', hash, 'admin']);
            console.log("Inserted default admin: admin@example.com / 123456");
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
