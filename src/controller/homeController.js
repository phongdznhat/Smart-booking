const bcrypt = require('bcrypt');
const {
    getallUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updatebyId,
    deletebyId,
} = require('../service/CRUDservice');

const normalizeRole = (role) => {
    if (!role) return 'user';
    return String(role).toLowerCase();
};

const isValidPassword = async (inputPassword, storedPassword) => {
    if (!storedPassword) return false;

    if (storedPassword === inputPassword) {
        return true;
    }

    try {
        return await bcrypt.compare(inputPassword, storedPassword);
    } catch (error) {
        return false;
    }
};

const hashPasswordIfNeeded = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        return password;
    }
};

const getLoginPage = (req, res) => {
    return res.render('login.ejs');
};

const postLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.redirect('/login?error=1');
    }

    const user = await getUserByEmail(email);
    if (!user) {
        return res.redirect('/login?error=1');
    }

    let isMatch = await isValidPassword(password, user.PasswordHash);
    if (!isMatch) {
        isMatch = await isValidPassword(password.trim(), user.PasswordHash);
        if (!isMatch) return res.redirect('/login?error=1');
    }

    if (normalizeRole(user.Role) === 'admin') {
        return res.redirect('/admin/dashboard');
    }

    const userName = user.FullName || user.Email || 'Người dùng';
    return res.redirect(`/user/home?name=${encodeURIComponent(userName)}&userId=${user.UserID}`);
};

const postRegister = async (req, res) => {
    const { name, email, password, phone = '' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('TÃªn, email vÃ  máº­t kháº©u lÃ  báº¯t buá»™c');
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return res.status(409).send('Email Ä‘Ã£ tá»“n táº¡i');
    }

    const userId = `U-${Date.now()}`;
    const hashedPassword = await hashPasswordIfNeeded(password);
    await createUser({
        UserID: userId,
        FullName: name,
        Email: email,
        Phone: phone,
        PasswordHash: hashedPassword,
        Role: 'user',
        Status: 'active',
    });

    return res.redirect(`/user/home?name=${encodeURIComponent(name)}`);
};

const getDashboardPage = async (req, res) => {
    const users = await getallUsers();
    return res.render('home.ejs', { dataUser: users });
};

const getAdminDashboardPage = async (req, res) => {
    const users = await getallUsers();
    return res.render('adminDashboard.ejs', { dataUser: users });
};

const getUserHomePage = (req, res) => {
    const userName = req.query.name || req.query.username || 'NgÆ°á»i dÃ¹ng';
    return res.render('userHome.ejs', { userName });
};

const getCreatePage = (req, res) => {
    return res.render('create.ejs');
};

const postCreateUser = async (req, res) => {
    const { name, email, password, phone = '' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('TÃªn, email vÃ  máº­t kháº©u lÃ  báº¯t buá»™c');
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return res.status(409).send('Email Ä‘Ã£ tá»“n táº¡i');
    }

    const userId = `U-${Date.now()}`;
    const hashedPassword = await hashPasswordIfNeeded(password);
    await createUser({
        UserID: userId,
        FullName: name,
        Email: email,
        Phone: phone,
        PasswordHash: hashedPassword,
        Role: 'user',
        Status: 'active',
    });

    return res.redirect('/dashboard');
};

const getUpdatePage = async (req, res) => {
    const userId = req.params.id;
    const user = await getUserById(userId);
    return res.render('edit.ejs', { userEdit: user });
};

const postUpdateUser = async (req, res) => {
    const { id, name, email, phone, password } = req.body;

    const existingUser = await getUserById(id);
    if (!existingUser) {
        return res.status(404).send('KhÃ´ng tÃ¬m tháº¥y tÃ i khoáº£n');
    }

    const targetUser = await getUserByEmail(email);
    if (targetUser && targetUser.UserID !== id) {
        return res.status(409).send('Email Ä‘Ã£ tá»“n táº¡i');
    }

    const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : existingUser.PasswordHash;

    await updatebyId(id, name, email, phone, hashedPassword);

    return res.redirect('/dashboard');
};

const postDeleteUser = async (req, res) => {
    const { id } = req.body;
    await deletebyId(id);
    return res.redirect('/dashboard');
};

module.exports = {
    getLoginPage,
    postLogin,
    postRegister,
    getDashboardPage,
    getAdminDashboardPage,
    getUserHomePage,
    getCreatePage,
    getUpdatePage,
    postCreateUser,
    postUpdateUser,
    postDeleteUser,
};
