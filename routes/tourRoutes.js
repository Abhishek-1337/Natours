const express = require('express');
const router = express.Router();
const { getAllTours, createTour } = require('../controllers/tourController');
router
    .route('/')
    .get(getAllTours)
    .post(createTour);

module.exports = router;