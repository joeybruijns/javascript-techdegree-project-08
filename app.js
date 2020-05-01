const express = require('express');
const routeIndex = require('./routes/index');

const app = express();

// use Pug as the view engine
app.set('view engine', 'pug');

// use the routes from the routes directory
app.use('/', routeIndex);

// error handling

// app listens on port 3000
app.listen(3000, () => {
    console.log('The application is running on localhost:3000');
});