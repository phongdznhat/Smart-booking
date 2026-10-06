const fs = require('fs');
let c = fs.readFileSync('src/view/create.ejs', 'utf-8');
c = c.replace(
    /<\/div>\n\n              <!-- Buttons -->/g,
    `</div>
              <!-- Role -->
              <div class="field">
                <label for="role">Vai trò</label>
                <div class="input-wrap">
                  <select id="role" name="role" style="width: 100%; border: none; outline: none; background: transparent; padding-left: 10px; font-family: inherit; font-size: 15px;">
                    <option value="user">Khách hàng (User)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
              </div>

              <!-- Buttons -->`
);
fs.writeFileSync('src/view/create.ejs', c);
