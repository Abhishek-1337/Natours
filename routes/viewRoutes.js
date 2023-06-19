const express = require('express');
const Router = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

Router.get(
            '/',
            bookingController.createBookingCheckout, 
            authController.isLoggedIn, 
            viewController.getOverview
          );
Router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
Router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
Router.get('/me', authController.protect, viewController.getAccount);
Router.get('/my-tours', authController.protect, viewController.getMyTour);

module.exports = Router;