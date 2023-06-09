const express = require('express');
const Router = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

Router.use(authController.isLoggedIn);

Router.get('/', viewController.getOverview);
Router.get('/tour/:slug', viewController.getTour);
Router
    .route('/login')
    .get(viewController.getLoginForm);

module.exports = Router;