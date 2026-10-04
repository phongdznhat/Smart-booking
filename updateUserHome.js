const fs = require('fs');

let c = fs.readFileSync('src/view/userHome.ejs', 'utf8');

const regex = /<div class="service-card__media">[\s\S]*?<% if \(r\.Type\) { %>/m;
const replacement = `<div class="service-card__media">
                    <% if (r.ImageUrl) { %>
                      <img src="<%= r.ImageUrl %>" alt="<%= r.Name %>" />
                    <% } else if (r.Type === 'Phòng họp') { %>
                      <img src="/image/service-ops.jpg" alt="<%= r.Name %>" />
                    <% } else if (r.Type === 'Y tế') { %>
                      <img src="/image/service-support.jpg" alt="<%= r.Name %>" />
                    <% } else if (r.Type === 'Bảo trì') { %>
                      <img src="/image/service-maintenance.jpg" alt="<%= r.Name %>" />
                    <% } else { %>
                      <img src="/image/service-tech.jpg" alt="<%= r.Name %>" />
                    <% } %>

                    <% if (r.Type) { %>`;

c = c.replace(regex, replacement);

const cssInject = `
    <style>
      .services-grid {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        gap: 20px;
        padding-bottom: 20px;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
      .service-card {
        flex: 0 0 calc(25% - 15px);
        scroll-snap-align: start;
        min-width: 280px;
      }
      .services-grid::-webkit-scrollbar {
        height: 8px;
      }
      .services-grid::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      .services-grid::-webkit-scrollbar-thumb {
        background-color: #cbd5e1;
        border-radius: 4px;
      }
      @media (max-width: 1024px) {
        .service-card { flex: 0 0 calc(33.333% - 14px); }
      }
      @media (max-width: 768px) {
        .service-card { flex: 0 0 calc(50% - 10px); }
      }
      @media (max-width: 480px) {
        .service-card { flex: 0 0 100%; }
      }
    </style>
  </head>`;

c = c.replace('</head>', cssInject);

fs.writeFileSync('src/view/userHome.ejs', c);
