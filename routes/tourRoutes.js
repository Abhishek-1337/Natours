const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');
// router.param('id', tourController.checkID);

router.use('/:tourId/reviews', reviewRouter);

router
    .route('/tour-stats')
    .get(tourController.getTourStats);

router
    .route('/get-monthly-plan/:year')
    .get(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan
    );

//tours-within/:distance/center/:latlng/unit/:unit
router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);

router
    .route('/distances/:latlng/unit/:unit')
    .get(tourController.getDistances);

router
    .route('/5-cheap-tours')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour
    );

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'),
        tourController.updateTourImages,
        tourController.resizeTourImages,
        tourController.updateTour
    )
    .delete(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour
    );

module.exports = router;