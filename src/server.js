const express = require('express');
require('dotenv').config();
const WebRoute = require('./routes/web');
const configViewEngine = require('./config/viewEngine');
const db = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOST_NAME || 'localhost';

configViewEngine(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', WebRoute);

async function start() {
  try {
    const connection = await db.createConnection();
    await connection.query('SELECT 1');

    app.listen(port, hostname, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
}

start();
