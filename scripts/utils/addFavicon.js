const fs = require('fs');
const path = require('path');

const dir = 'src/view';
const faviconTag = '<link rel="icon" type="image/png" href="/image/favicon.png">\n  </head>';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.ejs')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        // Remove existing favicon if any
        content = content.replace(/<link rel="icon"[^>]*>/gi, '');
        // Insert new favicon
        if (content.includes('</head>')) {
            content = content.replace('</head>', faviconTag);
            fs.writeFileSync(filePath, content);
            console.log('Added favicon to', file);
        }
    }
});
