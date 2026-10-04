const fs = require('fs');

function styleFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(
        '<input type="file" name="image" accept="image/*">',
        '<input type="file" name="image" accept="image/*" style="padding: 10px !important; width: 100% !important; border: 1px solid #ccc !important; border-radius: 8px !important; background: #f9f9f9 !important; font-family: inherit; color: #333 !important; display: block !important; box-sizing: border-box;">'
    );
    fs.writeFileSync(filePath, content);
}

styleFile('src/view/resourceCreate.ejs');
styleFile('src/view/resourceEdit.ejs');
console.log('Styled successfully.');
