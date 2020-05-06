const express = require('express');
const router = express.Router();

// home route (redirects to book list)
router.get('/', (req, res) => {
    res.redirect('/books');
});

module.exports = router;
