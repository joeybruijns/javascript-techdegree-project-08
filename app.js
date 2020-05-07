const express = require('express');
const routeIndex = require('./routes/index');
const routeBooks = require('./routes/books');
const app = express();

// link to the static files
app.use('/static', express.static('public'));

// use Pug as the view engine
app.set('view engine', 'pug');

// get access to the request body
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// use the routes from the routes directory
app.use('/', routeIndex);
app.use('/books', routeBooks);

// handle 404 errors
app.use((req, res) => {
    res.status(404);
    res.render('errors/page-not-found', {title: 'Page Not Found'});
});

// handle sever and general errors
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(`Error Status: ${err.status}`);
    res.render('errors/error', {title: 'Error'});
});

// app listens on port 3000
app.listen(3000, () => {
    console.log('The application is running on localhost:3000');
});
