const express = require('express');
const router = express.Router();

const db = require('../db');
const {Book} = db.models;
const {Op} = db.sequelize;

// handler function to wrap the routes
function asyncHandler(callback) {
    return async(req, res, next) => {
        try {
            await callback(req, res, next);
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

// home route (redirects to book list)
router.get('/', (req, res) => {
    res.redirect('/books');
});

// book list route
router.get('/books', asyncHandler(async (req, res) => {
    const bookData = await Book.findAll({
        attributes: ['id', 'title', 'author', 'genre', 'year'],
        order: [['title', 'ASC']]
    }).map(book => book.toJSON());
    res.render('index', {title: "Books", bookData: bookData})
}));

// update book route
router.get('/book/:id', asyncHandler(async (req, res) => {
    const {id} = req.params;

    const bookData = await Book.findByPk(id, {
        attributes: ['title', 'author', 'genre', 'year']
    });

    // let title = "";
    // let author = "";
    // let genre = "";
    // let year = "";
    //
    // bookData.forEach(book => {
    //     if (book.id.toString() === id) {
    //         title = book.title;
    //         author = book.author;
    //         genre = book.genre !== null ? book.genre : "";
    //         year = book.year !== null ? book.year.toString() : "";
    //     }
    // });
    //
    // const currentBookData = {title, author, genre, year};

    res.render('update-book', {title: bookData.title, bookData});
}));


// get new book route
router.get('/books/new', (req, res) => {
    res.render('new-book', {title: "New Book"});
});

// post new book route
router.post('/', asyncHandler(async (req, res) => {
    let bookData;
    try {
        bookData = await Book.create(req.body);
        res.redirect('/');
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            bookData = await Book.build(req.body);
            res.render("form-error", {bookData, errors: error.errors, title: "Update Book"})
        } else {
            throw error;
        }
    }
}));

// delete book route


module.exports = router;
