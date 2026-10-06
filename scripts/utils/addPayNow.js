const fs = require('fs');
let c = fs.readFileSync('src/view/myBookings.ejs', 'utf-8');

c = c.replace(
    /<form action="\/cancel-booking" method="post" style="margin-top:12px">/g,
    `<form action="/cancel-booking" method="post" style="margin-top:12px; display:inline-block">`
);

c = c.replace(
    /<\/form>\n                <% } %>/g,
    `</form>
                <% if (b.PaymentStatus === 'Unpaid') { %>
                <form action="/payment/create" method="post" style="margin-top:12px; display:inline-block; margin-left:8px">
                    <input type="hidden" name="bookingId" value="<%= b.BookingID %>">
                    <button type="submit" class="btn btn-primary" style="background:#0d9488">Thanh toán ngay</button>
                </form>
                <% } %>
                <% } %>`
);

fs.writeFileSync('src/view/myBookings.ejs', c);
