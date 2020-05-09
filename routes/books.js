const express = require('express');
const router = express.Router();

const db = require('../db');
const {Book} = db.models;
const {Op} = db.Sequelize;

// handler function for the routes
function asyncHandler(callback) {
    return async (req, res, next) => {
        try {
            await callback(req, res, next);
        } catch (error) {
            res.status(500).render('errors/error', {title: 'Error'})
        }
    }
}

// GET book list route with search functionality
router.get('/', asyncHandler(async (req, res) => {
    const search = req.query.search;

    // if no search value is entered render the index page with all the data
    if (!search) {
        const bookData = await Book.findAll({
            attributes: ['id', 'title', 'author', 'genre', 'year'],
            order: [['title', 'ASC']]
        }).map(book => book.toJSON());

        if (bookData) {
            res.render('index', {title: "Books", bookData});
        } else {
            res.status(404).render('errors/page-not-found', {title: 'Page Not Found'});
        }
    } else {
        // bookSearchData contains only the books that match the search
        const bookSearchData = await Book.findAll({
            attributes: ['id', 'title', 'author', 'genre', 'year'],
            order: [['title', 'ASC']],
            where: {
                [Op.or]: [
                    {title: {[Op.like]: `%${search}%`}},
                    {author: {[Op.like]: `%${search}%`}},
                    {genre: {[Op.like]: `%${search}%`}},
                    {year: {[Op.like]: `%${search}%`}}
                ]
            }
        }).map(book => book.toJSON());

        if (bookSearchData) {
            const searchResults = bookSearchData.length > 0;
            res.render('books/search-results', {title: "Search Results", bookSearchData, searchResults});
        } else {
            res.status(404).render('errors/page-not-found', {title: 'Page Not Found'});
        }
    }
}));

// GET new book route
router.get('/new', (req, res) => {
    res.render('books/new-book', {formError: false, title: "New Book"});
});

// POST new book route
router.post('/new', asyncHandler(async (req, res) => {
    let bookData;

    try {
        bookData = await Book.create(req.body);
        res.redirect('/');
    } catch (error) {
        // handle error if value for title and author is not provided
        if (error.name === "SequelizeValidationError") {
            bookData = await Book.build(req.body);
            res.render('books/new-book', {bookData, formError: true, errors: error.errors, title: "New Book"})
        } else {
            throw error;
        }
    }
}));

// GET book detail route
router.get('/:id', asyncHandler(async (req, res) => {
    const {id} = req.params;

    const bookToUpdate = await Book.findByPk(id, {
        attributes: ['id', 'title', 'author', 'genre', 'year']
    });
    if (bookToUpdate) {
        res.render('books/update-book', {formError: false, title: bookToUpdate.title, bookToUpdate});
    } else {
        res.status(500).render('errors/error', {title: 'Error'});
    }
}));

// POST update book route
router.post('/:id', asyncHandler(async (req, res) => {
    const {id} = req.params;
    let bookToUpdate;

    try {
        bookToUpdate = await Book.findByPk(id);
        if (bookToUpdate) {
            await bookToUpdate.update(req.body);
        } else {
            res.status(404).render('errors/page-not-found', {title: 'Page Not Found'});
        }
        res.redirect('/');
    } catch (error) {
        // handle error if value for title and author is not provided
        if (error.name === "SequelizeValidationError") {
            bookToUpdate = await Book.build(req.body);
            bookToUpdate.id = id;
            res.render('books/update-book', {bookToUpdate, formError: true, errors: error.errors, title: "Update Book"})
        } else {
            throw error;
        }
    }
}));

// GET delete book routes
router.get('/:id/delete', asyncHandler(async (req, res) => {
    const bookToDelete = await Book.findByPk(req.params.id);

    // if bookToDelete exists render the delete-book page to confirm delete
    if (bookToDelete) {
        res.render('books/delete-book', {bookData: bookToDelete, title: "Delete Book"});
    } else {
        res.status(404).render('errors/page-not-found', {title: 'Page Not Found'});
    }
}));

// POST delete book routes
router.post('/:id/delete', asyncHandler(async (req, res) => {
    const bookToDelete = await Book.findByPk(req.params.id);

    if (bookToDelete) {
        await bookToDelete.destroy();
        res.redirect('/');
    } else {
        res.status(404).render('errors/page-not-found', {title: 'Page Not Found'});
    }
}));

module.exports = router;
