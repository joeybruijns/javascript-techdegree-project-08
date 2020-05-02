const express = require('express');
const router = express.Router();

const db = require('../db');
const {Book} = db.models;
const {Op} = db.sequelize;

// new book route
router.get('/books/new', (req, res) => {
    res.render('new-book', {title: "New Book"});
});

// delete book route


// reading from database
(async () => {
    await db.sequelize.sync();

    let bookData;

    try {
        const books = await Book.findAll({
            attributes: ['id', 'title', 'author', 'genre', 'year']
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
    router.get('/', (req, res) => {
        res.redirect('/books');
    });

    // book list route
    router.get('/books', (req, res) => {
        res.render('index', {title: "Books", bookData: bookData})
    });

    // update book route
    router.get('/book/:id', (req, res) => {
        const {id} = req.params;

        let title = "";
        let author = "";
        let genre = "";
        let year = "";

        bookData.forEach(book => {
            if (book.id.toString() === id) {
                title = book.title;
                author = book.author;
                genre = book.genre;
                year = book.year.toString();
            }
        });

        const currentBookData = {title, author, genre, year};

        res.render('update-book', {title: title, currentBookData});
    });

})();

module.exports = router;
