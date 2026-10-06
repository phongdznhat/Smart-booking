const fs = require('fs');
let c = fs.readFileSync('src/view/adminBookings.ejs', 'utf-8');

c = c.replace(
    /<button type="submit" class="btn-confirm">\n                              Xác nhận\n                            <\/button>\n                          <\/form>/g,
    `<button type="submit" class="btn-confirm">
                              Xác nhận
                            </button>
                          </form>
                          <form
                            action="/admin/bookings/cancel"
                            method="post"
                            onsubmit="return confirm('Bạn có chắc muốn từ chối/hủy đơn này không?');"
                            style="margin-left: 8px;"
                          >
                            <input type="hidden" name="bookingId" value="<%= b.BookingID %>" />
                            <button type="submit" class="btn-confirm" style="background:#dc2626; border:none; color:white; padding:6px 10px; border-radius:6px; cursor:pointer;">
                              Hủy đơn
                            </button>
                          </form>`
);

fs.writeFileSync('src/view/adminBookings.ejs', c);
