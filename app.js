const express = require('express');
const routeIndex = require('./routes/index');

const app = express();

// link to the static files
app.use('/static', express.static('public'));

// use Pug as the view engine
app.set('view engine', 'pug');

// use the routes from the routes directory
app.use('/', routeIndex);

// TODO: Check if error handler works correctly:
// handle general errors

// app.use((err, req, res) => {
//     res.locals.error = err;
//     res.status(err.status);
//     console.log(`Error Status: ${err.status}`);
//     res.render('error', {title: "Error"});
// });

// app.use( (err, req, res) => {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

// handle 404 errors
app.use((req, res) => {
    res.status(404);
    res.render('page-not-found', {title: 'Page Not Found'})
});

// app listens on port 3000
app.listen(3000, () => {
    console.log('The application is running on localhost:3000');
});