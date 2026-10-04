const fs = require('fs');
let c = fs.readFileSync('src/view/resourceEdit.ejs', 'utf8');
const replaceContent = `
                  <div class="input-wrap" style="padding: 10px;">
                    <% if (resource.ImageUrl) { %>
                      <div style="margin-bottom: 10px;">
                        <img src="<%= resource.ImageUrl %>" style="max-height: 100px; border-radius: 8px;" alt="Current Image">
                        <p style="font-size: 12px; color: #666; margin-top: 4px;">Ảnh hiện tại (chọn ảnh mới bên dưới để thay đổi)</p>
                      </div>
                    <% } %>
                    <input type="file" name="image" accept="image/*">
                  </div>`;
c = c.replace(/<div class="input-wrap" style="padding: 10px;">[\s\S]*?<input type="file" name="image" accept="image\/\*">[\s\S]*?<\/div>/m, replaceContent);
fs.writeFileSync('src/view/resourceEdit.ejs', c);
