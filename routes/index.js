const express = require('express');
const router = express.Router();

const db = require('../db');
const {Book} = db.models;
const {Op} = db.sequelize;

// handler function to wrap the routes
function asyncHandler(callback) {
    return async (req, res, next) => {
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

// get new book route
router.get('/books/new', (req, res) => {
    res.render('new-book', {title: "New Book"});
});

// post new book route
router.post('/books/new', asyncHandler(async (req, res) => {
    let bookData;
    try {
        bookData = await Book.create(req.body);
        res.redirect('/');
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            bookData = await Book.build(req.body);
            res.render('form-error', {bookData, errors: error.errors, title: "Update Book"})
        } else {
            throw error;
        }
    }
}));

// book detail route
router.get('/books/:id', asyncHandler(async (req, res) => {
    const {id} = req.params;

    const bookData = await Book.findByPk(id, {
        attributes: ['id', 'title', 'author', 'genre', 'year']
    });

    res.render('update-book', {title: bookData.title, bookData});
}));

// update book route
router.post('/books/:id', asyncHandler(async (req, res) => {
    const bookToUpdate = await Book.findByPk(req.params.id);

    if (bookToUpdate) {
        bookToUpdate.title = req.body.title;
        bookToUpdate.author = req.body.author;
        bookToUpdate.genre = req.body.genre;
        bookToUpdate.year = req.body.year;
        await bookToUpdate.save();
        res.redirect('/');
    } else {
        res.sendStatus(404);
    }
}));

// delete book routes
router.get('/books/:id/delete', asyncHandler(async (req, res) => {
    const bookToDelete = await Book.findByPk(req.params.id);

    if (bookToDelete) {
        res.render('delete-book', {bookData: bookToDelete, title: "Delete Book"});
    } else {
        res.sendStatus(404);
    }
}));

router.post('/books/:id/delete', asyncHandler(async (req, res) => {
    const bookToDelete = await Book.findByPk(req.params.id);

    if (bookToDelete) {
        await bookToDelete.destroy();
        res.redirect('/');
    } else {
        res.sendStatus(404);
    }
}));

module.exports = router;
