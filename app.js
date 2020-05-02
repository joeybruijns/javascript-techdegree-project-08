const express = require('express');
const routeIndex = require('./routes/index');

const app = express();

// link to the static files
app.use('/static', express.static('public'));

// use Pug as the view engine
app.set('view engine', 'pug');

// use the routes from the routes directory
app.use('/', routeIndex);

// handle general errors
app.use((err, req, res) => {
    res.locals.error = err;
    res.status(err.status);
    console.log(`Error Status: ${err.status}`);
    res.render('error', {title: "Error"});
});

// handle 404 errors
app.use((req, res) => {
    res.status(404);
    res.render('page-not-found', {title: 'Page Not Found'})
});

// app listens on port 3000
app.listen(3000, () => {
    console.log('The application is running on localhost:3000');
});