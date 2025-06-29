const express = require('express');

const router = express.Router();

router.get('/home');
router.get('/all');
router.get('/myschl');

module.exports = router ;