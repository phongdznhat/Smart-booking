const bcrypt = require('bcrypt');
const connection = require('./src/config/database');

const createAdmin = async () => {
    try {
        const email = 'admin@gmail.com';
        const password = 'admin'; // Mật khẩu dễ nhớ
        
        // Kiểm tra xem đã có admin chưa
        const [existingUsers] = await connection.pool.query('SELECT * FROM Users WHERE Email = ?', [email]);
        
        if (existingUsers.length > 0) {
            console.log("⚠️ Tài khoản admin@gmail.com đã tồn tại! Anh có thể đăng nhập với mật khẩu cũ, hoặc xóa tài khoản cũ đi để tạo lại.");
        } else {
            // Mã hóa mật khẩu
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            
            // Random UserID từ 1000 đến 9999
            const userId = Math.floor(Math.random() * 9000) + 1000;
            
            await connection.pool.query(
                "INSERT INTO Users (UserID, FullName, Email, Phone, PasswordHash, Role, Status) VALUES (?, ?, ?, ?, ?, 'admin', 'active')",
                [userId, 'Admin', email, '0987654321', passwordHash]
            );
            
            console.log("✅ Tạo tài khoản Admin thành công!");
            console.log("-----------------------------------------");
            console.log("📧 Email: admin@gmail.com");
            console.log("🔑 Mật khẩu: admin");
            console.log("-----------------------------------------");
        }
        process.exit(0);
    } catch (error) {
        console.error("❌ Lỗi khi tạo Admin:", error);
        process.exit(1);
    }
};

createAdmin();
