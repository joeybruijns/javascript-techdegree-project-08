const express = require('express');
const router = express.Router();

const db = require('../db');
const {Book} = db.models;
const {Op} = db.Sequelize;

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
    const search = req.query.search;

    if (!search) {
        const bookData = await Book.findAll({
            attributes: ['id', 'title', 'author', 'genre', 'year'],
            order: [['title', 'ASC']]
        }).map(book => book.toJSON());
        res.render('index', {title: "Books", bookData})
    } else {
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
        res.render('search-results', {title: "Search Results", bookSearchData});
    }


}));

// router.get('/books/search', asyncHandler(async (req, res) => {
//     const search = req.query.search;
//     let checker = false;
//
//     if (search) {
//         const bookData = await Book.findAll({
//             attributes: ['id', 'title', 'author', 'genre', 'year'],
//             order: [['title', 'ASC']],
//             where: {
//                 [Op.or]: [
//                     {title: {[Op.like]: `%${search}%`}},
//                     {author: {[Op.like]: `%${search}%`}},
//                     {genre: {[Op.like]: `%${search}%`}},
//                     {year: {[Op.like]: `%${search}%`}}
//                 ]
//             }
//         });
//
//         if (bookData) {
//             checker = true;
//         }
//
//
//         res.render('index', {title: "Search Results", bookData});
//     } else {
//         res.status(404).render('page-not-found', {title: 'Page Not Found'});
//     }
// }));

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

// get search book route
// router.get('/books/search', (req, res) => {
//     res.render('search', {title: "Search Book"});
// });

// post search book route


// get search results route
// router.get('/books/search', (req, res) => {
//     res.render('search', {title: "Search Book"});
// });

// book detail route
router.get('/books/:id', asyncHandler(async (req, res) => {
    const {id} = req.params;

    const bookData = await Book.findByPk(id, {
        attributes: ['id', 'title', 'author', 'genre', 'year']
    });
    if (bookData) {
        res.render('update-book', {title: bookData.title, bookData});
    } else {
        res.status(404).render('page-not-found', {title: 'Page Not Found'});
    }
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
        res.status(404).render('page-not-found', {title: 'Page Not Found'});
    }
}));

// delete book routes
router.get('/books/:id/delete', asyncHandler(async (req, res) => {
    const bookToDelete = await Book.findByPk(req.params.id);

    if (bookToDelete) {
        res.render('delete-book', {bookData: bookToDelete, title: "Delete Book"});
    } else {
        res.status(404).render('page-not-found', {title: 'Page Not Found'});
    }
}));

router.post('/books/:id/delete', asyncHandler(async (req, res) => {
    const bookToDelete = await Book.findByPk(req.params.id);

    if (bookToDelete) {
        await bookToDelete.destroy();
        res.redirect('/');
    } else {
        res.status(404).render('page-not-found', {title: 'Page Not Found'});
    }
}));

module.exports = router;
