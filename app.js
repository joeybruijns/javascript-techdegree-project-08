const express = require('express');
const routeIndex = require('./routes/index');

const app = express();

// link to the static files
app.use('/static', express.static('public'));

// use Pug as the view engine
app.set('view engine', 'pug');

// use the routes from the routes directory
app.use('/', routeIndex);

//TODO: Add error handling here
// error handling

// app listens on port 3000
app.listen(3000, () => {
    console.log('The application is running on localhost:3000');
});