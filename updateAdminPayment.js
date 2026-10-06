const fs = require('fs');
let c = fs.readFileSync('src/view/adminBookings.ejs', 'utf-8');

c = c.replace(
    /<\/form>\n                        <% } %>/g,
    `</form>
                        <% } %>
                        <% if (b.PaymentStatus === 'Unpaid') { %>
                          <form
                            action="/admin/bookings/confirm-payment"
                            method="post"
                            onsubmit="return confirm('Xác nhận đã thu tiền đơn này?');"
                            style="margin-left: 8px;"
                          >
                            <input type="hidden" name="bookingId" value="<%= b.BookingID %>" />
                            <button type="submit" class="btn-confirm" style="background:#0f766e; border:none; color:white; padding:6px 10px; border-radius:6px; cursor:pointer;">
                              Đã thu tiền
                            </button>
                          </form>
                        <% } else { %>
                            <span style="margin-left:8px; font-size:12px; color:#16a34a; font-weight:bold;">Đã TT</span>
                        <% } %>`
);

fs.writeFileSync('src/view/adminBookings.ejs', c);
