const express = require('express');
const routeIndex = require('./routes/index');
const createError = require('http-errors');

const app = express();

// link to the static files
app.use('/static', express.static('public'));

// use Pug as the view engine
app.set('view engine', 'pug');

// get access to the request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use the routes from the routes directory
app.use('/', routeIndex);

// TODO: Check if error handler works correctly:
// handle sever and general errors
// app.use((err, req, res, next) => {
//     // res.locals.error = err;
//     res.status(err.status);
//     console.log(`Error Status: ${err.status}`);
//     res.render('error', {title: "Error"});
// });

// catch 404 and forward to error handler
// app.use( (req, res, next) => {
//     next(createError(404));
// });

// handle 404 errors
app.use((req, res) => {
    res.status(404);
    res.render('page-not-found', {title: 'Page Not Found'});
});

// handle sever and general errors
app.use( (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(`Error Status: ${err.status}`);
    res.render('error', {title: 'Error'});
});

// app listens on port 3000
app.listen(3000, () => {
    console.log('The application is running on localhost:3000');
});
