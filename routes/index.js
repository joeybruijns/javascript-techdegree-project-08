const express = require('express');
const router = express.Router();

const db = require('../db');
const {Book} = db.models;
const {Op} = db.sequelize;

// update book route
router.get('/update-book', (req, res) => {
    res.render('update-book', {title: "TITLE"});
});

// new book route
router.get('/new-book', (req, res) => {
    res.render('new-book', {title: "New Book"});
});

// delete book route


// reading from database
(async () => {
    await db.sequelize.sync();

    let bookData;

    try {
        const books = await Book.findAll({
            attributes: ['title', 'author', 'genre', 'year']
        });
        bookData = books.map(book => book.toJSON());
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            console.error('Validation errors: ', errors);
        } else {
            throw error;
        }
    }

    // home route (redirects to book list)
    // book list route
    router.get('/', (req, res) => {
        res.render('index', {title: "Books", bookData: bookData})
    });

})();

module.exports = router;
