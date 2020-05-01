const express = require('express');
const router = express.Router();

// home route (redirects to book list)
router.get('/', (req, res) => {
   res.render('index', {title: "Books"});
});

// book list route


// update book route
router.get('/update-book', (req, res) => {
   res.render('update-book', {title: "TITLE"});
});

// new book route
router.get('/new-book', (req, res) => {
   res.render('update-book', {title: "New Book"});
});

// delete book route


module.exports = router;