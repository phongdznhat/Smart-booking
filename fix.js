const fs = require('fs');
let code = fs.readFileSync('src/controller/homeController.js', 'utf8');

code = code.replace(/return res\.redirect\(\/user\/home.*?\);/, 'return res.redirect(`/user/home?name=${encodeURIComponent(userName)}&userId=${user.UserID}`);');

fs.writeFileSync('src/controller/homeController.js', code);
console.log('Fixed');
