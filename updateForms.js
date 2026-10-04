const fs = require('fs');

function updateEjs(file, action) {
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(
        `<form action="${action}" method="post" class="form">`,
        `<form action="${action}" method="post" class="form" enctype="multipart/form-data">
              <div class="field">
                <label>Ảnh đại diện dịch vụ</label>
                <div class="input-wrap" style="padding: 10px;">
                  <input type="file" name="image" accept="image/*">
                </div>
              </div>`
    );
    fs.writeFileSync(file, c);
}

updateEjs('src/view/resourceCreate.ejs', '/admin/resources/create');
updateEjs('src/view/resourceEdit.ejs', '/admin/resources/update');
