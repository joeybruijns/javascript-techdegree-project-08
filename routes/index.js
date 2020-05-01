const express = require('express');
const router = express.Router();

// home route (redirects to book list)
router.get('/', (req, res) => {
   res.render('index');
});

// book list route


// book detail route


// new book route


// update book route


// delete book route


module.exports = router;