const express = require('express');
const app = express();
const path = require('node:path');
require('dotenv').config({ path:'./.env' });

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));



const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Frontend running at ${port}`);
});
