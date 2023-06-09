const express = require('express');
const Router = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

Router.get('/', viewController.getOverview);
Router.get('/tour/:slug', authController.protect, viewController.getTour);
Router
    .route('/login')
    .get(viewController.getLoginForm);

module.exports = Router;