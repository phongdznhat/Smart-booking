const fs = require('fs');
let c = fs.readFileSync('src/view/userHome.ejs', 'utf-8');

c = c.replace(
    /          \/\/ <summary> Nếu thanh toán VNPay, gọi đến router thanh toán thay vì router booking[\s\S]*?          try {/i,
    `          try {`
);

c = c.replace(
    /            const data = await res\.json\(\);\n            if \(res\.ok\) {\n              modalTitle\.textContent/i,
    `            const data = await res.json();
            if (res.ok) {
              // <summary> Nếu là VNPay, redirect sang VNPay
              if (isVnpay) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '/payment/create';
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'bookingId';
                input.value = data.bookingId;
                form.appendChild(input);
                document.body.appendChild(form);
                form.submit();
                return;
              }
              modalTitle.textContent`
);

fs.writeFileSync('src/view/userHome.ejs', c);
